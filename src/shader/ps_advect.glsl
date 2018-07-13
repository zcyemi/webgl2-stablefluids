precision mediump float;
varying vec2 vUV;

uniform sampler2D uSampler;
uniform float uDeltaTime;
void main(){
    vec4 col = texture2D(uSampler,vUV);
    ivec2 texsize = textureSize(uSampler,1);
    vec2 duv = col.xy * vec2((float)texsize.y/texsize.x,1.0) * uDeltaTime; 
    gl_FragColor = texture2D(uSampler,duv);
}