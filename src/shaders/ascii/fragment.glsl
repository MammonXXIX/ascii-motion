precision highp float;

#include ../chunks/coverUv;
#include ../chunks/luminance;
#include ../chromakey/greenScreenKey;

uniform sampler2D tMap;
uniform sampler2D tAtlas;
uniform vec2 uResolution;
uniform vec2 uVideoResolution;
uniform float uThreshold;
uniform float uSmoothness;
uniform float uCharCount;
uniform float uZoom;

varying vec2 vUv;
varying vec2 vVideoUv;

void main() {
    vec2 zoomedUv = (vVideoUv - 0.5) / uZoom + 0.5;
    vec2 coveredVideoUv = coverUv(zoomedUv, uResolution, uVideoResolution);
    vec4 videoColor = texture2D(tMap, coveredVideoUv);

    float chromaAlpha = chromaKeyAlpha(videoColor.rgb, uThreshold, uSmoothness);

    float brightness = luminance(videoColor.rgb);
    brightness = pow(brightness, 0.6);
    float charIndex = floor(brightness * uCharCount);
    charIndex = clamp(charIndex, 0.0, uCharCount - 1.0);

    float cellWidth = 1.0 / uCharCount;
    vec2 atlasUv = vec2((charIndex + vUv.x) * cellWidth, vUv.y);
    vec4 glyph = texture2D(tAtlas, atlasUv);

    float finalAlpha = glyph.a * chromaAlpha;

    if (finalAlpha < 0.01) {
        discard;
    }

    gl_FragColor = vec4(videoColor.rgb, finalAlpha);
}