import { useWebGLCanvas } from "../../hooks/useWebGLCanvas";
import LoadingScreen from "../LoadingScreen";

export default function Canvas() {
    const { containerRef, canvasRef, loadProgress, isReady } = useWebGLCanvas()

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
            </div>
            <LoadingScreen
                progress={loadProgress}
                isReady={isReady}
            />
        </>
    )
}