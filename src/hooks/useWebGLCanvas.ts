import { useEffect, useRef, type RefObject } from "react";
import { VIDEO_CONFIG } from "../config/constants";
import { createCamera } from "../core/webgl/createCamera";
import { createRenderer, resizeRenderer } from "../core/webgl/createRenderer";
import { createScene } from "../core/webgl/createScene";
import { createVideoTexture } from "../core/webgl/createVideoTexture";
import { loadVideo } from "../core/webgl/loadVideo";
import { addAsciiGridToScene, createAsciiGrid } from "../scene/AsciiGrid";
import { createMouseTracker } from "../core/interaction/createMouseTracker";

export interface WebGLCanvasRefs {
    containerRef: RefObject<HTMLDivElement | null>
    canvasRef: RefObject<HTMLCanvasElement | null>
}

export function useWebGLCanvas(): WebGLCanvasRefs {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current

        if (!container || !canvas) return;

        const { renderer, gl } = createRenderer(canvas)
        resizeRenderer(renderer, container)

        const { camera, syncToViewport } = createCamera(gl, container.clientWidth, container.clientHeight)

        const scene = createScene()

        const { video, ready } = loadVideo(VIDEO_CONFIG.src)
        const videoTexture = createVideoTexture(gl, video)

        const asciiGrid = createAsciiGrid(gl, videoTexture.texture, container.clientWidth, container.clientHeight)
        addAsciiGridToScene(scene, asciiGrid)

        const mouseTracker = createMouseTracker(container)

        let isVideoReady = false
        ready.then((readyVideo) => {
            isVideoReady = true
            asciiGrid.mesh.program.uniforms.uVideoResolution.value = [
                readyVideo.videoWidth,
                readyVideo.videoHeight,
            ]
        })

        const handleResize = () => {
            const { width, height } = resizeRenderer(renderer, container)
            syncToViewport(width, height)
            asciiGrid.resize(width, height)
        }

        let rafID: number
        const renderLoop = () => {
            if (isVideoReady) {
                videoTexture.update()
            }

            mouseTracker.update()
            asciiGrid.setMousePosition(mouseTracker.position.x, mouseTracker.position.y)

            renderer.render({ scene, camera })
            rafID = requestAnimationFrame(renderLoop)
        }
        rafID = requestAnimationFrame(renderLoop)

        const resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(container)

        return () => {
            cancelAnimationFrame(rafID)
            resizeObserver.disconnect()
            mouseTracker.destroy()
            video.pause()
            video.src = ''
            video.load()
        }
    }, [])

    return { containerRef, canvasRef }
}
