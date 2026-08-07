import { Renderer, type OGLRenderingContext } from 'ogl';
import { RENDERER_CONFIG } from '../../config/constants';

export interface RendererInstance {
    renderer: Renderer
    gl: OGLRenderingContext
}

export function createRenderer(canvas: HTMLCanvasElement): RendererInstance {
    const renderer = new Renderer({
        canvas,
        alpha: RENDERER_CONFIG.alpha,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, RENDERER_CONFIG.maxPixelRatio)
    })

    const { gl } = renderer
    const [r, g, b, a] = RENDERER_CONFIG.clearColor
    gl.clearColor(r, g, b, a)

    return { renderer, gl }
}

export function resizeRenderer(renderer: Renderer, container: HTMLElement): { width: number; height: number } {
    const { clientWidth: width, clientHeight: height } = container
    renderer.setSize(width, height)

    return { width, height }
}