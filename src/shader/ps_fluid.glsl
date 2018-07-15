#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uSampler; //Color Texture RGB
uniform sampler2D uSampler1; //Velocity texture RG32F

uniform float uDeltaTime;

uniform float uForceExponent;
uniform vec2 uForceOrigin;
uniform float uTime;


out vec4 fragColor;
void main(){
    //color advection
    vec2 delta = texture(uSampler1,vUV).xy  * uDeltaTime;
    vec3 color =texture(uSampler,vUV - delta).xyz;

    //color added
    // vec3 dye = clamp(sin(uTime * vec3(2.72, 5.12, 4.98))+0.5,0.0,1.0);
    // float amp = exp(-uForceExponent * distance(uForceOrigin, vUV));
    // color = mix(color, dye,  clamp(amp * 100.0,0.0,1.0));

    fragColor = vec4(color,1.0);
}