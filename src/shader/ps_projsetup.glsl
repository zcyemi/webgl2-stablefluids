precision highp float;
varying vec2 vUV;

uniform sampler2D uSampler;
uniform float uDeltaTime;
void main(){
    ivec2 texsize = textureSize(uSampler,0);

    vec2 off = vec2(1.0/texsize.x,1.0/texsize.y);
    float x1 = texture2D(uSampler,vUV + vec2(off.x,0)).x;
    float x2 = texture2D(uSampler,vUV - vec2(off.x,0).x);

    float y1 = texture2D(uSampler,vUV+ vec2(0,off.y)).y;
    float y2 = texture2D(uSampler,vUV - vec2(0,off.y)).y;

    vec4 col = 0;
    col.x = (x1 - x2 + y1 - y2) / 2.0;
    gl_FragColor = col;
}