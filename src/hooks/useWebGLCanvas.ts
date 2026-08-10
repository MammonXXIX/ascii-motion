import { useEffect, useRef, useState, type RefObject } from "react";
import { VIDEO_CONFIG } from "../config/constants";
import { createCamera } from "../core/webgl/createCamera";
import { createRenderer, resizeRenderer } from "../core/webgl/createRenderer";
import { createScene } from "../core/webgl/createScene";
import { createVideoTexture } from "../core/webgl/createVideoTexture";
import { loadVideo } from "../core/webgl/loadVideo";
import { addAsciiGridToScene, createAsciiGrid } from "../scene/AsciiGrid";
import { createMouseTracker } from "../core/interaction/createMouseTracker";
import { createTrailMap } from "../core/webgl/createTrailMap";
import { createPostProcessing } from "../core/webgl/createPostProcessing";

export interface WebGLCanvasRefs {
    containerRef: RefObject<HTMLDivElement | null>
    canvasRef: RefObject<HTMLCanvasElement | null>
    loadProgress: number
    isReady: boolean
}

export function useWebGLCanvas(): WebGLCanvasRefs {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loadProgress, setLoadProgress] = useState(0)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current

        if (!container || !canvas) return;

        const { renderer, gl } = createRenderer(canvas)
        resizeRenderer(renderer, container)

        const { camera, syncToViewport } = createCamera(gl, container.clientWidth, container.clientHeight)

        const scene = createScene()

        const { video, ready } = loadVideo(VIDEO_CONFIG.src, (percent) => {
            setLoadProgress(percent)
        })
        const videoTexture = createVideoTexture(gl, video)

        const asciiGrid = createAsciiGrid(gl, videoTexture.texture, container.clientWidth, container.clientHeight)
        addAsciiGridToScene(scene, asciiGrid)

        const mouseTracker = createMouseTracker(container)
        const trailMap = createTrailMap(gl)
        asciiGrid.setTrailTexture(trailMap.texture)

        const postProcessing = createPostProcessing(gl, container.clientWidth, container.clientHeight)

        let isVideoReady = false
        ready.then((readyVideo) => {
            isVideoReady = true
            setIsReady(true)
            asciiGrid.mesh.program.uniforms.uVideoResolution.value = [
                readyVideo.videoWidth,
                readyVideo.videoHeight,
            ]
        })

        const handleResize = () => {
            const { width, height } = resizeRenderer(renderer, container)
            syncToViewport(width, height)
            asciiGrid.resize(width, height)
            postProcessing.resize(width, height)
        }

        const startTime = performance.now()
        let lastFrameTime = performance.now()
        let rafID: number
        const renderLoop = () => {
            const currentTime = (performance.now() - startTime) / 1000
            const now = performance.now()
            const deltaTime = (now - lastFrameTime) / 1000

            lastFrameTime = now

            if (isVideoReady) {
                videoTexture.update()
            }

            mouseTracker.update()

            const mouseActive = mouseTracker.position.x < 100000
            const mouseUv: [number, number] = [
                mouseTracker.position.x / container.clientWidth + 0.5,
                mouseTracker.position.y / container.clientHeight + 0.5,
            ]
            trailMap.update(renderer, mouseUv, mouseActive, deltaTime)
            asciiGrid.setTrailTexture(trailMap.texture)

            asciiGrid.setCurrentTime(currentTime)

            // renderer.render({ scene, camera })
            postProcessing.render(renderer, scene, camera, currentTime)
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

    return { containerRef, canvasRef, loadProgress, isReady }
}
