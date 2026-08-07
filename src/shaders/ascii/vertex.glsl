attribute vec3 position;
attribute vec2 uv;

attribute vec2 aOffset;
attribute vec2 aUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uCellSize;

uniform vec2 uMouse;
uniform float uRepelRadius;
uniform float uRepelStrength;
uniform float uDepthStrength;

varying vec2 vUv;
varying vec2 vVideoUv;

void main() {
    vUv = uv;
    vVideoUv = aUv;

    vec2 toInstance = aOffset - uMouse;
    float dist = length(toInstance);

    float fallOff = smoothstep(uRepelRadius, 0.0, dist);

    vec2 direction = dist > 0.0001 ? toInstance / dist : vec2(0.0);

    vec2 repelOffset = direction * fallOff * uRepelStrength;
    float depthOffset = fallOff * uDepthStrength;

    vec3 scaledPosition = position * vec3(uCellSize, uCellSize, 1.0);
    vec3 gridPosition = scaledPosition + vec3(aOffset, 0.0);
    vec3 worldPosition = gridPosition + vec3(repelOffset, depthOffset);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
}