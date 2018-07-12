precision highp float;
varying vec2 vUV;
uniform sampler2D uSampler; //1D
uniform sampler2D uSamplerB;//1D

uniform float uAlpha;
uniform float uBeta;

void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0/ texsize.x;
    float voff = 1.0 /texsize.y;

    float x1 = texture2D(uSampler,vUV - vec2(uoff,0)).x;
    float x2 = texture2D(uSampler,vUV + vec2(uoff,0)).x;
    float y1 = texture2D(uSampler,vUV - vec2(0,voff)).x;
    float y2 = texture2D(uSampler,vUV + vec2(0,voff)).x;

    float b1 = texture2D(uSamplerB,vUV).x;

    gl_FragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;
}