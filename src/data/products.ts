import { MaterialOption, ProductPreset, StudioEnvironment } from '../types';

export const MATERIAL_LIBRARY: MaterialOption[] = [
  {
    id: 'mat_anodized_black',
    name: 'Anodized Matte Stealth',
    category: 'metal',
    color: '#1a1d20',
    roughness: 0.35,
    metalness: 0.85,
    textureType: 'brushed',
    priceMultiplier: 1.0,
  },
  {
    id: 'mat_space_grey',
    name: 'Space Grey Aluminum',
    category: 'metal',
    color: '#6e747a',
    roughness: 0.25,
    metalness: 0.9,
    textureType: 'brushed',
    priceMultiplier: 1.15,
  },
  {
    id: 'mat_raw_titanium',
    name: 'Raw Grade 5 Titanium',
    category: 'metal',
    color: '#9ba0a6',
    roughness: 0.4,
    metalness: 0.95,
    textureType: 'brushed',
    priceMultiplier: 1.4,
  },
  {
    id: 'mat_rose_gold',
    name: 'Liquid Rose Gold',
    category: 'metal',
    color: '#d4af37',
    roughness: 0.15,
    metalness: 0.95,
    clearcoat: 0.5,
    textureType: 'smooth',
    priceMultiplier: 1.35,
  },
  {
    id: 'mat_carbon_weave',
    name: 'Forged 3K Carbon Fiber',
    category: 'carbon',
    color: '#141416',
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    textureType: 'carbon',
    priceMultiplier: 1.5,
  },
  {
    id: 'mat_nappa_leather_black',
    name: 'Italian Nappa Leather (Black)',
    category: 'leather',
    color: '#121214',
    roughness: 0.65,
    metalness: 0.05,
    textureType: 'leather',
    priceMultiplier: 1.25,
  },
  {
    id: 'mat_saddle_brown_leather',
    name: 'Cognac Saddle Leather',
    category: 'leather',
    color: '#8b4513',
    roughness: 0.7,
    metalness: 0.02,
    textureType: 'leather',
    priceMultiplier: 1.3,
  },
  {
    id: 'mat_alcantara_grey',
    name: 'Perforated Alcantara Suede',
    category: 'fabric',
    color: '#34383c',
    roughness: 0.9,
    metalness: 0.0,
    textureType: 'perforated',
    priceMultiplier: 1.2,
  },
  {
    id: 'mat_walnut_wood',
    name: 'Smoked American Walnut',
    category: 'wood',
    color: '#4a2f1d',
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.4,
    textureType: 'wood',
    priceMultiplier: 1.45,
  },
  {
    id: 'mat_cyber_cyan_glass',
    name: 'Sapphire Crystal (Electro Cyan)',
    category: 'glass',
    color: '#00d2ff',
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.52,
    textureType: 'smooth',
    priceMultiplier: 1.6,
  },
  {
    id: 'mat_neon_orange_accent',
    name: 'Signal Orange Soft-Touch',
    category: 'plastic',
    color: '#ff5500',
    roughness: 0.4,
    metalness: 0.1,
    textureType: 'smooth',
    priceMultiplier: 1.05,
  },
];

export const PRODUCTS: ProductPreset[] = [
  {
    id: 'chair',
    name: 'AeroSpine-X Pro Pod Chair',
    tagline: 'Precision Ergonomic Executive Task Chair with Dynamic Lumbar Architecture',
    basePrice: 1290,
    thumbnailIcon: 'Armchair',
    parts: [
      {
        id: 'backrest',
        name: 'Aerated Mesh Backrest Frame',
        description: 'Biomorphic flexible spine support structure',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_anodized_black',
        explosionOffset: [0, 0, -1.8],
        price: 380,
      },
      {
        id: 'seat_cushion',
        name: 'Contoured Molded Seat Cushion',
        description: 'Multi-density pressure relief memory cushion',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_nappa_leather_black',
        explosionOffset: [0, 0.8, 0],
        price: 290,
      },
      {
        id: 'armrests',
        name: '4D Precision Armrest Pods',
        description: 'Height, pivot, and depth adjustable arm pads',
        optional: true,
        enabled: true,
        selectedMaterialId: 'mat_space_grey',
        explosionOffset: [1.8, 0, 0],
        price: 180,
      },
      {
        id: 'headrest',
        name: 'Cervical Support Headrest',
        description: 'Dynamic angle & height neck pillow',
        optional: true,
        enabled: true,
        selectedMaterialId: 'mat_carbon_weave',
        explosionOffset: [0, 2.2, -0.5],
        price: 140,
      },
      {
        id: 'gas_lift',
        name: 'Class-4 Hydraulic Gas Piston',
        description: 'Heavy duty heavy gas cylinder & tilt mechanism',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_raw_titanium',
        explosionOffset: [0, -1.2, 0],
        price: 120,
      },
      {
        id: 'base_wheels',
        name: '5-Star Aircraft Alloy Base & Caster Wheels',
        description: 'Silent polyurethane smooth rolling gliders',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_anodized_black',
        explosionOffset: [0, -2.5, 0],
        price: 180,
      },
    ],
    dimensions: [
      {
        id: 'seat_height',
        name: 'Piston Lift Height',
        min: 42,
        max: 58,
        value: 50,
        unit: 'cm',
        affectedMeshPart: 'gas_lift',
      },
      {
        id: 'backrest_recline',
        name: 'Backrest Angle Pitch',
        min: 90,
        max: 135,
        value: 105,
        unit: 'deg',
        affectedMeshPart: 'backrest',
      },
      {
        id: 'seat_width',
        name: 'Seat Cushion Width',
        min: 45,
        max: 60,
        value: 52,
        unit: 'cm',
        affectedMeshPart: 'seat_cushion',
      },
    ],
    annotations: [
      {
        id: 'hotspot_lumbar',
        title: 'Dynamic Lumbar Suspension',
        description: 'Active pressure response mechanism aligns with lower lumbar spine S-curve.',
        position: [0, 0.4, -0.3],
        partId: 'backrest',
        specs: 'Torque resistance: 12Nm | Travel: 45mm',
      },
      {
        id: 'hotspot_gas',
        title: 'Precision Hydraulic Chamber',
        description: 'Class-4 explosion-proof gas column tested for 150,000 compression cycles.',
        position: [0, -0.6, 0],
        partId: 'gas_lift',
        specs: 'Max Load: 250kg | Pressure: 400 PSI',
      },
      {
        id: 'hotspot_armrest',
        title: '4D Haptic Control Armrest',
        description: 'Anodized aluminum slider joints with 360-degree lockable rotation.',
        position: [0.9, 0.3, 0.1],
        partId: 'armrests',
        specs: '4 Axes Adjustability | Soft-Touch TPU',
      },
    ],
    unityScriptSnippet: `// C# Unity ThreeJS Bridge - ChairConfiguratorController.cs
using UnityEngine;

[System.Serializable]
public class ChairComponentState {
    [SerializeField] public string partId;
    [SerializeField] public Material pbrMaterial;
    [SerializeField] public bool isExploded;
    [SerializeField] [Range(0.0f, 1.0f)] public float roughness = 0.35f;
    [SerializeField] [Range(0.0f, 1.0f)] public float metalness = 0.85f;
}

public class ChairConfigurator : MonoBehaviour {
    [Header("WebGL Mesh Anchors")]
    public Transform backrestMesh;
    public Transform gasPistonMesh;
    public Transform seatBaseMesh;

    [Header("PBR Material Library")]
    public ChairComponentState[] componentStates;

    public void OnDimensionUpdate(string dimKey, float value) {
        if (dimKey == "seat_height") {
            gasPistonMesh.localScale = new Vector3(1f, value / 50f, 1f);
        }
    }
}`,
  },
  {
    id: 'headphones',
    name: 'AcoustiX Pro Studio Headphones',
    tagline: 'High-Fidelity Planar Magnetic Studio Headphones with Modular Architecture',
    basePrice: 650,
    thumbnailIcon: 'Headphones',
    parts: [
      {
        id: 'earcups',
        name: 'Acoustic Driver Ear Chambers',
        description: 'CNC machined acoustic housing with vibration dampening',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_space_grey',
        explosionOffset: [2.2, 0, 0],
        price: 240,
      },
      {
        id: 'earpads',
        name: 'Ergonomic Memory Ear Cushions',
        description: 'Breathable perforated leatherette pads',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_nappa_leather_black',
        explosionOffset: [3.2, 0, 0],
        price: 110,
      },
      {
        id: 'headband_frame',
        name: 'Spring Steel Headband Arch',
        description: 'Precision spring steel skeleton with tension adjustments',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_raw_titanium',
        explosionOffset: [0, 1.8, 0],
        price: 160,
      },
      {
        id: 'headband_strap',
        name: 'Weight Distribution Strap',
        description: 'Soft padded leather comfort suspension headband',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_saddle_brown_leather',
        explosionOffset: [0, 1.0, 0],
        price: 80,
      },
      {
        id: 'boom_mic',
        name: 'Broadcast Noise-Cancelling Mic',
        description: 'Detachable flexible cardioid condenser microphone',
        optional: true,
        enabled: true,
        selectedMaterialId: 'mat_anodized_black',
        explosionOffset: [-1.8, -1.2, 1.2],
        price: 60,
      },
    ],
    dimensions: [
      {
        id: 'earcup_diameter',
        name: 'Ear Cup Diameter',
        min: 80,
        max: 110,
        value: 95,
        unit: 'mm',
        affectedMeshPart: 'earcups',
      },
      {
        id: 'headband_span',
        name: 'Headband Yoke Width',
        min: 160,
        max: 220,
        value: 190,
        unit: 'mm',
        affectedMeshPart: 'headband_frame',
      },
    ],
    annotations: [
      {
        id: 'hotspot_driver',
        title: '50mm Beryllium Planar Magnet',
        description: 'Ultra-thin nanometer diaphragm delivers 5Hz - 45kHz frequency response.',
        position: [1.2, 0, 0.2],
        partId: 'earcups',
        specs: 'THD: < 0.05% | Impedance: 32 Ohms',
      },
      {
        id: 'hotspot_yoke',
        title: 'Titanium Pivot Gimbal',
        description: 'Gimbal joint enables 180-degree rotation and custom swivel lock.',
        position: [0.9, 0.9, 0],
        partId: 'headband_frame',
        specs: 'Grade-5 Titanium | 2D Swivel Axis',
      },
    ],
    unityScriptSnippet: `// C# Unity ThreeJS Bridge - HeadphonesController.cs
using UnityEngine;

public class HeadphonesController : MonoBehaviour {
    [SerializeField] private MeshRenderer earCupRenderer;
    [SerializeField] private Transform leftEarCup, rightEarCup;
    [SerializeField] private Light rgbUnderglowLight;

    public void UpdateMaterialProperties(Color baseColor, float roughness, float metallic) {
        Material mat = earCupRenderer.material;
        mat.SetColor("_BaseColor", baseColor);
        mat.SetFloat("_Roughness", roughness);
        mat.SetFloat("_Metallic", metallic);
    }
}`,
  },
  {
    id: 'watch',
    name: 'Chronos Horizon Precision Watch',
    tagline: 'Titanium Architectural Smart Chronograph with Modular Strap & Bezel Architecture',
    basePrice: 890,
    thumbnailIcon: 'Watch',
    parts: [
      {
        id: 'watch_case',
        name: 'Grade-5 Titanium Case Chassis',
        description: 'Hermetically sealed water resistant main frame',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_raw_titanium',
        explosionOffset: [0, 0, 0],
        price: 360,
      },
      {
        id: 'bezel_ring',
        name: 'Tactile Ceramic Bezel Ring',
        description: 'Rotatable index ring with custom laser markings',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_anodized_black',
        explosionOffset: [0, 0, 1.2],
        price: 150,
      },
      {
        id: 'glass_lens',
        name: 'Domed Sapphire Crystal Glass',
        description: 'Anti-reflective double coated scratch-proof crystal',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_cyber_cyan_glass',
        explosionOffset: [0, 0, 2.0],
        price: 140,
      },
      {
        id: 'wrist_band',
        name: 'Articulated Link / Strap Assembly',
        description: 'Quick-release deployment clasp strap assembly',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_saddle_brown_leather',
        explosionOffset: [0, -2.2, 0],
        price: 180,
      },
      {
        id: 'crown_dial',
        name: 'Haptic Digital Crown & Pushers',
        description: 'Rotary digital encoder button with haptic motor feedback',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_rose_gold',
        explosionOffset: [1.8, 0, 0],
        price: 60,
      },
    ],
    dimensions: [
      {
        id: 'case_diameter',
        name: 'Case Diameter',
        min: 38,
        max: 46,
        value: 42,
        unit: 'mm',
        affectedMeshPart: 'watch_case',
      },
      {
        id: 'case_thickness',
        name: 'Chassis Profile Thickness',
        min: 9,
        max: 16,
        value: 12,
        unit: 'mm',
        affectedMeshPart: 'watch_case',
      },
    ],
    annotations: [
      {
        id: 'hotspot_bezel',
        title: 'Laser Ceramic Bezel',
        description: 'High-hardness zirconium ceramic withstands extreme thermal shocks.',
        position: [0, 1.1, 0.4],
        partId: 'bezel_ring',
        specs: 'Vickers Hardness: 1500 HV | 120-click detent',
      },
      {
        id: 'hotspot_dial',
        title: 'Haptic Crown Encoder',
        description: 'Optical rotary encoder reads 0.1 degree micro-rotations for fluid UI navigation.',
        position: [1.2, 0, 0.1],
        partId: 'crown_dial',
        specs: 'Resolution: 360 ticks/rev | IP68 Sealed',
      },
    ],
    unityScriptSnippet: `// C# Unity ThreeJS Bridge - WatchChassisShader.cs
using UnityEngine;

public class WatchChassisShader : MonoBehaviour {
    [Range(0, 1)] public float glassRefractionIndex = 0.85f;
    [ColorUsage(true, true)] public Color screenEmissive = Color.cyan;

    void ApplyShaderProperties(Material watchMat) {
        watchMat.SetFloat("_IOR", glassRefractionIndex);
        watchMat.SetColor("_EmissionColor", screenEmissive);
    }
}`,
  },
  {
    id: 'keyboard',
    name: 'CyberBoard Matrix 75% Mechanical',
    tagline: 'Gasket-Mounted Anodized Aluminum Mechanical Keyboard with Dynamic OLED & RGB',
    basePrice: 420,
    thumbnailIcon: 'Keyboard',
    parts: [
      {
        id: 'kb_case',
        name: 'CNC Aluminum Heavy Shell',
        description: 'Solid billet aluminum bottom chassis with brass weight plate',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_anodized_black',
        explosionOffset: [0, -1.2, 0],
        price: 190,
      },
      {
        id: 'keycaps',
        name: 'Double-Shot PBT Keycap Set',
        description: 'Sculpted Cherry profile keycaps with crisp legends',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_carbon_weave',
        explosionOffset: [0, 1.2, 0],
        price: 90,
      },
      {
        id: 'accent_plate',
        name: 'Brass Top Accent Plate',
        description: 'Precision cut brass switch mounting plate',
        optional: false,
        enabled: true,
        selectedMaterialId: 'mat_rose_gold',
        explosionOffset: [0, 0.5, 0],
        price: 80,
      },
      {
        id: 'volume_knob',
        name: 'Rotary Control Knob',
        description: 'Tactile media controller knob with diamond knurling',
        optional: true,
        enabled: true,
        selectedMaterialId: 'mat_neon_orange_accent',
        explosionOffset: [1.8, 0.8, -0.8],
        price: 60,
      },
    ],
    dimensions: [
      {
        id: 'keyboard_incline',
        name: 'Keyboard Incline Angle',
        min: 3,
        max: 12,
        value: 7,
        unit: 'deg',
        affectedMeshPart: 'kb_case',
      },
    ],
    annotations: [
      {
        id: 'hotspot_gasket',
        title: 'Poron Foam Gasket Mount',
        description: 'Isolates the PCB plate from the aluminum body for a deep, acoustically dampened typing sound.',
        position: [-1.2, 0.2, 0],
        partId: 'kb_case',
        specs: 'Flex factor: 3.5mm | Sound Profile: Thocky',
      },
      {
        id: 'hotspot_knob',
        title: 'Tactile CNC Knob',
        description: 'Customizable multifunction media and lighting control dial.',
        position: [1.5, 0.4, -0.6],
        partId: 'volume_knob',
        specs: 'Material: Anodized Alloy | Haptic Detents',
      },
    ],
    unityScriptSnippet: `// C# Unity ThreeJS Bridge - KeyboardRGBManager.cs
using UnityEngine;

public class KeyboardRGBManager : MonoBehaviour {
    public Material keycapMaterial;
    public float rgbSpeed = 2.0f;

    void Update() {
        float hue = Mathf.PingPong(Time.time * rgbSpeed, 1.0f);
        Color rgbColor = Color.HSVToRGB(hue, 0.8f, 1.0f);
        keycapMaterial.SetColor("_EmissionColor", rgbColor);
    }
}`,
  },
];

export const STUDIO_PRESETS: StudioEnvironment[] = [
  {
    id: 'studio_soft',
    name: 'Soft Product Studio',
    bgColor: '#111317',
    ambientIntensity: 0.8,
    keyLightColor: '#ffffff',
    keyLightIntensity: 2.2,
    fillLightColor: '#8090a0',
    fillLightIntensity: 1.2,
    shadows: true,
    skyboxType: 'studio',
  },
  {
    id: 'studio_cyber',
    name: 'Cyberpunk Neon Dark',
    bgColor: '#08090d',
    ambientIntensity: 0.4,
    keyLightColor: '#00f0ff',
    keyLightIntensity: 3.0,
    fillLightColor: '#ff0055',
    fillLightIntensity: 2.5,
    shadows: true,
    skyboxType: 'cyber',
  },
  {
    id: 'studio_warm',
    name: 'Warm Sunset Glow',
    bgColor: '#161210',
    ambientIntensity: 0.7,
    keyLightColor: '#ffaa44',
    keyLightIntensity: 2.8,
    fillLightColor: '#ff44aa',
    fillLightIntensity: 1.0,
    shadows: true,
    skyboxType: 'warm',
  },
  {
    id: 'studio_minimal',
    name: 'Pure Clean White',
    bgColor: '#f0f3f6',
    ambientIntensity: 1.2,
    keyLightColor: '#ffffff',
    keyLightIntensity: 1.8,
    fillLightColor: '#d0d8e0',
    fillLightIntensity: 1.0,
    shadows: true,
    skyboxType: 'minimal',
  },
];
