import { RenderTarget, Program, Mesh, Triangle, type OGLRenderingContext, type Renderer, type Texture } from 'ogl';
import vertex from '../../shaders/trail/vertex.glsl';
import fragment from '../../shaders/trail/fragment.glsl';
import { TRAIL_CONFIG } from '../../config/constants';

export interface TrailMapInstance {
    readonly texture: Texture;
    update: (renderer: Renderer, mouseUv: [number, number], mouseActive: boolean, deltaTime: number) => void;
}

export function createTrailMap(gl: OGLRenderingContext): TrailMapInstance {
    const size = TRAIL_CONFIG.resolution;

    const targetA = new RenderTarget(gl, { width: size, height: size, depth: false });
    const targetB = new RenderTarget(gl, { width: size, height: size, depth: false });

    let readTarget = targetA;
    let writeTarget = targetB;

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
        tPrevTrail: { value: readTarget.texture },
        uMouseUv: { value: [0.5, 0.5] },
        uMouseActive: { value: false },
        uDecay: { value: TRAIL_CONFIG.decay },
        uDeltaTime: { value: 0 },
        uPaintRadius: { value: TRAIL_CONFIG.paintRadius },
        uPaintSoftness: { value: TRAIL_CONFIG.paintSoftness },
        },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const update = (
        renderer: Renderer,
        mouseUv: [number, number],
        mouseActive: boolean,
        deltaTime: number
    ) => {
        program.uniforms.tPrevTrail.value = readTarget.texture;
        program.uniforms.uMouseUv.value = mouseUv;
        program.uniforms.uMouseActive.value = mouseActive;
        program.uniforms.uDeltaTime.value = deltaTime;

        renderer.render({ scene: mesh, target: writeTarget, clear: false });

        const temp = readTarget;
        readTarget = writeTarget;
        writeTarget = temp;
    };

    return {
        get texture() {
            return readTarget.texture;
        },
        update,
    };
}