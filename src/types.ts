export interface Adjustments {
  brightness: number;  // -100 to 100 (0 default)
  contrast: number;    // -100 to 100 (0 default)
  saturation: number;  // -100 to 100 (0 default)
  warmth: number;      // -100 to 100 (0 default)
  tint: number;        // -100 to 100 (0 default)
  exposure: number;    // -100 to 100 (0 default)
  sepia: number;       // 0 to 100 (0 default)
  grayscale: number;   // 0 to 100 (0 default)
  blur: number;        // 0 to 20 (0 default)
  hueRotate: number;   // 0 to 360 (0 default)
  vignette: number;    // 0 to 100 (0 default)
}

export interface Transforms {
  rotate: number;      // 0, 90, 180, 270
  flipH: boolean;      // horizontal mirror
  flipV: boolean;      // vertical mirror
}

export interface EditorState {
  adjustments: Adjustments;
  transforms: Transforms;
}

export interface Preset {
  id: string;
  name: string;
  adjustments: Partial<Adjustments>;
}

export type TabType = 'presets' | 'light' | 'color' | 'effects' | 'transform';

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  exposure: 0,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  hueRotate: 0,
  vignette: 0,
};

export const DEFAULT_TRANSFORMS: Transforms = {
  rotate: 0,
  flipH: false,
  flipV: false,
};

export const PRESETS: Preset[] = [
  {
    id: 'original',
    name: 'Original',
    adjustments: { ...DEFAULT_ADJUSTMENTS },
  },
  {
    id: 'vivid',
    name: 'Vivid',
    adjustments: {
      contrast: 20,
      saturation: 35,
      brightness: 5,
      warmth: 10,
    },
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    adjustments: {
      warmth: 40,
      tint: 15,
      contrast: 15,
      brightness: 10,
      saturation: 20,
      vignette: 25,
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    adjustments: {
      contrast: 45,
      brightness: -10,
      saturation: -15,
      vignette: 40,
    },
  },
  {
    id: 'vintage',
    name: 'Vintage 70s',
    adjustments: {
      sepia: 35,
      contrast: 10,
      warmth: 25,
      saturation: -10,
      vignette: 30,
    },
  },
  {
    id: 'noir',
    name: 'B&W Noir',
    adjustments: {
      grayscale: 100,
      contrast: 40,
      brightness: -5,
      vignette: 35,
    },
  },
  {
    id: 'silver',
    name: 'Silver Screen',
    adjustments: {
      grayscale: 100,
      contrast: 15,
      brightness: 12,
      exposure: 10,
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    adjustments: {
      contrast: 30,
      saturation: 50,
      hueRotate: 180,
      vignette: 20,
    },
  },
  {
    id: 'cool',
    name: 'Arctic Frost',
    adjustments: {
      warmth: -40,
      tint: -15,
      saturation: -10,
      contrast: 15,
      brightness: 5,
    },
  },
];
