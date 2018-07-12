precision mediump float;
attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;

void main(){
    gl_Position = vec4(aPosition,0,1);
    vUV = aUV;
}