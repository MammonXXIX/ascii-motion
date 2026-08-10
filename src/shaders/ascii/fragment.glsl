precision highp float;

#include ../chunks/coverUv;
#include ../chunks/luminance;
#include ../chromakey/greenScreenKey;

uniform sampler2D tMap;
uniform sampler2D tAtlas;
uniform sampler2D tTrail;
uniform vec2 uResolution;
uniform vec2 uVideoResolution;
uniform float uThreshold;
uniform float uSmoothness;
uniform float uCharCount;
uniform float uScrambleCharCount;
uniform float uZoom;

uniform float uScrambleSpeed;
uniform float uFlickerChance;
uniform float uFlickerSpeed;
uniform float uCurrentTime;

varying vec2 vUv;
varying vec2 vVideoUv;
varying vec2 vInstancePos;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 zoomedUv = (vVideoUv - 0.5) / uZoom + 0.5;
    vec2 coveredVideoUv = coverUv(zoomedUv, uResolution, uVideoResolution);
    vec4 videoColor = texture2D(tMap, coveredVideoUv);

    float chromaAlpha = chromaKeyAlpha(videoColor.rgb, uThreshold, uSmoothness);

    vec2 trailUv = vInstancePos / uResolution + 0.5;
    float hoverFactor = texture2D(tTrail, trailUv).r;
    bool isHovered = hoverFactor > 0.1;

    float flickerCycle = floor(uCurrentTime * uFlickerSpeed);
    float flickerSeed = hash(vInstancePos * 3.1 + flickerCycle);
    bool isFlickering = isHovered && flickerSeed < uFlickerChance;

    float charIndex;
    if (isHovered) {
        float phaseOffset = hash(vInstancePos) * float(uScrambleCharCount);
        float cycle = floor(uCurrentTime * uScrambleSpeed + phaseOffset);
        float scrambleIndex = mod(cycle, uScrambleCharCount);

        charIndex = uCharCount + scrambleIndex;
    } else {
        float brightness = luminance(videoColor.rgb);

        brightness = pow(brightness, 0.6);
        charIndex = floor(brightness * uCharCount);
        charIndex = clamp(charIndex, 0.0, uCharCount - 1.0);
    }

    float totalChars = uCharCount + uScrambleCharCount;
    float cellWidth = 1.0 / totalChars;
    vec2 atlasUv = vec2((charIndex + vUv.x) * cellWidth, vUv.y);
    vec4 glyph = texture2D(tAtlas, atlasUv);

    float finalAlpha = glyph.a * chromaAlpha;

    if (finalAlpha < 0.01) {
        discard;
    }

    vec3 finalColor = isFlickering ? vec3(1.0) : videoColor.rgb;

    gl_FragColor = vec4(finalColor, finalAlpha);
}