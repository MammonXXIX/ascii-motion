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
    src: 'videos/003.mp4',
    zoom: 1.3
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
    cellSize: number
    atlasCharSize: number
    fontFamily: string
}

export const ASCII_CONFIG: AsciiConfig = {
    charset: " .:-=+*#%@",
    cellSize: 8,
    atlasCharSize: 24,
    fontFamily: "monospace"
}

export interface MouseInteractionConfig {
    repelRadius: number
    repelStrength: number
    depthStrength: number
}

export const MOUSE_INTERACTION_CONFIG: MouseInteractionConfig = {
    repelRadius: 100,
    repelStrength: 20,
    depthStrength: 50
}
