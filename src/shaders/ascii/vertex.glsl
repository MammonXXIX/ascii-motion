attribute vec3 position;
attribute vec2 uv;

attribute vec2 aOffset;
attribute vec2 aUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uCellSize;

varying vec2 vUv;
varying vec2 vVideoUv;
varying vec2 vInstancePos;

void main() {
    vUv = uv;
    vVideoUv = aUv;
    vInstancePos = aOffset;

    vec3 scaledPosition = position * vec3(uCellSize, uCellSize, 1.0);
    vec3 worldPosition = scaledPosition + vec3(aOffset, 0.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
}