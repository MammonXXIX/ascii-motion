import { Geometry, Mesh, Program, Texture, Transform, type OGLRenderingContext } from "ogl";
import { createInstanceGrid } from "../core/webgl/createInstanceGrid";
import { ASCII_CONFIG, CHROMA_KEY_CONFIG, HOVER_CONFIG, VIDEO_CONFIG } from "../config/constants";
import { generateCharacterAtlas } from "../shaders/ascii/generateCharacterAtlas";
import vertex from '../shaders/ascii/vertex.glsl';
import fragment from '../shaders/ascii/fragment.glsl';

export interface AsciiGridInstance {
    mesh: Mesh
    resize: (viewportWidth: number, viewportHeight: number) => void
    setChromaKeyParams: (threshold: number, smoothness: number) => void
    setTrailTexture: (texture: Texture) => void
    setCurrentTime: (time: number) => void
}

function createUnitQuadAttributes() {
    return {
        position: {
            size: 3,
            data: new Float32Array([
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                0.5,  0.5, 0,
                -0.5,  0.5, 0,
            ])
        },
        uv: {
            size: 2,
            data: new Float32Array([
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ])
        },
        index: {
            data: new Uint16Array([0, 1, 2, 0, 2, 3])
        }
    }
}

function buildGridGeometry(gl: OGLRenderingContext, viewportWidth: number, viewportHeight: number) {
    const grid = createInstanceGrid(viewportWidth, viewportHeight, ASCII_CONFIG.cellSize)

    const geometry = new Geometry(gl, {
        ...createUnitQuadAttributes(),
        aOffset: {
            size: 2,
            data: grid.offsets,
            instanced: 1
        },
        aUv: {
            size: 2,
            data: grid.uvs,
            instanced: 1
        }
    })

    return { geometry, instanceCount: grid.instanceCount }
}

export function createAsciiGrid(
    gl: OGLRenderingContext,
    videoTexture: Texture,
    viewportWidth: number,
    viewportHeight: number
): AsciiGridInstance {
    const atlas = generateCharacterAtlas()
    const atlasTexture = new Texture(gl, {
        image: atlas.canvas,
        generateMipmaps: false,
    })

    const { geometry } = buildGridGeometry(gl, viewportWidth, viewportHeight)

    const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
            tMap: { value: videoTexture },
            tAtlas: { value: atlasTexture },
            tTrail: { value: null },
            uResolution: { value: [viewportWidth, viewportHeight] },
            uVideoResolution: { value: [videoTexture.width || 1, videoTexture.height || 1] },
            uZoom: { value: VIDEO_CONFIG.zoom },
            uThreshold: { value: CHROMA_KEY_CONFIG.threshold },
            uSmoothness: { value: CHROMA_KEY_CONFIG.smoothness },
            uCellSize: { value: ASCII_CONFIG.cellSize },
            uCharCount: { value: atlas.charCount },
            uScrambleCharCount: { value: atlas.scrambleCharCount },
            uScrambleSpeed: { value: HOVER_CONFIG.scrambleSpeed },
            uFlickerChance: { value: HOVER_CONFIG.flickerChance },
            uFlickerSpeed: { value: HOVER_CONFIG.flickerSpeed },
            uCurrentTime: { value: 0 },
        },
    });

    let mesh = new Mesh(gl, { geometry, program, mode: gl.TRIANGLES })

    const resize = (vw: number, vh: number) => {
        const { geometry: newGeometry } = buildGridGeometry(gl, vw, vh)

        const oldGeometry = mesh.geometry
        const parent = mesh.parent
        mesh.setParent(null)

        mesh = new Mesh(gl, { geometry: newGeometry, program, mode: gl.TRIANGLES })
        program.uniforms.uResolution.value = [vw, vh]

        oldGeometry.remove()

        if (parent) {
            mesh.setParent(parent)
        }
    }

    const setChromaKeyParams = (threshold: number, smoothness: number) => {
        program.uniforms.uThreshold.value = threshold
        program.uniforms.uSmoothness.value = smoothness
    };

    const setTrailTexture = (texture: Texture) => {
        program.uniforms.tTrail.value = texture
    }

    const setCurrentTime = (time: number) => {
        program.uniforms.uCurrentTime.value = time
    };

    return {
        get mesh() {
            return mesh
        },
        resize,
        setChromaKeyParams,
        setTrailTexture,
        setCurrentTime
    }
}

export function addAsciiGridToScene(scene: Transform, asciiGrid: AsciiGridInstance): void {
    asciiGrid.mesh.setParent(scene);
}
