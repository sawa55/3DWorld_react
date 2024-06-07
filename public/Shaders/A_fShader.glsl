uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 u_mouse;
uniform vec2 u_prevMouse;
uniform float u_opacity;

varying vec2 vUv;

void main() {
    vec2 mouseDirection = u_mouse - u_prevMouse;
    vec2 pixelToMouseDirection = vUv - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
    vec2 uvOffset = strength * -mouseDirection * 0.2;
    vec2 mouseUV = vUv - uvOffset;

    vec2 newUV = (vUv - vec2(0.5)) * uResolution + vec2(0.5);

    vec4 img1 = texture2D(uTexture, mouseUV);


    vec4 mouseTexture = texture2D(uTexture, mouseUV);

    vec4 finalColor = mix(img1, mouseTexture, strength);
    // gl_FragColor = vec4(finalColor.rgb, u_opacity);
    gl_FragColor = mouseTexture;
    // gl_FragColor = mouseTexture;
}
