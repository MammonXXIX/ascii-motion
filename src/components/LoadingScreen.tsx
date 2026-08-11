import gsap from "gsap"
import { useEffect, useRef, useState } from "react"

export interface LoadingScreenProps {
    progress: number
    isReady: boolean
}

const MATRIX_CHARS = "01"
const FONT_SIZE = 16

export default function LoadingScreen({ progress, isReady }: LoadingScreenProps) {
    const percentRef = useRef<HTMLDivElement>(null);
    const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(true);
    const hasRevealed = useRef(false);
    const rafIdRef = useRef<number>(0);

    useEffect(() => {
        const canvas = matrixCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resize();
        window.addEventListener('resize', resize);

        const columnCount = Math.ceil(canvas.width / FONT_SIZE);
        const drops = new Array(columnCount)
            .fill(0)
            .map(() => canvas.height / FONT_SIZE + Math.random() * 50);

        const draw = () => {
            ctx.fillStyle = 'rgba(13, 13, 15, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${FONT_SIZE}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                const x = i * FONT_SIZE;
                const y = drops[i] * FONT_SIZE;

                ctx.fillStyle = "#FFFFFF"
                ctx.fillText(char, x, y);

                if (y < 0 && Math.random() > 0.975) {
                    drops[i] = canvas.height / FONT_SIZE;
                } else {
                    drops[i]--;
                }
            }

            rafIdRef.current = requestAnimationFrame(draw);
        };

        rafIdRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        if (!isReady || hasRevealed.current) return;
        hasRevealed.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                cancelAnimationFrame(rafIdRef.current);
                setVisible(false);
            },
        });

        tl.to(percentRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
        });

        tl.to(
            matrixCanvasRef.current,
            {
                opacity: 0,
                duration: 1.4,
                ease: 'power2.inOut',
            },
            '<0.1'
        );
    }, [isReady]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <canvas ref={matrixCanvasRef} className="fixed inset-0 w-full h-full bg-background" />
            <div
                ref={percentRef}
                className="relative font-mono text-[clamp(2.5rem,8vw,5rem)] text-white tracking-[0.08em] drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            >
                {Math.floor(progress)}%
            </div>
        </div>
    )
}