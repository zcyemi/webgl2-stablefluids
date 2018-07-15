#version 300 es
precision highp float;
in vec2 vUV;

uniform sampler2D uSampler; //W_in 2D
uniform float uDeltaTime;

//map to [0,1.0]
uniform vec2 uForceOrigin;
uniform vec2 uForceVector;
uniform float uForceExponent;

out vec2 fragColor; //W_out 2D
void main(){
    vec4 col = texture(uSampler,vUV);
    ivec2 texsize = textureSize(uSampler,0);

    vec2 pos = vUV;
    float amp = exp(-uForceExponent * distance(uForceOrigin,pos));
    fragColor = col.xy + uForceVector * amp;
}