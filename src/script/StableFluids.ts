import { GLSL_VS_DEFAULT, GLSL_PS_ADVECT } from "./ShaderLibs";

export class StableFluids {

    private gl: WebGL2RenderingContext;

    private m_frameBuffer: WebGLFramebuffer;

    private m_bufferVertexQuad: WebGLBuffer;
    private m_bufferIndicesQuad: WebGLBuffer;
    
    private m_programAdvect: ShaderProgram;
    private m_programForce: ShaderProgram;
    private m_programProjSetup:ShaderProgram;
    private m_programProjFinish:ShaderProgram;
    private m_programJacobi1D:ShaderProgram;
    private m_programJacobi2D:ShaderProgram;

    public constructor(canvas: HTMLCanvasElement) {

        this.gl = canvas.getContext('webgl2');
        if (this.gl == null) {
            throw new Error("webgl2 not supported!");
            return;
        }

        this.InitGL();

    }

    private InitGL() {
        let gl = this.gl;
        
        //buffers
        let vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
        var vdata: number[] = [];
        vdata.push(0, 0, 0, 0);
        vdata.push(0, 1, 0, 1);
        vdata.push(1, 1, 1, 1);
        vdata.push(1, 0, 1, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vdata), gl.STATIC_DRAW);

        let ibuffer: WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ibuffer);
        var idata: number[] = [0, 1, 2, 0, 2, 3];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);

        //shader programs
        this.m_programAdvect = ShaderProgram.LoadShader(gl,GLSL_VS_DEFAULT,GLSL_PS_ADVECT);
    }

    public onFrame(ts: number) {

    }

}

class ShaderProgram {

    public Program: WebGLProgram;

    public Attributes: { [key: string]: number } = {};
    public Unifroms: { [key: string]: WebGLUniformLocation } = {};

    private constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.Program = program;

        const numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttrs; i++) {
            const attrInfo = gl.getActiveAttrib(program, i);
            if (attrInfo == null) continue;
            const attrLoca = gl.getAttribLocation(program, attrInfo.name);
            this.Attributes[attrInfo.name] = attrLoca;
        }

        const numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniform; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo == null) continue;
            const uniformLoca = gl.getUniformLocation(program, uniformInfo.name);
            this.Unifroms[uniformInfo.name] = uniformLoca;
        }

    }


    public static LoadShader(gl: WebGL2RenderingContext, vsource: string, psource: string) {

        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsource);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        let ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, psource);
        gl.compileShader(ps);

        if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
            gl.deleteShader(ps);
            return null;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, ps);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('link shader program failed!:' + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(ps);
            return null;
        }

        return new ShaderProgram(gl,program);
    }
}