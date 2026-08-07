import { Texture, type OGLRenderingContext } from "ogl";

export interface VideoTextureInstance {
    texture: Texture
    update: () => void
}

export function createVideoTexture(gl: OGLRenderingContext, video: HTMLVideoElement): VideoTextureInstance {
    const texture = new Texture(gl, { generateMipmaps: false })

    const update = () => {
        if (texture.image !== video) {
            texture.image = video
        }

        texture.needsUpdate = true
    }

    return { texture, update }
}