import gsap from "gsap"
import { useEffect, useRef, useState, type RefObject } from "react"

export interface LoadingScreenProps {
    progress: number
    isReady: boolean
    revealTargetRef: RefObject<HTMLElement | null>
}

const SWEEP_CHARS = "01"

function randomSweepText(length: number): string {
    let result = ""

    for (let i = 0; i < length; i++) {
        result += SWEEP_CHARS[Math.floor(Math.random() * SWEEP_CHARS.length)]
    }

    return result
}

export default function LoadingScreen({ progress, isReady, revealTargetRef }: LoadingScreenProps) {
    const percentRef = useRef<HTMLDivElement>(null);
    const sweepRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const hasRevealed = useRef(false);

    useEffect(() => {
        const target = revealTargetRef.current

        if (target) {
            target.style.clipPath = "inset(100% 0 0 0)"
        }
    }, [revealTargetRef])

    useEffect(() => {
        if (!isReady || hasRevealed.current) return;
        hasRevealed.current = true;

        const target = revealTargetRef.current;
        if (!target) return;

        const tl = gsap.timeline({
            onComplete: () => setVisible(false),
        });

        tl.to(percentRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
        });

        tl.to(
            target,
            {
                clipPath: 'inset(0% 0 0 0)',
                duration: 1.3,
                ease: 'power4.inOut',
            },
            '<'
        );

        tl.to(
            sweepRef.current,
            {
                top: '0%',
                duration: 1.3,
                ease: 'power4.inOut',
            },
            '<'
        );
    }, [isReady, revealTargetRef]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                ref={percentRef}
                className="font-mono text-[clamp(2.5rem,8vw,5rem)] text-white tracking-[0.08em]"
            >
                {Math.floor(progress)}%
            </div>
            <div
                ref={sweepRef}
                className="fixed inset-x-0 top-full h-[5vh] overflow-hidden font-mono text-base leading-[5vh] text-[#9fef9f] whitespace-nowrap drop-shadow-[0_0_10px_rgba(159,239,159,0.7)] z-[51]"
            >
                {randomSweepText(300)}
            </div>
        </div>
    )
}