#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uSampler; //1D X1
uniform sampler2D uSampler1;//1D B1

uniform float uAlpha;
uniform float uBeta;

out float fragColor;

void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0 / float(texsize.x);
    float voff = 1.0 / float(texsize.y);

    float x1 = texture(uSampler,vUV - vec2(uoff,0)).x;
    float x2 = texture(uSampler,vUV + vec2(uoff,0)).x;
    float y1 = texture(uSampler,vUV - vec2(0,voff)).x;
    float y2 = texture(uSampler,vUV + vec2(0,voff)).x;

    float b1 = texture(uSampler1,vUV).x;

    fragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;
}