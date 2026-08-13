import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnnotationHotspot, Category, DimensionConfig, MaterialOption, PartConfig, PerformanceStats, ShaderUniforms, StudioEnvironment } from '../types';
import { MATERIAL_LIBRARY } from '../data/products';
import { getProceduralTexture } from '../utils/proceduralTextures';

interface ThreeCanvasProps {
  category: Category;
  parts: PartConfig[];
  dimensions: DimensionConfig[];
  annotations: AnnotationHotspot[];
  environment: StudioEnvironment;
  explosionRatio: number; // 0.0 to 1.0
  autoRotate: boolean;
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
  onUpdateStats: (stats: PerformanceStats) => void;
  shaderUniforms: ShaderUniforms;
  activeCameraPreset: 'perspective' | 'front' | 'top' | 'side' | 'detail' | null;
  canvasRefOut?: React.MutableRefObject<HTMLCanvasElement | null>;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  category,
  parts,
  dimensions,
  annotations,
  environment,
  explosionRatio,
  autoRotate,
  selectedHotspotId,
  onSelectHotspot,
  onUpdateStats,
  shaderUniforms,
  activeCameraPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Group holds all interactive mesh parts
  const productGroupRef = useRef<THREE.Group | null>(null);
  const partMeshMapRef = useRef<Map<string, THREE.Group>>(new Map());

  // Lights
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Hotspot Screen Positions
  const [screenHotspots, setScreenHotspots] = useState<{ id: string; x: number; y: number; title: string }[]>([]);

  // Performance tracking
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // 1. Initialize Three.js Scene, Renderer, Camera, Controls
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(environment.bgColor);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 2.5, 4.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // Needed for screenshot exports!
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = environment.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Allow view down to ground
    controls.minDistance = 1.2;
    controls.maxDistance = 12;
    controlsRef.current = controls;

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, environment.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Key Light (Main Shadow Caster)
    const keyLight = new THREE.DirectionalLight(environment.keyLightColor, environment.keyLightIntensity);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Fill Light
    const fillLight = new THREE.DirectionalLight(environment.fillLightColor, environment.fillLightIntensity);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Floor Shadow Disc
    const floorGeo = new THREE.PlaneGeometry(15, 15);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid Floor Helper (subtle studio backdrop)
    const gridHelper = new THREE.GridHelper(12, 24, 0x00d2ff, 0x223344);
    gridHelper.position.y = -1.601;
    scene.add(gridHelper);

    // Product Container Group
    const productGroup = new THREE.Group();
    scene.add(productGroup);
    productGroupRef.current = productGroup;

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 1.5;
        controlsRef.current.update();
      }

      // Update Hotspot Screen Positions
      if (cameraRef.current && productGroupRef.current && container) {
        const rect = container.getBoundingClientRect();
        const hotspots: { id: string; x: number; y: number; title: string }[] = [];

        annotations.forEach((anno) => {
          const partGroup = partMeshMapRef.current.get(anno.partId);
          if (!partGroup || !partGroup.visible) return;

          const worldPos = new THREE.Vector3(...anno.position);
          worldPos.applyMatrix4(partGroup.matrixWorld);

          const proj = worldPos.clone().project(cameraRef.current!);
          // Convert clip space (-1 to +1) to screen pixels
          const x = ((proj.x + 1) * rect.width) / 2;
          const y = ((-proj.y + 1) * rect.height) / 2;

          // Only show if in front of camera frustum
          if (proj.z < 1) {
            hotspots.push({ id: anno.id, x, y, title: anno.title });
          }
        });
        setScreenHotspots(hotspots);
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        // Stats calculation
        frameCountRef.current++;
        const now = performance.now();
        const delta = now - lastTimeRef.current;
        if (delta >= 1000) {
          const fps = Math.round((frameCountRef.current * 1000) / delta);
          const frameTimeMs = parseFloat((delta / frameCountRef.current).toFixed(2));
          const info = rendererRef.current.info;

          onUpdateStats({
            fps,
            frameTimeMs,
            drawCalls: info.render.calls,
            triangles: info.render.triangles,
            textures: info.memory.textures,
            geometries: info.memory.geometries,
            webglVersion: rendererRef.current.capabilities.isWebGL2 ? 'WebGL 2.0' : 'WebGL 1.0',
          });

          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 2. Update Studio Environment Lighting & Background
  useEffect(() => {
    if (!sceneRef.current || !ambientLightRef.current || !keyLightRef.current || !fillLightRef.current) return;

    sceneRef.current.background = new THREE.Color(environment.bgColor);
    ambientLightRef.current.intensity = environment.ambientIntensity;

    keyLightRef.current.color.set(environment.keyLightColor);
    keyLightRef.current.intensity = environment.keyLightIntensity;

    fillLightRef.current.color.set(environment.fillLightColor);
    fillLightRef.current.intensity = environment.fillLightIntensity;
  }, [environment]);

  // 3. Rebuild 3D Product Meshes when Category or Parts change
  useEffect(() => {
    if (!productGroupRef.current) return;

    const group = productGroupRef.current;
    // Clear old meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }
    partMeshMapRef.current.clear();

    // Build procedural 3D model according to category
    parts.forEach((part) => {
      const partGroup = buildPartMeshGroup(category, part, dimensions, shaderUniforms);
      partGroup.name = part.id;
      partGroup.visible = part.enabled;

      group.add(partGroup);
      partMeshMapRef.current.set(part.id, partGroup);
    });
  }, [category, parts.map((p) => p.selectedMaterialId + p.enabled).join('|'), shaderUniforms.wireframe, shaderUniforms.roughnessShift, shaderUniforms.metallicFactor]);

  // 4. Handle Exploded View offsets & Dimensions scaling in real-time
  useEffect(() => {
    partMeshMapRef.current.forEach((partGroup, partId) => {
      const partConfig = parts.find((p) => p.id === partId);
      if (!partConfig) return;

      // Animate position offset along local explosion vector
      const [ox, oy, oz] = partConfig.explosionOffset;
      partGroup.position.set(ox * explosionRatio, oy * explosionRatio, oz * explosionRatio);

      // Apply dimensions morphing scale / rotation
      dimensions.forEach((dim) => {
        if (dim.affectedMeshPart === partId) {
          if (dim.unit === 'deg') {
            const rad = THREE.MathUtils.degToRad(dim.value);
            partGroup.rotation.x = rad - Math.PI / 2; // base offset
          } else {
            // cm / mm scale morph
            const scaleFactor = dim.value / ((dim.min + dim.max) / 2);
            if (partId.includes('height') || partId.includes('lift') || partId.includes('thickness')) {
              partGroup.scale.setY(scaleFactor);
            } else {
              partGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
          }
        }
      });
    });
  }, [explosionRatio, dimensions]);

  // 5. Handle Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current || !activeCameraPreset) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    let targetPos = new THREE.Vector3(3.5, 2.5, 4.5);
    let lookTarget = new THREE.Vector3(0, 0, 0);

    switch (activeCameraPreset) {
      case 'front':
        targetPos.set(0, 0.5, 5.0);
        break;
      case 'top':
        targetPos.set(0, 5.5, 0.1);
        break;
      case 'side':
        targetPos.set(5.0, 0.5, 0);
        break;
      case 'detail':
        targetPos.set(1.5, 0.8, 1.8);
        lookTarget.set(0, 0.2, 0);
        break;
      case 'perspective':
      default:
        targetPos.set(3.5, 2.5, 4.5);
        break;
    }

    // Smoothly animate camera position
    const startPos = camera.position.clone();
    const duration = 600;
    const startTime = performance.now();

    const animCam = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.set(lookTarget.x * ease, lookTarget.y * ease, lookTarget.z * ease);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animCam);
      }
    };
    animCam();
  }, [activeCameraPreset]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hotspot Buttons projected to 2D UI */}
      {screenHotspots.map((hs) => {
        const isSelected = hs.id === selectedHotspotId;
        return (
          <div
            key={hs.id}
            style={{ left: `${hs.x}px`, top: `${hs.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 group"
          >
            <button
              onClick={() => onSelectHotspot(isSelected ? null : hs.id)}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                isSelected
                  ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-125 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 hover:scale-110 shadow-md backdrop-blur-md'
              }`}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-30"></span>
              <span className="font-mono text-xs font-bold">+</span>
            </button>

            {/* Hover Tooltip Label */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900/95 text-slate-100 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md">
              {hs.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// PROCEDURAL MESH BUILDER FOR PRODUCT CATEGORIES
// ============================================================================

function createPBRMaterial(materialId: string, shaderUniforms: ShaderUniforms): THREE.Material {
  const matConfig = MATERIAL_LIBRARY.find((m) => m.id === materialId) || MATERIAL_LIBRARY[0];

  const roughness = Math.min(1.0, Math.max(0.0, matConfig.roughness + shaderUniforms.roughnessShift));
  const metalness = Math.min(1.0, Math.max(0.0, matConfig.metalness + shaderUniforms.metallicFactor));

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(matConfig.color),
    roughness,
    metalness,
    clearcoat: matConfig.clearcoat || 0,
    clearcoatRoughness: matConfig.clearcoatRoughness || 0.1,
    transmission: matConfig.transmission || 0,
    ior: matConfig.ior || 1.5,
    wireframe: shaderUniforms.wireframe,
  });

  if (matConfig.textureType && matConfig.textureType !== 'smooth') {
    const bumpMap = getProceduralTexture(matConfig.textureType);
    if (bumpMap) {
      mat.bumpMap = bumpMap;
      mat.bumpScale = matConfig.textureType === 'carbon' ? 0.05 : 0.03;
    }
  }

  return mat;
}

function buildPartMeshGroup(
  category: Category,
  part: PartConfig,
  dimensions: DimensionConfig[],
  shaderUniforms: ShaderUniforms
): THREE.Group {
  const group = new THREE.Group();
  const material = createPBRMaterial(part.selectedMaterialId, shaderUniforms);

  switch (category) {
    case 'chair':
      buildChairPart(part.id, group, material);
      break;
    case 'headphones':
      buildHeadphonesPart(part.id, group, material);
      break;
    case 'watch':
      buildWatchPart(part.id, group, material);
      break;
    case 'keyboard':
      buildKeyboardPart(part.id, group, material);
      break;
  }

  // Set shadow properties on all child meshes
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return group;
}

// 1. CHAIR PROCEDURAL MESHES
function buildChairPart(partId: string, group: THREE.Group, mat: THREE.Material) {
  if (partId === 'backrest') {
    // Outer aluminum arch frame
    const frameGeo = new THREE.TorusGeometry(0.8, 0.06, 16, 32, Math.PI * 1.1);
    const frameMesh = new THREE.Mesh(frameGeo, mat);
    frameMesh.position.set(0, 0.6, -0.3);
    frameMesh.rotation.x = 0.2;
    group.add(frameMesh);

    // Inner mesh lumbar panel
    const panelGeo = new THREE.PlaneGeometry(1.2, 1.4);
    const panelMesh = new THREE.Mesh(panelGeo, mat);
    panelMesh.position.set(0, 0.6, -0.28);
    panelMesh.rotation.x = 0.2;
    group.add(panelMesh);
  } else if (partId === 'seat_cushion') {
    // Ergonomic seat cushion slab
    const seatGeo = new THREE.BoxGeometry(1.5, 0.18, 1.4, 8, 4, 8);
    const seatMesh = new THREE.Mesh(seatGeo, mat);
    seatMesh.position.set(0, -0.1, 0);
    group.add(seatMesh);
  } else if (partId === 'armrests') {
    // Left & Right Armrests
    [-0.9, 0.9].forEach((x) => {
      // Armpost pillar
      const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.6, 16);
      const postMesh = new THREE.Mesh(postGeo, mat);
      postMesh.position.set(x, 0.2, 0);

      // Arm pad top
      const padGeo = new THREE.BoxGeometry(0.22, 0.06, 0.7);
      const padMesh = new THREE.Mesh(padGeo, mat);
      padMesh.position.set(x, 0.5, 0);

      group.add(postMesh, padMesh);
    });
  } else if (partId === 'headrest') {
    // Curved Neck Cushion
    const cushionGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 16);
    const cushionMesh = new THREE.Mesh(cushionGeo, mat);
    cushionMesh.rotation.z = Math.PI / 2;
    cushionMesh.position.set(0, 1.5, -0.45);

    // Connecting stem
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 12);
    const stemMesh = new THREE.Mesh(stemGeo, mat);
    stemMesh.position.set(0, 1.35, -0.45);

    group.add(cushionMesh, stemMesh);
  } else if (partId === 'gas_lift') {
    // Hydraulic cylinder
    const pistonGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 24);
    const pistonMesh = new THREE.Mesh(pistonGeo, mat);
    pistonMesh.position.set(0, -0.6, 0);
    group.add(pistonMesh);
  } else if (partId === 'base_wheels') {
    // 5-Star star base
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legGeo = new THREE.BoxGeometry(0.1, 0.08, 1.1);
      const legMesh = new THREE.Mesh(legGeo, mat);
      legMesh.position.set(Math.sin(angle) * 0.55, -0.98, Math.cos(angle) * 0.55);
      legMesh.rotation.y = angle;
      group.add(legMesh);

      // Wheel casters
      const wheelGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const wheelMesh = new THREE.Mesh(wheelGeo, mat);
      wheelMesh.position.set(Math.sin(angle) * 1.1, -1.05, Math.cos(angle) * 1.1);
      group.add(wheelMesh);
    }
  }
}

// 2. HEADPHONES PROCEDURAL MESHES
function buildHeadphonesPart(partId: string, group: THREE.Group, mat: THREE.Material) {
  if (partId === 'earcups') {
    [-1.0, 1.0].forEach((x) => {
      // Earcup main acoustic chamber cylinder
      const cupGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.35, 32);
      const cupMesh = new THREE.Mesh(cupGeo, mat);
      cupMesh.rotation.z = Math.PI / 2;
      cupMesh.position.set(x, 0, 0);

      // Metal outer accent ring
      const ringGeo = new THREE.TorusGeometry(0.66, 0.04, 16, 32);
      const ringMesh = new THREE.Mesh(ringGeo, mat);
      ringMesh.rotation.y = Math.PI / 2;
      ringMesh.position.set(x + (x > 0 ? 0.15 : -0.15), 0, 0);

      group.add(cupMesh, ringMesh);
    });
  } else if (partId === 'earpads') {
    [-1.0, 1.0].forEach((x) => {
      // Plush memory cushions facing inside
      const padGeo = new THREE.TorusGeometry(0.55, 0.16, 16, 32);
      const padMesh = new THREE.Mesh(padGeo, mat);
      padMesh.rotation.y = Math.PI / 2;
      padMesh.position.set(x + (x > 0 ? -0.12 : 0.12), 0, 0);
      group.add(padMesh);
    });
  } else if (partId === 'headband_frame') {
    // Arching spring steel band
    const archGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 32, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, mat);
    archMesh.position.set(0, 0.2, 0);
    group.add(archMesh);
  } else if (partId === 'headband_strap') {
    // Inner comfort leather strap
    const strapGeo = new THREE.TorusGeometry(0.98, 0.04, 16, 32, Math.PI * 0.85);
    const strapMesh = new THREE.Mesh(strapGeo, mat);
    strapMesh.position.set(0, 0.15, 0);
    group.add(strapMesh);
  } else if (partId === 'boom_mic') {
    // Mic boom arm
    const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16);
    const armMesh = new THREE.Mesh(armGeo, mat);
    armMesh.rotation.z = Math.PI / 3;
    armMesh.position.set(-1.0, -0.4, 0.4);

    // Mic capsule tip
    const tipGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, mat);
    tipMesh.position.set(-1.35, -0.7, 0.6);

    group.add(armMesh, tipMesh);
  }
}

// 3. WATCH PROCEDURAL MESHES
function buildWatchPart(partId: string, group: THREE.Group, mat: THREE.Material) {
  if (partId === 'watch_case') {
    // Main watch chassis cylinder
    const caseGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.4, 48);
    const caseMesh = new THREE.Mesh(caseGeo, mat);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    // Strap Lugs top and bottom
    [-1.2, 1.2].forEach((y) => {
      const lugGeo = new THREE.BoxGeometry(1.2, 0.4, 0.35);
      const lugMesh = new THREE.Mesh(lugGeo, mat);
      lugMesh.position.set(0, y, 0);
      group.add(lugMesh);
    });
  } else if (partId === 'bezel_ring') {
    // Bezel ring with notches
    const bezelGeo = new THREE.TorusGeometry(1.12, 0.08, 16, 48);
    const bezelMesh = new THREE.Mesh(bezelGeo, mat);
    bezelMesh.position.set(0, 0, 0.22);
    group.add(bezelMesh);
  } else if (partId === 'glass_lens') {
    // Domed Sapphire Glass
    const glassGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.08, 48);
    const glassMesh = new THREE.Mesh(glassGeo, mat);
    glassMesh.rotation.x = Math.PI / 2;
    glassMesh.position.set(0, 0, 0.24);
    group.add(glassMesh);
  } else if (partId === 'wrist_band') {
    // Strap segments top & bottom
    [-1.0, 1.0].forEach((dir) => {
      for (let i = 0; i < 5; i++) {
        const linkGeo = new THREE.BoxGeometry(0.9, 0.3, 0.12);
        const linkMesh = new THREE.Mesh(linkGeo, mat);
        linkMesh.position.set(0, dir * (1.5 + i * 0.32), -0.05 * i);
        group.add(linkMesh);
      }
    });
  } else if (partId === 'crown_dial') {
    // Rotary crown button on right side
    const crownGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 24);
    const crownMesh = new THREE.Mesh(crownGeo, mat);
    crownMesh.rotation.z = Math.PI / 2;
    crownMesh.position.set(1.22, 0, 0);
    group.add(crownMesh);
  }
}

// 4. KEYBOARD PROCEDURAL MESHES
function buildKeyboardPart(partId: string, group: THREE.Group, mat: THREE.Material) {
  if (partId === 'kb_case') {
    // Heavy aluminum base chassis
    const caseGeo = new THREE.BoxGeometry(3.2, 0.35, 1.8);
    const caseMesh = new THREE.Mesh(caseGeo, mat);
    caseMesh.position.set(0, 0, 0);
    group.add(caseMesh);
  } else if (partId === 'keycaps') {
    // Grid of sculpted keycaps
    const rows = 5;
    const cols = 12;
    const keyWidth = 0.22;
    const keyHeight = 0.18;
    const gap = 0.04;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const keyGeo = new THREE.BoxGeometry(keyWidth, keyHeight, keyWidth);
        const keyMesh = new THREE.Mesh(keyGeo, mat);

        const x = (c - cols / 2 + 0.5) * (keyWidth + gap);
        const z = (r - rows / 2 + 0.5) * (keyWidth + gap);
        keyMesh.position.set(x, 0.25, z);

        group.add(keyMesh);
      }
    }
  } else if (partId === 'accent_plate') {
    // Top accent brass bar
    const barGeo = new THREE.BoxGeometry(3.1, 0.06, 0.2);
    const barMesh = new THREE.Mesh(barGeo, mat);
    barMesh.position.set(0, 0.2, -0.75);
    group.add(barMesh);
  } else if (partId === 'volume_knob') {
    // Rotary audio dial in top right
    const knobGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 24);
    const knobMesh = new THREE.Mesh(knobGeo, mat);
    knobMesh.position.set(1.3, 0.3, -0.72);
    group.add(knobMesh);
  }
}
