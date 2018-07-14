#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uSampler; //Color Texture RGB
uniform sampler2D uSampler1; //Velocity texture RG32F

uniform float uDeltaTime;


out vec3 fragColor;
void main(){
    //color advection
    vec2 delta = texture(uSampler1,vUV).xy  * uDeltaTime;
    vec3 color =texture(uSampler,vUV - delta).xyz;
    fragColor = color;
}