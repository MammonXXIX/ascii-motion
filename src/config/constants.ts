export interface RendererConfig {
    clearColor: [number, number, number, number]
    maxPixelRatio: number
    alpha: boolean
}

export const RENDERER_CONFIG: RendererConfig = {
    clearColor: [0.05, 0.05, 0.06, 1],
    maxPixelRatio: 2,
    alpha: true
}

export interface CameraConfig {
    fov: number
    near: number
    far: number
}

export const CAMERA_CONFIG: CameraConfig = {
    fov: 45,
    near: 0.1,
    far: 10000
}

export interface VideoConfig {
    src: string
    zoom: number
}

export const VIDEO_CONFIG: VideoConfig = {
    src: 'videos/004.mp4',
    zoom: 1.25
};

export interface ChromaKeyConfig {
    keyColor: [number, number, number]
    threshold: number
    smoothness: number
}

export const CHROMA_KEY_CONFIG: ChromaKeyConfig = {
    keyColor: [0.0, 0.7, 0.0],
    threshold: 0.12,
    smoothness: 0.1,
}

export interface AsciiConfig {
    charset: string
    scrambleCharset: string
    cellSize: number
    atlasCharSize: number
    fontFamily: string
}

export const ASCII_CONFIG: AsciiConfig = {
    charset: " .:-=+*#%@",
    scrambleCharset: "01",
    cellSize: 12,
    atlasCharSize: 64,
    fontFamily: "monospace"
}

export interface HoverConfig {
    scrambleSpeed: number
    flickerChance: number
    flickerSpeed: number
}

export const HOVER_CONFIG: HoverConfig = {
    scrambleSpeed: 1,
    flickerChance: 0.3,
    flickerSpeed: 1
}

export interface TrailConfig {
    resolution: number
    decay: number
    paintRadius: number
    paintSoftness: number
}

export const TRAIL_CONFIG: TrailConfig = {
    resolution: 32,
    decay: 0.05,
    paintRadius: 0.04,
    paintSoftness: 0.02
}

export interface PostProcessingConfig {
    chromaticAberration: number
    noiseAmount: number
}

export const POST_PROCESSING_CONFIG: PostProcessingConfig = {
    chromaticAberration: 0.02,
    noiseAmount: 0.25
}
