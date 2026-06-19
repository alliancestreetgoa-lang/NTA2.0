import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Photorealistic 3D Earth (Three.js): day/night shader blend (city lights on the
 * night side), specular ocean glint, a drifting cloud layer, atmosphere rim glow,
 * and glowing gold trade-route arcs with traveling pulses. Earth textures are the
 * public-domain NASA set served (with CORS) from the three.js repo. Falls back to
 * a no-op where WebGL is unavailable (e.g. jsdom tests). `animate` toggles spin.
 */

const TEX = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets'
const D2R = Math.PI / 180

function lonLatToVec3(lon: number, lat: number, r: number) {
  const phi = (90 - lat) * D2R
  const theta = (lon + 180) * D2R
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

function makeDotTexture() {
  const s = 32
  const cv = document.createElement('canvas')
  cv.width = cv.height = s
  const c = cv.getContext('2d')!
  const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  c.fillStyle = g
  c.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(cv)
}

export default function HeroCanvas({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const world = new THREE.Group()
    world.rotation.z = 0.34
    world.rotation.x = 0.12
    scene.add(world)

    const globeSpin = new THREE.Group()
    world.add(globeSpin)

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    const dayMap = loader.load(`${TEX}/earth_atmos_2048.jpg`)
    const nightMap = loader.load(`${TEX}/earth_lights_2048.png`)
    const specMap = loader.load(`${TEX}/earth_specular_2048.jpg`)
    dayMap.colorSpace = THREE.SRGBColorSpace
    nightMap.colorSpace = THREE.SRGBColorSpace
    const maxAniso = renderer.capabilities.getMaxAnisotropy()
    ;[dayMap, nightMap, specMap].forEach((t) => (t.anisotropy = maxAniso))

    const SUN = new THREE.Vector3(0.7, 0.32, 0.72).normalize()

    // Earth — custom shader blending day/night by sun direction, with ocean specular.
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        specMap: { value: specMap },
        uSun: { value: SUN },
        uCamera: { value: camera.position },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormalW;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform sampler2D specMap;
        uniform vec3 uSun;
        uniform vec3 uCamera;
        varying vec2 vUv;
        varying vec3 vNormalW;
        varying vec3 vWorldPos;
        void main() {
          vec3 N = normalize(vNormalW);
          vec3 V = normalize(uCamera - vWorldPos);
          vec3 night = texture2D(nightMap, vUv).rgb;
          float water = texture2D(specMap, vUv).r;
          // "Black marble": dark night earth everywhere — oceans deep navy,
          // land a touch lighter charcoal so continents are still readable.
          vec3 oceanBase = vec3(0.012, 0.035, 0.095);
          vec3 landBase = vec3(0.05, 0.055, 0.06);
          vec3 base = mix(landBase, oceanBase, water);
          // warm city lights glowing across the whole globe
          vec3 lights = night * vec3(1.35, 1.1, 0.72) * 2.4;
          vec3 col = base + lights;
          // limb darkening for a round 3D sphere
          float ndv = clamp(dot(N, V), 0.0, 1.0);
          col *= 0.5 + 0.5 * smoothstep(0.0, 0.85, ndv);
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
      `,
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat)
    globeSpin.add(earth)

    // Atmosphere rim glow
    const atmoMat = (color: number, power: number, strength: number) =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(color) }, uPow: { value: power }, uStr: { value: strength } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uPow;
          uniform float uStr;
          varying vec3 vNormal;
          void main() {
            float i = pow(0.74 - dot(vNormal, vec3(0.0, 0.0, 1.0)), uPow);
            gl_FragColor = vec4(uColor, 1.0) * clamp(i, 0.0, 1.0) * uStr;
          }
        `,
      })
    // Inner crisp rim + outer soft halo for a stronger atmosphere glow.
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 64), atmoMat(0x4da2f0, 2.4, 1.6))
    const atmoHalo = new THREE.Mesh(new THREE.SphereGeometry(1.32, 64, 64), atmoMat(0x3a7fd0, 1.6, 0.7))
    world.add(atmosphere, atmoHalo)

    // Trade hubs + arcs (gold, on top of the Earth)
    const hub = { name: 'Dubai', lat: 25.2, lon: 55.3 }
    const spokes = [
      { name: 'Rotterdam', lat: 51.9, lon: 4.5 },
      { name: 'Singapore', lat: 1.3, lon: 103.8 },
      { name: 'Houston', lat: 29.8, lon: -95.4 },
      { name: 'Shanghai', lat: 31.2, lon: 121.5 },
      { name: 'Mumbai', lat: 19.1, lon: 72.9 },
      { name: 'Lagos', lat: 6.5, lon: 3.4 },
      { name: 'London', lat: 51.5, lon: -0.1 },
      { name: 'New York', lat: 40.7, lon: -74.0 },
    ]
    const dotTex = makeDotTexture()
    ;[hub, ...spokes].forEach((p) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color: 0xff7a45, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      sprite.position.copy(lonLatToVec3(p.lon, p.lat, 1.02))
      sprite.scale.setScalar(p === hub ? 0.12 : 0.07)
      globeSpin.add(sprite)
    })

    const arcs = spokes.map((p) => {
      const a = lonLatToVec3(hub.lon, hub.lat, 1)
      const b = lonLatToVec3(p.lon, p.lat, 1)
      const mid = a.clone().add(b).multiplyScalar(0.5)
      mid.normalize().multiplyScalar(1 + 0.15 + a.distanceTo(b) * 0.12)
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64))
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: 0xff5a1f, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }),
      )
      globeSpin.add(line)
      const pulse = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color: 0xffa06a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      pulse.scale.setScalar(0.055)
      globeSpin.add(pulse)
      return { name: p.name, curve, line, pulse, speed: 0.12 + Math.random() * 0.12, offset: Math.random() }
    })

    // Hub sequence the globe spins through as the page scrolls.
    const sequence = [
      { lat: 25.2, lon: 55.3 }, // Dubai
      { lat: 19.1, lon: 72.9 }, // Mumbai
      { lat: 1.3, lon: 103.8 }, // Singapore
      { lat: 31.2, lon: 121.5 }, // Shanghai
      { lat: 29.8, lon: -95.4 }, // Houston
      { lat: 51.5, lon: -0.1 }, // London
    ]
    const seqNames = ['Dubai', 'Mumbai', 'Singapore', 'Shanghai', 'Houston', 'London']
    const yawFor = (lon: number) => (-90 - lon) * D2R
    const pitchFor = (lat: number) => Math.max(-0.45, Math.min(0.45, -lat * D2R * 0.6))

    let w = 0
    let h = 0
    const layout = () => {
      const parent = canvas.parentElement
      w = parent?.clientWidth ?? window.innerWidth
      h = parent?.clientHeight ?? window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const wide = w >= 1024
      world.scale.setScalar(wide ? 2.7 : Math.min(2.2, (w / 520) * 2))
      world.position.set(wide ? 2.1 : 0.4, wide ? -0.1 : 0.8, 0)
    }
    layout()
    window.addEventListener('resize', layout)

    // --- Scroll progress drives which hub the globe faces ---
    let scrollP = 0
    const onScroll = () => {
      // Map the hub sequence over the first ~1.8 viewports, where the hero
      // globe is on screen, so the spin is visible as you start scrolling.
      const max = window.innerHeight * 1.8
      scrollP = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // --- Pointer interaction: drag to rotate (with momentum) ---
    const BASE_TILT_X = world.rotation.x
    let userYaw = 0
    let userPitch = 0
    let velYaw = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'pan-y'

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      dragging = true
      velYaw = 0
      lastX = e.clientX
      lastY = e.clientY
      canvas.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      userYaw += dx * 0.006
      userPitch = Math.max(-0.55, Math.min(0.55, userPitch + dy * 0.005))
      velYaw = dx * 0.006
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = () => {
      dragging = false
      canvas.style.cursor = 'grab'
    }
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    const clock = new THREE.Clock()
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tmpScale = new THREE.Vector3()
    let curYaw = yawFor(sequence[0].lon)
    let curPitch = BASE_TILT_X + pitchFor(sequence[0].lat)
    let raf = 0
    const loop = () => {
      const dt = clock.getDelta()
      if (!dragging) {
        userYaw += velYaw
        velYaw *= 0.92
        if (Math.abs(velYaw) < 1e-4) velYaw = 0
      }
      // Interpolated hub from scroll progress
      const idx = scrollP * (sequence.length - 1)
      const i0 = Math.floor(idx)
      const i1 = Math.min(i0 + 1, sequence.length - 1)
      const f = idx - i0
      const lonI = lerp(sequence[i0].lon, sequence[i1].lon, f)
      const latI = lerp(sequence[i0].lat, sequence[i1].lat, f)
      const desiredYaw = yawFor(lonI) + userYaw
      const desiredPitch = BASE_TILT_X + pitchFor(latI) + userPitch
      const ease = dragging ? 0.4 : 0.07
      curYaw = lerp(curYaw, desiredYaw, ease)
      curPitch = lerp(curPitch, desiredPitch, ease)
      globeSpin.rotation.y = curYaw
      world.rotation.x = curPitch

      // Highlight the active hub's arc
      const activeName = seqNames[Math.round(idx)]
      arcs.forEach((arc) => {
        const active = arc.name === activeName
        const mat = arc.line.material as THREE.LineBasicMaterial
        mat.opacity += ((active ? 0.95 : 0.3) - mat.opacity) * 0.1
        const ps = active ? 0.1 : 0.05
        arc.pulse.scale.lerp(tmpScale.setScalar(ps), 0.1)
        if (animate) {
          arc.offset = (arc.offset + dt * arc.speed) % 1
          arc.curve.getPointAt(arc.offset, arc.pulse.position)
        }
      })
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    arcs.forEach((arc) => arc.curve.getPointAt(0.5, arc.pulse.position))
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      window.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      renderer.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      ;[dayMap, nightMap, specMap, dotTex].forEach((t) => t.dispose())
    }
  }, [animate])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
