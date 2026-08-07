export interface VideoInstance {
    video: HTMLVideoElement
    ready: Promise<HTMLVideoElement>
}

export function loadVideo(src: string): VideoInstance {
    const video = document.createElement("video")

    video.src = src
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true

    const ready = new Promise<HTMLVideoElement>((resolve, reject) => {
        video.addEventListener("loadeddata", () => resolve(video), { once: true })
        video.addEventListener("error", () => reject(new Error(`Failed To Load Video: ${src}`)), { once: true })
    })

    video.play().catch((err) => {
        console.warn("Video Autoplay Was Prevented: ", err)
    })

    return { video, ready }
}