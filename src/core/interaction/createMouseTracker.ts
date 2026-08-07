export interface MouseTrackerInstance {
    position: { x: number, y: number }
    velocity: number
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

    let previousX = OFFSCREEN
    let previousY = OFFSCREEN
    let lastUpdatedTime = performance.now()

    const position = { x: OFFSCREEN, y: OFFSCREEN }
    let velocity = 0

    const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const clientX = event.clientX - rect.left
        const clientY = event.clientY - rect.top

        targetX = clientX - rect.width / 2
        targetY = -(clientY - rect.height / 2)

        if (!hasMoved) {
            currentX = targetX;
            currentY = targetY;
            previousX = targetX;
            previousY = targetY;
            hasMoved = true;
        }
    }

    container.addEventListener("mousemove", handleMouseMove)

    const update = () => {
        if (!hasMoved) return;

        const now = performance.now()
        const deltaSeconds = (now - lastUpdatedTime) / 1000
        lastUpdatedTime = now

        const smoothing  = 0.15
        currentX += (targetX - currentX) * smoothing
        currentY += (targetY - currentY) * smoothing

        if (deltaSeconds > 0) {
            const dx = currentX - previousX
            const dy = currentY - previousY
            const distance = Math.sqrt(dx * dx + dy * dy)

            velocity = distance / deltaSeconds
        }

        previousX = currentX
        previousY = currentY

        position.x = currentX
        position.y = currentY
    }

    const destroy = () => {
        container.removeEventListener("mousemove", handleMouseMove)
    }

    return { position, velocity, update, destroy }
}