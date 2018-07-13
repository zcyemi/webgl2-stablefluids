#version 300 es
precision mediump float;
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aUV;

out vec2 vUV;

void main(){
    gl_Position = vec4(aPosition *2.0-1.0,0,1);
    vUV = aUV;
}