# SOLARIS INTERPLANETARY — Registro de Assets y Licencias

Este documento registra la procedencia, autoría, licencia, resolución, formato, tamaño y uso de todos los recursos gráficos del motor planetario (FASE 2A y FASE 2B), conforme a la sección 8 de `SOLARIS_ENGINEERING_PLAN.md`.

## 1. Fuente, autoría y licencia general

- **Fuente oficial:** [Solar System Scope — Solar Textures](https://www.solarsystemscope.com/textures/) (basadas en datos de elevación e imágenes de misiones NASA/JPL, NOAA, ESA y USGS).
- **Autor / atribución requerida:** *INOVE / Solar System Scope* (`https://www.solarsystemscope.com/textures/`).
- **Licencia:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
  - Permite compartir, adaptar y usar con fines comerciales otorgando la atribución correspondiente.
- **Pipeline de procesamiento local:** `scripts/build-textures.mjs` (`npm run textures`) convierte los mapas fuente (`assets-src/`, no versionados en Git por peso) a tres niveles progresivos (`2k`, `4k`, `8k`) en formato **WebP** dentro de `public/textures/`.

---

## 2. Inventario de archivos fuente (`assets-src/`)

| Archivo fuente | Cuerpo / Destino | URL de origen | Resolución nativa | Formato | Tamaño original | SHA-256 (prefijo) | Uso en escena |
|---|---|---|---|---|---|---|---|
| `earth/8k_earth_daymap.jpg` | Tierra (Hero / Retorno) | `https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg` | `8192×4096` | JPEG (sRGB) | 4,35 MB | `88AB060B6E7D241C` | Albedo diurno de la superficie terrestre (`uDay`) |
| `earth/8k_earth_nightmap.jpg` | Tierra (Hero / Retorno) | `https://www.solarsystemscope.com/textures/download/8k_earth_nightmap.jpg` | `8192×4096` | JPEG (sRGB) | 3,00 MB | `9894E83A585A22C1` | Emisión nocturna de ciudades en lado oscuro (`uNight`) |
| `earth/8k_earth_clouds.jpg` | Tierra (Hero / Retorno) | `https://www.solarsystemscope.com/textures/download/8k_earth_clouds.jpg` | `8192×4096` | JPEG (Gris) | 11,08 MB | `C792ECA228989D36` | Esfera de nubes independiente + sombras proyectadas (`uClouds`) |
| `earth/8k_earth_normal_map.tif` | Tierra (Hero / Retorno) | `https://www.solarsystemscope.com/textures/download/8k_earth_normal_map.tif` | `8192×4096` | TIFF (Linear) | 9,05 MB | `79D6DBBDE340C653` | Mapa de normales topográfico continental (`uNormal`) |
| `earth/8k_earth_specular_map.tif` | Tierra (Hero / Retorno) | `https://www.solarsystemscope.com/textures/download/8k_earth_specular_map.tif` | `8192×4096` | TIFF (Linear) | 1,76 MB | `194E67EF7F14DD50` | Máscara especular oceánica y atenuación de relieve en mar (`uSpecular`) |
| `sky/8k_stars_milky_way.jpg` | Fondo espacial global | `https://www.solarsystemscope.com/textures/download/8k_stars_milky_way.jpg` | `8192×4096` | JPEG (sRGB) | 1,82 MB | `1FD005DDD6D53364` | Esfera celeste de la Vía Láctea (`Skybox.tsx`) |
| `sun/8k_sun.jpg` | Sol (Centro del sistema) | `https://www.solarsystemscope.com/textures/download/8k_sun.jpg` | `4096×2048` | JPEG (sRGB) | 3,53 MB | `F22B1CFB306DDCE7` | Fotosfera solar emisiva con convección animada (`Sun.tsx`) |
| `mercury/8k_mercury.jpg` | `mercury-solar-frontier` | `https://www.solarsystemscope.com/textures/download/8k_mercury.jpg` | `8192×4096` | JPEG (sRGB) | 14,34 MB | `5C8BD885AE3571C6` | Albedo y relieve por gradiente de cráteres (`Mercury.tsx`) |
| `venus/8k_venus_surface.jpg` | `venus-cloud-haven` | `https://www.solarsystemscope.com/textures/download/8k_venus_surface.jpg` | `8192×4096` | JPEG (sRGB) | 11,94 MB | `9BC21A50577ED8AC` | Capa inferior de relieve volcánico filtrada (`Venus.tsx`) |
| `venus/4k_venus_atmosphere.jpg` | `venus-cloud-haven` | `https://www.solarsystemscope.com/textures/download/4k_venus_atmosphere.jpg` | `4096×2048` | JPEG (sRGB) | 1,47 MB | `A14AEBA3C6AD7A56` | Cubierta densa en super-rotación de ácido sulfúrico (`Venus.tsx`) |
| `mars/8k_mars.jpg` | `mars-red-frontier` | `https://www.solarsystemscope.com/textures/download/8k_mars.jpg` | `8192×4096` | JPEG (sRGB) | 8,01 MB | `4CC52149924ABC6A` | Albedo rojizo, relieve de cañones y casquetes polares (`Mars.tsx`) |
| `jupiter/8k_jupiter.jpg` | `jupiter-europa-station` | `https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg` | `4096×2048` | JPEG (sRGB) | 2,94 MB | `0BD844BF20822C4E` | Bandas zonales y Gran Mancha Roja (`Jupiter.tsx`) |
| `saturn/8k_saturn.jpg` | `saturn-titan-station` / `saturn-ring-observation` | `https://www.solarsystemscope.com/textures/download/8k_saturn.jpg` | `4096×2048` | JPEG (sRGB) | 1,05 MB | `0D39A4A490C87C3E` | Bandas atmosféricas doradas con sombra de anillos (`Saturn.tsx`) |
| `saturn/8k_saturn_ring_alpha.png` | `saturn-titan-station` / `saturn-ring-observation` | `https://www.solarsystemscope.com/textures/download/8k_saturn_ring_alpha.png` | `8192×500` | PNG (RGBA) | 0,06 MB | `F1F826933C9FF87D` | Geometría independiente de anillos + máscara de sombra (`Saturn.tsx`) |

---

## 3. Niveles optimizados servidos en producción (`public/textures/`)

El manifiesto completo de tamaños exactos en bytes se genera automáticamente en [`public/textures/manifest.json`](../public/textures/manifest.json).

| Grupo | Archivo WebP | Nivel `2k` (carga base inmediata) | Nivel `4k` (calidad media) | Nivel `8k` (calidad alta/ultra en primer plano) |
|---|---|---|---|---|
| `earth` | `day.webp`, `night.webp`, `clouds.webp`, `normal.webp`, `specular.webp` | 1,09 MB total (5 mapas) | 4,16 MB total | 14,81 MB total |
| `sky` | `milkyway.webp` | 0,04 MB | 0,15 MB | 0,43 MB |
| `sun` | `albedo.webp` | 0,37 MB | 0,92 MB | 2,42 MB |
| `mercury` | `albedo.webp` | 0,60 MB | 2,77 MB | 13,12 MB |
| `venus` | `surface.webp`, `atmosphere.webp` | 0,49 MB total | 2,16 MB total | 7,87 MB total |
| `mars` | `albedo.webp` | 0,31 MB | 1,09 MB | 4,31 MB |
| `jupiter` | `albedo.webp` | 0,20 MB | 0,69 MB | 1,67 MB |
| `saturn` | `albedo.webp`, `rings.webp` (RGBA) | 0,06 MB total | 0,18 MB total | 0,53 MB total |

### Estrategia de memoria GPU (VRAM)
- Todos los cuerpos cargan inicialmente el nivel `2k` (~3,16 MB en total para todo el sistema solar), garantizando que la vista general del sistema solar sea instantánea.
- Únicamente el planeta que se encuentra **en primer plano** (`useIsBodyFocused`) solicita y mantiene en VRAM el paquete `8k` (o `4k` según el perfil de hardware), liberando automáticamente la textura `8k` al cambiar a otro destino.
