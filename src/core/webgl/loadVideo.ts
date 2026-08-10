export interface VideoInstance {
    video: HTMLVideoElement
    ready: Promise<HTMLVideoElement>
}

export function loadVideo(src: string, onProgress?: (percent: number) => void): VideoInstance {
    const video = document.createElement("video")

    video.src = src
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true

    const reportProgress = () => {
        if (!onProgress || !video.duration || isNaN(video.duration)) return
        if (video.buffered.length === 0) return

        const bufferedEnd = video.buffered.end(0)
        const percent = Math.min(100, (bufferedEnd / video.duration) * 100)

        onProgress(percent)
    }

    video.addEventListener("progress", reportProgress)
    video.addEventListener("loadedmetadata", reportProgress)

    const ready = new Promise<HTMLVideoElement>((resolve, reject) => {
        video.addEventListener("loadeddata", () => {
            onProgress?.(100)
            resolve(video)
        }, { once: true })
        video.addEventListener("error", () => reject(new Error(`Failed To Load Video: ${src}`)), { once: true })
    })

    video.play().catch((err) => {
        console.warn("Video Autoplay Was Prevented: ", err)
    })

    return { video, ready }
}