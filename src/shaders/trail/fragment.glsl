precision highp float;

uniform sampler2D tPrevTrail;
uniform vec2 uMouseUv;
uniform float uDecay;
uniform float uDeltaTime;
uniform float uPaintRadius;
uniform float uPaintSoftness;
uniform bool uMouseActive;

varying vec2 vUv;

void main() {
    float previous = texture2D(tPrevTrail, vUv).r;

    float decayed = previous * pow(uDecay, uDeltaTime);

    float paint = 0.0;
    if (uMouseActive) {
        float dist = distance(vUv, uMouseUv);
        paint = 1.0 - smoothstep(uPaintRadius - uPaintSoftness, uPaintRadius, dist);
    }

    float result = max(decayed, paint);

    gl_FragColor = vec4(result, 0.0, 0.0, 1.0);
}