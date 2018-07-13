#version 300 es
precision highp float;
in vec2 vUV;
uniform vec4 uColor;

out vec4 fragColor;
void main(){
    fragColor = uColor;
}