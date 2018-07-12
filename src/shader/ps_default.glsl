precision highp float;
varying vec2 vUV;

uniform sampler2D uSampler;
void main(){
    vec4 col = texture2D(uSampler,vUV);
    gl_FragColor = col;
}