precision highp float;

uniform sampler2D tScene;
uniform float uChromaticAberration;
uniform float uNoiseAmount;
uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 center = vec2(0.5);
    vec2 direction = vUv - center;
    float distanceFromCenter = length(direction);

    vec2 offset = normalize(direction) * distanceFromCenter * uChromaticAberration;

    float r = texture2D(tScene, vUv - offset).r;
    float g = texture2D(tScene, vUv).g;
    float b = texture2D(tScene, vUv + offset).b;
    float a = texture2D(tScene, vUv).a;

    vec3 color = vec3(r, g, b);

    float grain = hash(vUv * 500.0 + uTime) - 0.5;
    color += grain * uNoiseAmount;

    gl_FragColor = vec4(color, a);
}