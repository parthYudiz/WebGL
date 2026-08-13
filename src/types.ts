export type Category = 'chair' | 'headphones' | 'watch' | 'keyboard';

export interface MaterialOption {
  id: string;
  name: string;
  category: 'metal' | 'leather' | 'fabric' | 'plastic' | 'glass' | 'carbon' | 'wood';
  color: string; // hex
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number; // for glass
  ior?: number;
  textureType?: 'smooth' | 'brushed' | 'leather' | 'carbon' | 'perforated' | 'wood';
  priceMultiplier: number;
}

export interface PartConfig {
  id: string;
  name: string;
  description: string;
  optional: boolean;
  enabled: boolean;
  selectedMaterialId: string;
  explosionOffset: [number, number, number]; // Vector offset in exploded view
  price: number;
}

export interface DimensionConfig {
  id: string;
  name: string;
  min: number;
  max: number;
  value: number;
  unit: 'mm' | 'cm' | 'deg';
  affectedMeshPart: string;
}

export interface AnnotationHotspot {
  id: string;
  title: string;
  description: string;
  position: [number, number, number]; // 3D local position on product
  partId: string;
  specs: string;
}

export interface ProductPreset {
  id: Category;
  name: string;
  tagline: string;
  basePrice: number;
  thumbnailIcon: string;
  parts: PartConfig[];
  dimensions: DimensionConfig[];
  annotations: AnnotationHotspot[];
  unityScriptSnippet: string;
}

export interface StudioEnvironment {
  id: string;
  name: string;
  bgColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  fillLightColor: string;
  fillLightIntensity: number;
  shadows: boolean;
  skyboxType: 'studio' | 'cyber' | 'warm' | 'minimal' | 'outdoor';
}

export interface PerformanceStats {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  textures: number;
  geometries: number;
  webglVersion: string;
}

export interface ShaderUniforms {
  roughnessShift: number;
  metallicFactor: number;
  fresnelBias: number;
  rimColor: string;
  emissiveSpeed: number;
  wireframe: boolean;
}
