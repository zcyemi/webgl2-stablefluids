#version 300 es
precision mediump float;
in vec2 vUV;

uniform sampler2D uSampler; //1D P_in
uniform sampler2D uSampler1; //2D W_in

out vec2 fragColor;
void main(){
    ivec2 texsize = textureSize(uSampler,0);
    float uoff = 1.0 / float(texsize.x);
    float voff = 1.0 / float(texsize.y);

    float p1 = texture(uSampler,vUV - vec2(uoff,0)).x;
    float p2 = texture(uSampler,vUV + vec2(uoff,0)).x;
    float p3 = texture(uSampler,vUV - vec2(0,voff)).x;
    float p4 = texture(uSampler,vUV + vec2(0,voff)).x;

    vec2 u = texture(uSampler1,vUV).xy - vec2(p2-p1,p4-p3) /(2.0 * voff);

    fragColor = u;
}