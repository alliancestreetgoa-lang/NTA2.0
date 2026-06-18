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
          vec3 L = normalize(uSun);
          float cosA = dot(N, L);
          float dayAmt = smoothstep(-0.25, 0.32, cosA);
          vec3 day = texture2D(dayMap, vUv).rgb;
          vec3 night = texture2D(nightMap, vUv).rgb;
          float diff = clamp(cosA, 0.0, 1.0);
          float water = texture2D(specMap, vUv).r;
          vec3 dayLit = day * (0.85 + 0.55 * diff);
          // lift oceans to a vivid blue marble (water mask = specular map)
          vec3 ocean = vec3(0.09, 0.26, 0.5) * (0.55 + 0.6 * diff);
          dayLit = mix(dayLit, ocean, water * 0.6);
          vec3 V = normalize(uCamera - vWorldPos);
          vec3 H = normalize(L + V);
          float spec = pow(max(dot(N, H), 0.0), 80.0) * water * dayAmt;
          vec3 col = mix(night * 1.4, dayLit, dayAmt) + vec3(1.0, 0.92, 0.7) * spec * 0.4;
          // gentle limb darkening — keeps the sphere round without going dark
          float ndv = clamp(dot(N, V), 0.0, 1.0);
          col *= 0.72 + 0.28 * smoothstep(0.0, 0.85, ndv);
          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(vec3(lum), col, 1.3); // saturation boost
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
    const hub = { lat: 25.2, lon: 55.3 } // Dubai
    const spokes = [
      { lat: 51.9, lon: 4.5 },
      { lat: 1.3, lon: 103.8 },
      { lat: 29.8, lon: -95.4 },
      { lat: 31.2, lon: 121.5 },
      { lat: 19.1, lon: 72.9 },
      { lat: 6.5, lon: 3.4 },
      { lat: 51.5, lon: -0.1 },
      { lat: 40.7, lon: -74.0 },
    ]
    const dotTex = makeDotTexture()
    ;[hub, ...spokes].forEach((p) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color: 0xeac56a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
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
      globeSpin.add(
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }),
        ),
      )
      const pulse = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color: 0xf0d488, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      pulse.scale.setScalar(0.055)
      globeSpin.add(pulse)
      return { curve, pulse, speed: 0.12 + Math.random() * 0.12, offset: Math.random() }
    })

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

    // --- Pointer interaction: drag to rotate (with momentum) ---
    const BASE_TILT_X = world.rotation.x
    let autoRot = 0
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
    let raf = 0
    const loop = () => {
      const dt = clock.getDelta()
      if (animate && !dragging) autoRot += dt * 0.05
      if (!dragging) {
        userYaw += velYaw
        velYaw *= 0.94
        if (Math.abs(velYaw) < 1e-4) velYaw = 0
      }
      globeSpin.rotation.y = autoRot + userYaw
      world.rotation.x = BASE_TILT_X + userPitch
      if (animate) {
        arcs.forEach((arc) => {
          arc.offset = (arc.offset + dt * arc.speed) % 1
          arc.curve.getPointAt(arc.offset, arc.pulse.position)
        })
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    arcs.forEach((arc) => arc.curve.getPointAt(0.5, arc.pulse.position))
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
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
