import { ASCII_CONFIG } from "../../config/constants"

export interface CharacterAtlas {
    canvas: HTMLCanvasElement
    charCount: number
}

export function generateCharacterAtlas(): CharacterAtlas {
    const { charset, atlasCharSize, fontFamily } = ASCII_CONFIG
    const charCount = charset.length

    const canvas = document.createElement("canvas")
    canvas.width = atlasCharSize * charCount
    canvas.height = atlasCharSize

    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Failed To Get 2D Context")
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.font = `${atlasCharSize * 1.5}px ${fontFamily}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let i = 0; i < charCount; i++) {
        const char = charset[i]
        const cellCenterX = i * atlasCharSize + atlasCharSize / 2
        const cellCenterY = atlasCharSize / 2

        ctx.fillText(char, cellCenterX, cellCenterY)
    }

    return { canvas, charCount }
}
