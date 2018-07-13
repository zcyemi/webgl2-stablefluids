#version 300 es
precision mediump float;
in vec2 vUV;

uniform sampler2D uSampler; //2D
uniform sampler2D uSampler1;//2D

uniform float uAlpha;
uniform float uBeta;

out vec2 fragColor;

void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0/ float(texsize.x);
    float voff = 1.0 / float(texsize.y);

    vec2 x1 = texture(uSampler,vUV - vec2(uoff,0)).xy;
    vec2 x2 = texture(uSampler,vUV + vec2(uoff,0)).xy;
    vec2 y1 = texture(uSampler,vUV - vec2(0,voff)).xy;
    vec2 y2 = texture(uSampler,vUV + vec2(0,voff)).xy;

    vec2 b1 = texture(uSampler1,vUV).xy;

    fragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;
}