/**
 * Captura de pantalla + errores de consola con Chrome headless (CDP, sin
 * dependencias). Perfil temporal propio; WebGL por software (SwiftShader), así
 * que sirve para validar aspecto y errores, NO para medir rendimiento.
 *
 *   node scripts/shot.mjs <url> <salida.png> [ancho] [alto] [esperaMs] [dpr]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [url, outFile, w = '1920', h = '1080', waitMs = '20000', dpr = '1'] = process.argv.slice(2)
if (!url || !outFile) {
  console.error('uso: node scripts/shot.mjs <url> <salida.png> [ancho] [alto] [esperaMs] [dpr]')
  process.exit(1)
}

const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const port = 9300 + Math.floor(Math.random() * 500)
const profile = await mkdtemp(join(tmpdir(), 'solaris-shot-'))

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--hide-scrollbars',
    '--no-first-run',
    `--window-size=${w},${h}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* aún arrancando */
    }
    await sleep(200)
  }
  throw new Error('Chrome no expuso CDP')
}

const ws = new WebSocket(await getWsUrl())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
const logs = []
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  } else if (msg.method === 'Runtime.consoleAPICalled') {
    const t = msg.params.type
    if (t === 'error' || t === 'warning') {
      logs.push(`[${t}] ${msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`)
    }
  } else if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text}`)
  } else if (msg.method === 'Log.entryAdded') {
    const e = msg.params.entry
    if (e.level === 'error' || e.level === 'warning') logs.push(`[${e.level}] ${e.text} ${e.url ?? ''}`)
  }
})
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const myId = ++id
    pending.set(myId, resolve)
    ws.send(JSON.stringify({ id: myId, method, params }))
  })

await send('Runtime.enable')
await send('Log.enable')
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(w),
  height: Number(h),
  deviceScaleFactor: Number(dpr),
  mobile: Number(w) < 700,
})
await send('Page.navigate', { url })
await sleep(Number(waitMs))

const shot = await send('Page.captureScreenshot', { format: 'png' })
await writeFile(outFile, Buffer.from(shot.result.data, 'base64'))

const stats = await send('Runtime.evaluate', {
  expression: `document.querySelector('[data-solaris-debug]')?.textContent ?? ''`,
  returnByValue: true,
})
if (stats.result?.result?.value) console.log(stats.result.result.value)
if (process.env.EVAL) {
  const r = await send('Runtime.evaluate', { expression: process.env.EVAL, returnByValue: true, awaitPromise: true })
  console.log('EVAL =>', JSON.stringify(r.result?.result?.value ?? r.result?.exceptionDetails ?? r, null, 1))
}
console.log(logs.length ? `\nConsola (${logs.length}):\n` + logs.join('\n') : '\nConsola: sin errores ni avisos')
console.log(`\nCaptura: ${outFile}`)

ws.close()
chrome.kill()
process.exit(0)

