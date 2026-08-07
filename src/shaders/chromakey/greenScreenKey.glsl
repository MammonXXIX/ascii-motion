float greenDominance(vec3 color) {
    return color.g - max(color.r, color.b);
}

float chromaKeyAlpha(vec3 color, float threshold, float smoothness) {
    float dominance = greenDominance(color);
    float keyAmount = smoothstep(threshold - smoothness, threshold + smoothness, dominance);

    return 1.0 - keyAmount;
}
