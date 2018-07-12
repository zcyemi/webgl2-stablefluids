precision mediump float;
varying vec2 vUV;
uniform sampler2D uSampler; //2D
uniform sampler2D uSamplerB;//2D

uniform float uAlpha;
uniform float uBeta;

void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0/ texsize.x;
    float voff = 1.0 /texsize.y;

    vec2 x1 = texture2D(uSampler,vUV - vec2(uoff,0)).xy;
    vec2 x2 = texture2D(uSampler,vUV + vec2(uoff,0)).xy;
    vec2 y1 = texture2D(uSampler,vUV - vec2(0,voff)).xy;
    vec2 y2 = texture2D(uSampler,vUV + vec2(0,voff)).xy;

    vec2 b1 = texture2D(uSamplerB,vUV).xy;

    gl_FragColor.xy = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;
}