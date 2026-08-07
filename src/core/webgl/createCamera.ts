import { Camera, type OGLRenderingContext } from "ogl";
import { CAMERA_CONFIG } from "../../config/constants";

export interface CameraInstance {
    camera: Camera
    syncToViewport: (width: number, height: number) => void
}

export function createCamera(gl: OGLRenderingContext, width: number, height: number): CameraInstance {
    const camera = new Camera(gl, {
        fov: CAMERA_CONFIG.fov,
        near: CAMERA_CONFIG.near,
        far: CAMERA_CONFIG.far
    })

    const syncToViewport = (viewportWidth: number, viewportHeight: number) => {
        const fovInRadians = (CAMERA_CONFIG.fov * Math.PI) / 180
        const distance = viewportHeight / 2 / Math.tan(fovInRadians / 2)

        camera.position.set(0, 0, distance)
        camera.lookAt([0, 0, 0])
        camera.perspective({ aspect: viewportWidth / viewportHeight })
    }

    syncToViewport(width, height)

    return { camera, syncToViewport }
}