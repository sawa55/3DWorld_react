const CustomShaderMaterial = shaderMaterial(
    // Uniforms
    {
        color: new THREE.Color(0x00ffff),
        time: 0,

        uAnimation: { value: 0 } // アニメーションの進行状況を示すユニフォーム（0から1）
    },
    // Vertex Shader
    `uniform float time;
   uniform float uAnimation;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      // 中心からの距離を計算
      float distance = length(modelPosition.xy);
  
  
     
        modelPosition.z += sin(distance * 10.0 - time * 2.0) * 0.05 *uAnimation;
      
  
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }`,
    // Fragment Shader
    `uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }`
);
extend({ CustomShaderMaterial });

function AnimationEffect(material, targetValue) {
    if (material && material.uniforms && material.uniforms.uAnimation) {
        gsap.to(material.uniforms.uAnimation, {
            value: targetValue,
            duration: 2,
            ease: 'power2',
            repeat: 0,  // 繰り返しを無効化
            yoyo: false  // yoyoを無効化
        });
    } else {
        console.error('AnimationEffect cannot access material uniforms');
    }
}

const shaderRef = useRef();

useFrame(({ clock }) => {

    shaderRef.current.uniforms.time.value = clock.getElapsedTime();


});
useEffect(() => {
    if (localHovered) {
        AnimationEffect(shaderRef.current, 1);
    } else {
        AnimationEffect(shaderRef.current, 0);
    }
}, [localHovered]);

<customShaderMaterial ref={shaderRef} />