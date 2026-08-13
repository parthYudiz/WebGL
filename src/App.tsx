import React, { useState } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';
import { Category, DimensionConfig, PartConfig, PerformanceStats, ShaderUniforms, StudioEnvironment } from './types';
import { MATERIAL_LIBRARY, PRODUCTS, STUDIO_PRESETS } from './data/products';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { ConfiguratorSidebar } from './components/ConfiguratorSidebar';
import { UnityInspectorPanel } from './components/UnityInspectorPanel';
import { StatsOverlay } from './components/StatsOverlay';
import { HotspotTooltip } from './components/HotspotTooltip';
import { SummaryModal } from './components/SummaryModal';
import { ARModal } from './components/ARModal';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('chair');
  const currentProduct = PRODUCTS.find((p) => p.id === activeCategory) || PRODUCTS[0];

  // Configurable states per product
  const [partsMap, setPartsMap] = useState<Record<Category, PartConfig[]>>({
    chair: PRODUCTS[0].parts,
    headphones: PRODUCTS[1].parts,
    watch: PRODUCTS[2].parts,
    keyboard: PRODUCTS[3].parts,
  });

  const [dimensionsMap, setDimensionsMap] = useState<Record<Category, DimensionConfig[]>>({
    chair: PRODUCTS[0].dimensions,
    headphones: PRODUCTS[1].dimensions,
    watch: PRODUCTS[2].dimensions,
    keyboard: PRODUCTS[3].dimensions,
  });

  // Current product parts & dimensions
  const parts = partsMap[activeCategory];
  const dimensions = dimensionsMap[activeCategory];

  // Studio environment
  const [currentStudio, setCurrentStudio] = useState<StudioEnvironment>(STUDIO_PRESETS[0]);

  // Viewport states
  const [explosionRatio, setExplosionRatio] = useState<number>(0.0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'perspective' | 'front' | 'top' | 'side' | 'detail' | null>('perspective');

  // Shader & Developer inspector states
  const [shaderUniforms, setShaderUniforms] = useState<ShaderUniforms>({
    roughnessShift: 0,
    metallicFactor: 0,
    fresnelBias: 0.1,
    rimColor: '#00d2ff',
    emissiveSpeed: 1.0,
    wireframe: false,
  });

  // UI Panels toggles
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isAROpen, setIsAROpen] = useState<boolean>(false);

  // Performance stats
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    frameTimeMs: 16.6,
    drawCalls: 12,
    triangles: 14500,
    textures: 4,
    geometries: 8,
    webglVersion: 'WebGL 2.0',
  });

  // Total price calculation
  const calculatedTotalPrice = React.useMemo(() => {
    const base = currentProduct.basePrice;
    const partsAddon = parts
      .filter((p) => p.enabled)
      .reduce((sum, p) => {
        const mat = MATERIAL_LIBRARY.find((m) => m.id === p.selectedMaterialId);
        const matMultiplier = mat ? mat.priceMultiplier : 1.0;
        return sum + p.price * matMultiplier;
      }, 0);
    return Math.round(base + partsAddon);
  }, [currentProduct, parts]);

  // Handler functions
  const handleSelectCategory = (cat: Category) => {
    setActiveCategory(cat);
    setSelectedHotspotId(null);
    setExplosionRatio(0.0);
  };

  const handleUpdatePartMaterial = (partId: string, materialId: string) => {
    setPartsMap((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((p) => (p.id === partId ? { ...p, selectedMaterialId: materialId } : p)),
    }));
  };

  const handleTogglePart = (partId: string) => {
    setPartsMap((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((p) => (p.id === partId ? { ...p, enabled: !p.enabled } : p)),
    }));
  };

  const handleUpdateDimension = (dimId: string, value: number) => {
    setDimensionsMap((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((d) => (d.id === dimId ? { ...d, value } : d)),
    }));
  };

  const handleUpdateStudioProperty = (key: keyof StudioEnvironment, val: any) => {
    setCurrentStudio((prev) => ({ ...prev, [key]: val }));
  };

  const handleUpdateShaderUniforms = (key: keyof ShaderUniforms, val: any) => {
    setShaderUniforms((prev) => ({ ...prev, [key]: val }));
  };

  // High-Res Snapshot Capture
  const handleTakeSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${currentProduct.id}_3d_snapshot.png`;
    link.href = dataUrl;
    link.click();
  };

  // GLTF 3D Scene Export
  const handleExportGLTF = () => {
    const exporter = new GLTFExporter();
    const tempScene = new THREE.Scene();

    // Create simple export mesh
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.3, metalness: 0.8 })
    );
    tempScene.add(box);

    exporter.parse(
      tempScene,
      (gltf) => {
        const output = JSON.stringify(gltf, null, 2);
        const blob = new Blob([output], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${currentProduct.id}_custom_model.gltf`;
        link.click();
      },
      (error) => {
        console.error('Error exporting GLTF:', error);
      },
      { binary: false }
    );
  };

  const activeAnnotation = currentProduct.annotations.find((a) => a.id === selectedHotspotId);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 font-sans overflow-hidden antialiased select-none">
      {/* Top Header Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        explosionRatio={explosionRatio}
        onChangeExplosion={setExplosionRatio}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onCameraPreset={(preset) => setActiveCameraPreset(preset)}
        onTakeSnapshot={handleTakeSnapshot}
        onToggleARModal={() => setIsAROpen(true)}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        isInspectorOpen={isInspectorOpen}
        onOpenSummary={() => setIsSummaryOpen(true)}
        totalPrice={calculatedTotalPrice}
        stats={stats}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* Left Side Configurator Sidebar */}
        <ConfiguratorSidebar
          category={activeCategory}
          parts={parts}
          onUpdatePartMaterial={handleUpdatePartMaterial}
          onTogglePart={handleTogglePart}
          dimensions={dimensions}
          onUpdateDimension={handleUpdateDimension}
          currentStudio={currentStudio}
          onSelectStudio={setCurrentStudio}
          onUpdateStudioProperty={handleUpdateStudioProperty}
        />

        {/* Center 3D Viewport Canvas */}
        <div className="flex-1 relative h-full w-full">
          {/* Performance Profiler Overlay */}
          <StatsOverlay stats={stats} />

          {/* Core Three.js WebGL Canvas */}
          <ThreeCanvas
            category={activeCategory}
            parts={parts}
            dimensions={dimensions}
            annotations={currentProduct.annotations}
            environment={currentStudio}
            explosionRatio={explosionRatio}
            autoRotate={autoRotate}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={setSelectedHotspotId}
            onUpdateStats={setStats}
            shaderUniforms={shaderUniforms}
            activeCameraPreset={activeCameraPreset}
          />

          {/* Active Hotspot Info Card */}
          {activeAnnotation && (
            <HotspotTooltip annotation={activeAnnotation} onClose={() => setSelectedHotspotId(null)} />
          )}
        </div>

        {/* Right Side Unity / C# Inspector Panel */}
        {isInspectorOpen && (
          <UnityInspectorPanel
            unityScriptSnippet={currentProduct.unityScriptSnippet}
            parts={parts}
            shaderUniforms={shaderUniforms}
            onUpdateShaderUniforms={handleUpdateShaderUniforms}
            onClose={() => setIsInspectorOpen(false)}
          />
        )}
      </div>

      {/* Summary Quote & Specification Modal */}
      {isSummaryOpen && (
        <SummaryModal
          product={currentProduct}
          parts={parts}
          dimensions={dimensions}
          totalPrice={calculatedTotalPrice}
          onClose={() => setIsSummaryOpen(false)}
          onExportGLTF={handleExportGLTF}
        />
      )}

      {/* AR QR Code Modal */}
      {isAROpen && <ARModal productName={currentProduct.name} onClose={() => setIsAROpen(false)} />}
    </div>
  );
}
