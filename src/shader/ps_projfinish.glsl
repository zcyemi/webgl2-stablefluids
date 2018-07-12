precision highp float;
varying vec2 vUV;

uniform sampler2D uSampler; //2D
uniform sampler2D uSamplerP; //1D
uniform sampler2D uSamplerW; //2D

uniform float uDeltaTime;
void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0 / texsize.x;
    float voff = 1.0 / texsize.y;

    float p1 = texture2D(uSamplerP,vUV - vec2(uoff,0)).x;
    float p2 = texture2D(uSamplerP,vUV + vec2(uoff,0)).x;
    float p3 = texture2D(uSamplerP,vUV - vec2(0,voff)).x;
    float p4 = texture2D(uSamplerP,vUV + vec2(0,voff)).x;

    vec2 u = texture2D(uSamplerW,vUV).xy - vec2(p2-p1,p4-p3) /2.0;

    gl_FragColor.xy = u;
}