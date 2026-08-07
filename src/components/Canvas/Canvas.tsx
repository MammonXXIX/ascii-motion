import { useWebGLCanvas } from "../../hooks/useWebGLCanvas";
import './Canvas.css';

export default function Canvas() {
    const { containerRef, canvasRef } = useWebGLCanvas()

    return (
        <div ref={containerRef} className="webgl-canvas-container">
            <canvas ref={canvasRef} className="webgl-canvas" />
        </div>
    )
}