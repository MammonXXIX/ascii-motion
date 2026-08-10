import { RenderTarget, Program, Mesh, Triangle, type OGLRenderingContext, type Renderer, type Transform, type Camera } from 'ogl';
import vertex from '../../shaders/post-processing/vertex.glsl';
import fragment from '../../shaders/post-processing/fragment.glsl';
import { POST_PROCESSING_CONFIG } from '../../config/constants';

export interface PostProcessingInstance {
    render: (renderer: Renderer, scene: Transform, camera: Camera, currentTime: number) => void;
    resize: (width: number, height: number) => void;
}

export function createPostProcessing(gl: OGLRenderingContext, width: number, height: number): PostProcessingInstance {
    let sceneTarget = new RenderTarget(gl, { width, height, depth: false });

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
        tScene: { value: sceneTarget.texture },
        uChromaticAberration: { value: POST_PROCESSING_CONFIG.chromaticAberration },
        uNoiseAmount: { value: POST_PROCESSING_CONFIG.noiseAmount },
        uTime: { value: 0 },
        },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const render = (renderer: Renderer, scene: Transform, camera: Camera, currentTime: number) => {
        renderer.render({ scene, camera, target: sceneTarget });

        program.uniforms.tScene.value = sceneTarget.texture;
        program.uniforms.uTime.value = currentTime;
        renderer.render({ scene: mesh });
    };

    const resize = (newWidth: number, newHeight: number) => {
        sceneTarget = new RenderTarget(gl, { width: newWidth, height: newHeight, depth: false });
    };

    return { render, resize };
}