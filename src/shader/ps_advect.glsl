#version 300 es
precision mediump float;
in vec2 vUV;

uniform sampler2D uSampler;
uniform float uDeltaTime;

out vec2 fragmentColor;
void main(){
    vec4 col = texture(uSampler,vUV);
    ivec2 texsize = textureSize(uSampler,1);
    vec2 duv = col.xy * vec2(texsize.y/texsize.x,1.0) * uDeltaTime; 
    fragmentColor = texture(uSampler,vUV - duv).xy;
}