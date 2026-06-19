import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Three.js trade globe — ported from the eduadvise.in destinations globe.
 * NASA night-lights earth (glowing cities), terrain relief, drifting clouds,
 * a golden atmosphere halo + limb, route arcs and little planes flying from the
 * Dubai hub to NTA's trade markets. Drag to spin; reduced-motion aware.
 */

const HUB: [number, number] = [25.2, 55.27] // Dubai
const DESTS: [number, number][] = [
  [51.95, 4.5], // Rotterdam
  [1.3, 103.8], // Singapore
  [29.76, -95.36], // Houston
  [31.23, 121.47], // Shanghai
  [19.07, 72.87], // Mumbai
  [6.5, 3.37], // Lagos
  [51.51, -0.13], // London
  [40.71, -74.0], // New York
]
const PLANETS = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/'
const ORANGE = 0xf76a0c
const GOLD = 0xc99b3f

export default function TradeGlobe({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const box = ref.current
    if (!box) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    box.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 3.4)

    scene.add(new THREE.AmbientLight(0x8888aa, 0.55))
    const sun = new THREE.DirectionalLight(0xffdfb8, 3.0)
    sun.position.set(-5, 1.5, 3.5)
    scene.add(sun)

    const globe = new THREE.Group()
    scene.add(globe)

    const mat = new THREE.MeshStandardMaterial({ color: 0x140b1a, roughness: 0.8, metalness: 0.08 })
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    // NASA night-lights earth + relief + clouds
    loader.load(`${PLANETS}earth_night_4096.jpg`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      mat.map = t
      mat.color.set(0xffffff)
      mat.emissiveMap = t
      mat.emissive.set(0xffc97a)
      mat.emissiveIntensity = 1.05
      mat.roughness = 0.55
      mat.needsUpdate = true
    })
    loader.load(`${PLANETS}earth_normal_2048.jpg`, (n) => {
      mat.normalMap = n
      mat.normalScale = new THREE.Vector2(0.65, 0.65)
      mat.needsUpdate = true
    })

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), mat)
    sphere.geometry.setAttribute('uv2', sphere.geometry.attributes.uv)
    globe.add(sphere)

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 64, 64),
      new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.28, depthWrite: false }),
    )
    clouds.visible = false
    scene.add(clouds)
    loader.load(`${PLANETS}earth_clouds_1024.png`, (c) => {
      clouds.material.map = c
      clouds.material.needsUpdate = true
      clouds.visible = true
    })

    const glowVert = `varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(0xff9e3d) } },
        vertexShader: glowVert,
        fragmentShader: `varying vec3 vNormal; uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0);
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
          }`,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    halo.scale.setScalar(1.12)
    scene.add(halo)

    const limb = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(0xffc97a) } },
        vertexShader: glowVert,
        fragmentShader: `varying vec3 vNormal; uniform vec3 glowColor;
          void main() {
            float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.5) * 0.55;
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
          }`,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    scene.add(limb)

    const toVec = (lat: number, lon: number, r = 1) => {
      const phi = ((90 - lat) * Math.PI) / 180
      const theta = ((lon + 180) * Math.PI) / 180
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      )
    }

    const home = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 12, 12),
      new THREE.MeshBasicMaterial({ color: ORANGE }),
    )
    home.position.copy(toVec(HUB[0], HUB[1], 1.005))
    globe.add(home)

    const routes: THREE.QuadraticBezierCurve3[] = []
    DESTS.forEach(([lat, lon]) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 10, 10),
        new THREE.MeshBasicMaterial({ color: GOLD }),
      )
      dot.position.copy(toVec(lat, lon, 1.005))
      globe.add(dot)

      const a = toVec(HUB[0], HUB[1], 1.005)
      const b = toVec(lat, lon, 1.005)
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1 + a.distanceTo(b) * 0.32)
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
        new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }),
      )
      globe.add(line)
      routes.push(curve)
    })

    const planeMat = new THREE.MeshBasicMaterial({ color: 0xffd489 })
    const miniPlane = () => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.04, 8), planeMat)
      body.rotation.z = -Math.PI / 2
      g.add(body)
      const wings = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.0025, 0.042), planeMat)
      wings.position.x = -0.003
      g.add(wings)
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.01, 0.003), planeMat)
      tail.position.set(-0.017, 0.005, 0)
      g.add(tail)
      globe.add(g)
      return g
    }
    const flights = routes.map((curve, i) => ({
      obj: miniPlane(),
      curve,
      t: (i * 0.37) % 1,
      speed: 0.055 + (i % 3) * 0.014,
    }))
    const _m = new THREE.Matrix4()
    const _fwd = new THREE.Vector3()
    const _up = new THREE.Vector3()
    const _side = new THREE.Vector3()
    const flyPlanes = (dt: number) => {
      flights.forEach((f) => {
        f.t = (f.t + dt * f.speed) % 1
        const pos = f.curve.getPointAt(f.t)
        _fwd.copy(f.curve.getTangentAt(f.t))
        _up.copy(pos).normalize()
        _side.crossVectors(_fwd, _up).normalize()
        _up.crossVectors(_side, _fwd)
        _m.makeBasis(_fwd, _up, _side)
        f.obj.position.copy(pos).addScaledVector(_up, 0.012)
        f.obj.quaternion.setFromRotationMatrix(_m)
      })
    }
    flyPlanes(0)

    globe.rotation.y = 2.86
    globe.rotation.x = 0.18

    // drag to spin
    let dragging = false
    let pxv = 0
    let pyv = 0
    const el = renderer.domElement
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y'
    const onDown = (e: PointerEvent) => {
      dragging = true
      pxv = e.clientX
      pyv = e.clientY
      el.style.cursor = 'grabbing'
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      globe.rotation.y += (e.clientX - pxv) * 0.005
      globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + (e.clientY - pyv) * 0.003))
      pxv = e.clientX
      pyv = e.clientY
    }
    const onUp = () => {
      dragging = false
      el.style.cursor = 'grab'
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const w = box.clientWidth
      const h = box.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    renderer.setAnimationLoop(() => {
      if (!dragging && !reduceMotion) globe.rotation.y += 0.0028
      if (!reduceMotion) {
        flyPlanes(1 / 60)
        clouds.rotation.y = globe.rotation.y * 1.12
        clouds.rotation.x = globe.rotation.x
      } else {
        clouds.rotation.copy(globe.rotation)
      }
      renderer.render(scene, camera)
    })

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', resize)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      renderer.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mm = m.material
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose())
        else if (mm) (mm as THREE.Material).dispose()
      })
      if (el.parentNode) el.parentNode.removeChild(el)
    }
  }, [])

  return <div ref={ref} className={className} />
}
