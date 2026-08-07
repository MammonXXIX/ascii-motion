vec2 coverUv(vec2 uv, vec2 resolution, vec2 sourceResolution) {
    float resolutionAspect = resolution.x / resolution.y;
    float sourceAspect = sourceResolution.x / sourceResolution.y;

    vec2 scale = resolutionAspect > sourceAspect
        ? vec2(1.0, sourceAspect / resolutionAspect)
        : vec2(resolutionAspect / sourceAspect, 1.0);

    vec2 offset = (1.0 - scale) * 0.5;

    return uv * scale + offset;
}