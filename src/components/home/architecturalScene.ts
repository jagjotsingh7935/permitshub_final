import * as THREE from 'three'

export type ArchitecturalController = { setProgress: (value: number) => void; dispose: () => void }

// This is an original conceptual pavilion, not a model of a client project.
export function createArchitecturalScene(canvas: HTMLCanvasElement, onUnavailable: () => void): ArchitecturalController {
  const compact = window.matchMedia('(max-width: 850px), (pointer: coarse)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.7))
  renderer.shadowMap.enabled = !compact
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.4
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120)
  const model = new THREE.Group()
  scene.add(model)
  const materials: THREE.Material[] = []
  function material(color: string, roughness = 0.7, metalness = 0) {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    materials.push(value)
    return value
  }
  const stone = material('#e8e4d9')
  const white = material('#faf7f0')
  const bronze = material('#9a7450', 0.5, 0.18)
  const timber = material('#b58d60')
  const dark = material('#263e43', 0.4, 0.25)
  const glass = material('#728f91', 0.18, 0.6)
  const grass = material('#95a38a')
  const leaf = material('#6a7a63')
  const lightLeaf = material('#8b9979')
  const trunk = material('#6f6453')
  const pool = material('#7da5a7', 0.17, 0.38)
  const foundation = material('#c0b7a5')
  const geometries: THREE.BufferGeometry[] = []
  const cube = new THREE.BoxGeometry(1, 1, 1)
  const sphere = new THREE.IcosahedronGeometry(1, 1)
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 10)
  geometries.push(cube, sphere, cylinder)
  function box(parent: THREE.Object3D, size: number[], at: number[], mat: THREE.Material) {
    const mesh = new THREE.Mesh(cube, mat)
    mesh.scale.set(size[0], size[1], size[2])
    mesh.position.set(at[0], at[1], at[2])
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  scene.add(new THREE.HemisphereLight('#fff9eb', '#9da7ac', 2.9))
  const sun = new THREE.DirectionalLight('#fff0d5', 3.5)
  sun.position.set(-8, 16, 9)
  sun.castShadow = !compact
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -12
  sun.shadow.camera.right = 12
  sun.shadow.camera.top = 12
  sun.shadow.camera.bottom = -12
  sun.shadow.normalBias = 0.04
  scene.add(sun)
  const fill = new THREE.DirectionalLight('#c9e1f3', 1.5)
  fill.position.set(6, 7, -9)
  scene.add(fill)

  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.11 })
  materials.push(shadowMaterial)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), shadowMaterial)
  geometries.push(ground.geometry)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.38
  ground.receiveShadow = true
  scene.add(ground)

  box(model, [13.6, 0.35, 10], [0, -0.15, 0], foundation)
  box(model, [13.6, 0.12, 10], [0, 0.085, 0], stone)
  box(model, [11.6, 0.06, 7.3], [0.1, 0.18, -0.4], grass)
  box(model, [9.4, 0.1, 6.6], [0.4, 0.26, -0.3], white)
  box(model, [13.2, 0.03, 1.1], [0, 0.17, 4.25], stone)
  for (let i = 0; i < 7; i++) box(model, [0.045, 0.035, 1.1], [-5.8 + i * 1.8, 0.2, 4.25], foundation)
  // Entrance stairs, reflecting water and terraced landscape.
  for (let i = 0; i < 3; i++) box(model, [2.7, 0.08, 0.48], [0.5, 0.2 + i * 0.08, 3.5 - i * 0.43], white)
  box(model, [2.25, 0.09, 3.35], [-4.65, 0.26, 0.8], white)
  box(model, [1.94, 0.035, 3.05], [-4.65, 0.32, 0.8], pool)
  for (let i = 0; i < 3; i++) box(model, [0.03, 0.006, 2.8], [-5.25 + i * 0.45, 0.34, 0.8], white)

  const lower = new THREE.Group()
  const upper = new THREE.Group()
  const roof = new THREE.Group()
  model.add(lower, upper, roof)
  box(lower, [8.4, 0.22, 5.15], [0.5, 0.48, -0.3], white)
  box(lower, [3, 2.15, 4.6], [2.8, 1.66, -0.35], stone)
  box(lower, [5, 2.05, 0.08], [-1.2, 1.64, 1.86], glass)
  box(lower, [0.08, 2.05, 4.38], [-3.63, 1.64, -0.35], glass)
  box(lower, [5, 2.05, 0.08], [-1.2, 1.64, -2.54], glass)
  for (let x = -3.6; x <= 1.25; x += 0.79) {
    box(lower, [0.055, 2.15, 0.12], [x, 1.65, 1.94], dark)
    box(lower, [0.055, 2.15, 0.12], [x, 1.65, -2.58], dark)
  }
  for (let z = -2.5; z <= 1.9; z += 0.73) box(lower, [0.1, 2.15, 0.05], [-3.7, 1.65, z], dark)
  box(lower, [5, 0.065, 0.1], [-1.2, 1.86, 1.95], dark)
  for (let x = 1.38; x < 4.15; x += 0.19) box(lower, [0.07, 2.12, 0.14], [x, 1.68, 2], timber)
  for (const x of [-3.5, 0.5, 4.6]) box(lower, [0.11, 2.22, 0.11], [x, 1.69, 2.56], bronze)
  box(lower, [9.45, 0.22, 6.2], [0.35, 2.89, -0.1], white)
  box(lower, [9.3, 0.055, 0.055], [0.35, 2.83, 3.01], bronze)

  box(upper, [5.8, 0.15, 3.9], [0.05, 3.04, -0.82], stone)
  box(upper, [2.15, 1.8, 3.3], [1.7, 4, -0.93], stone)
  box(upper, [3.5, 1.75, 0.08], [-1.15, 4, 0.71], glass)
  box(upper, [0.08, 1.75, 3.28], [-2.91, 4, -0.93], glass)
  box(upper, [5.75, 1.75, 0.08], [-0.02, 4, -2.61], glass)
  for (let x = -2.85; x < 0.66; x += 0.64) box(upper, [0.055, 1.85, 0.12], [x, 4, 0.78], bronze)
  for (let z = -2.5; z < 0.8; z += 0.64) box(upper, [0.1, 1.85, 0.055], [-2.96, 4, z], bronze)
  for (let x = 0.8; x < 2.8; x += 0.19) box(upper, [0.055, 1.8, 0.14], [x, 4, 0.82], timber)
  // Terrace rail, planter boxes and a slatted pergola.
  box(upper, [8.8, 0.65, 0.045], [0.35, 3.34, 2.86], glass)
  box(upper, [8.8, 0.055, 0.055], [0.35, 3.69, 2.86], bronze)
  for (const x of [-3.9, -1.7, 0.5, 2.7, 4.7]) box(upper, [0.045, 0.7, 0.045], [x, 3.34, 2.86], bronze)
  for (let x = -2.6; x < 1.1; x += 1.25) {
    box(upper, [0.9, 0.35, 0.45], [x, 3.21, 2.42], stone)
    box(upper, [0.83, 0.24, 0.36], [x, 3.47, 2.42], leaf)
  }
  for (const z of [-2.45, 2.5]) for (const x of [3.1, 4.5]) box(upper, [0.07, 1.82, 0.07], [x, 3.98, z], bronze)
  for (let z = -2.65; z < 2.8; z += 0.28) box(roof, [2, 0.08, 0.085], [3.8, 4.91, z], timber)
  box(roof, [6.4, 0.2, 4.4], [-0.1, 4.98, -0.87], white)
  box(roof, [5.9, 0.045, 3.9], [-0.1, 5.105, -0.87], stone)
  box(roof, [6.4, 0.045, 0.035], [-0.1, 4.94, 1.34], bronze)
  // Restrained rooftop panels.
  for (let i = 0; i < 4; i++) {
    const panel = box(roof, [0.86, 0.055, 1.1], [-1.5 + i * 0.98, 5.2, -1.4], dark)
    panel.rotation.x = -0.1
  }

  function tree(x: number, z: number, scale: number) {
    const treeGroup = new THREE.Group()
    treeGroup.position.set(x, 0.2, z)
    treeGroup.scale.setScalar(scale)
    const stem = new THREE.Mesh(cylinder, trunk)
    stem.scale.set(0.075, 1.5, 0.075)
    stem.position.y = 0.75
    stem.castShadow = true
    treeGroup.add(stem)
    const canopy = new THREE.Mesh(sphere, leaf)
    canopy.scale.set(0.7, 0.95, 0.68)
    canopy.position.y = 1.95
    canopy.castShadow = true
    treeGroup.add(canopy)
    const second = new THREE.Mesh(sphere, lightLeaf)
    second.scale.set(0.5, 0.68, 0.48)
    second.position.set(0.24, 2.3, 0.13)
    second.castShadow = true
    treeGroup.add(second)
    model.add(treeGroup)
  }
  tree(-5.65, -3.35, 1.2)
  tree(5.5, -3.6, 1.4)
  tree(5.65, 2.1, 1)
  tree(-5.6, 3.45, 0.88)
  tree(2.8, -3.85, 0.7)
  for (const x of [-5.5, 5.65]) for (let z = -1.8; z < 1.5; z += 0.65) {
    const bush = new THREE.Mesh(sphere, lightLeaf)
    bush.scale.set(0.28, 0.3, 0.3)
    bush.position.set(x, 0.45, z)
    model.add(bush)
  }

  // Thin guide lines reveal the design study when the building separates.
  const guideMaterial = new THREE.LineBasicMaterial({ color: '#658597', transparent: true, opacity: 0 })
  materials.push(guideMaterial)
  const guidePoints: THREE.Vector3[] = []
  for (const x of [-3.8, 3]) for (const z of [-2.8, 1.5]) guidePoints.push(new THREE.Vector3(x, 0.3, z), new THREE.Vector3(x, 8.3, z))
  const guideGeometry = new THREE.BufferGeometry().setFromPoints(guidePoints)
  geometries.push(guideGeometry)
  model.add(new THREE.LineSegments(guideGeometry, guideMaterial))

  let targetProgress = 0
  let currentProgress = 0
  let pointerX = 0
  let currentPointerX = 0
  let pointerY = 0
  let currentPointerY = 0
  let frame = 0
  let inView = true
  let disposed = false
  let contextLost = false
  let previousTime = 0
  const lookAt = new THREE.Vector3(0, 1.8, 0)
  function render(time: number) {
    frame = 0
    if (disposed || contextLost || !inView || document.hidden) return
    const delta = Math.min((time - previousTime) / 1000 || 0.016, 0.06)
    previousTime = time
    const ease = 1 - Math.exp(-6 * delta)
    currentProgress += (targetProgress - currentProgress) * ease
    currentPointerX += (pointerX - currentPointerX) * ease
    currentPointerY += (pointerY - currentPointerY) * ease
    const separation = Math.pow(Math.sin(currentProgress * Math.PI), 4)
    upper.position.y = separation * 1.4
    roof.position.y = separation * 3.2
    guideMaterial.opacity = separation * 0.24
    const angle = 0.76 - currentProgress * 0.63 + currentPointerX * 0.035
    const aspect = camera.aspect
    const distance = aspect < 1.5 ? 30 : 26
    camera.position.set(Math.sin(angle) * distance, 11.5 + currentProgress * 6 + currentPointerY * 0.4, Math.cos(angle) * distance)
    lookAt.y = 1.7 + separation * 0.8
    camera.lookAt(lookAt)
    renderer.render(scene, camera)
    if (Math.abs(targetProgress - currentProgress) + Math.abs(pointerX - currentPointerX) + Math.abs(pointerY - currentPointerY) > 0.0002) invalidate()
  }
  function invalidate() {
    if (!frame && !disposed && !contextLost && inView && !document.hidden) frame = requestAnimationFrame(render)
  }
  function resize() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    invalidate()
  }
  function move(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    const bounds = canvas.getBoundingClientRect()
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5
    invalidate()
  }
  function leave() { pointerX = 0; pointerY = 0; invalidate() }
  function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else invalidate() }
  function lost(event: Event) { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; onUnavailable() }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (inView) invalidate()
    else { cancelAnimationFrame(frame); frame = 0 }
  })
  intersection.observe(canvas)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerleave', leave)
  canvas.addEventListener('webglcontextlost', lost)
  document.addEventListener('visibilitychange', visibility)
  resize()
  return {
    setProgress(value) { targetProgress = value; invalidate() },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('webglcontextlost', lost)
      document.removeEventListener('visibilitychange', visibility)
      geometries.forEach(item => item.dispose())
      materials.forEach(item => item.dispose())
      sun.shadow.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
