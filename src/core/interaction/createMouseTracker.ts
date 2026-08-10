export interface MouseTrackerInstance {
    position: { x: number, y: number }
    update: () => void
    destroy: () => void
}

export function createMouseTracker(container: HTMLElement): MouseTrackerInstance {
    const OFFSCREEN = 999999;

    let targetX = OFFSCREEN
    let targetY = OFFSCREEN
    let currentX = OFFSCREEN
    let currentY = OFFSCREEN
    let hasMoved = false

    const position = { x: OFFSCREEN, y: OFFSCREEN }

    const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const clientX = event.clientX - rect.left
        const clientY = event.clientY - rect.top

        targetX = clientX - rect.width / 2
        targetY = -(clientY - rect.height / 2)

        if (!hasMoved) {
            currentX = targetX;
            currentY = targetY;
            hasMoved = true;
        }
    }

    container.addEventListener("mousemove", handleMouseMove)

    const update = () => {
        if (!hasMoved) return;

        const smoothing  = 0.15
        currentX += (targetX - currentX) * smoothing
        currentY += (targetY - currentY) * smoothing

        position.x = currentX
        position.y = currentY
    }

    const destroy = () => {
        container.removeEventListener("mousemove", handleMouseMove)
    }

    return { position, update, destroy }
}