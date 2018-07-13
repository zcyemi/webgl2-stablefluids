import { GLSL_VS_DEFAULT, GLSL_PS_ADVECT, GLSL_PS_FORCE, GLSL_PS_JACOBI1D, GLSL_PS_JACOBI2D, GLSL_PS_PROJSETUP, GLSL_PS_PROJFINISH, GLSL_PS_DEFAULT, GLSL_PS_COLOR } from "./ShaderLibs";


const SIM_SIZE_W:number = 512;
const SIM_SIZE_H:number = 512;

export class StableFluids {

    private gl: WebGL2RenderingContext;

    private m_frameBuffer: WebGLFramebuffer;

    private m_tempTextureR : WebGLTexture;
    private m_tempTextureRG :WebGLTexture;

    private m_bufferVertexQuad: WebGLBuffer;
    private m_bufferIndicesQuad: WebGLBuffer;

    private m_vaoQuad: WebGLVertexArrayObject;

    private m_programAdvect: ShaderProgram;
    private m_programForce: ShaderProgram;
    private m_programProjSetup: ShaderProgram;
    private m_programProjFinish: ShaderProgram;
    private m_programJacobi1D: ShaderProgram;
    private m_programJacobi2D: ShaderProgram;
    private m_programColor:ShaderProgram;
    private m_programDefault:ShaderProgram;

    private m_texImage: WebGLTexture;

    private m_inited:boolean = false;

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
        vdata.push(0, 0);
        vdata.push(0, 1.0);
        vdata.push(1.0, 1.0);
        vdata.push(1.0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vdata), gl.STATIC_DRAW);
        this.m_bufferVertexQuad = vbuffer;

        let ibuffer: WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
        let idata:number[] = [0,1,2,0,2,3];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
        this.m_bufferIndicesQuad = ibuffer;

        //shader programs
        this.m_programColor = ShaderProgram.LoadShader(gl,GLSL_VS_DEFAULT,GLSL_PS_COLOR);
        this.m_programDefault = ShaderProgram.LoadShader(gl,GLSL_VS_DEFAULT,GLSL_PS_DEFAULT);

        this.m_programAdvect = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_ADVECT);
        this.m_programForce = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_FORCE);
        this.m_programJacobi1D = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_JACOBI1D);
        this.m_programJacobi2D = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_JACOBI2D);
        this.m_programProjSetup = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_PROJSETUP);
        this.m_programProjFinish = ShaderProgram.LoadShader(gl, GLSL_VS_DEFAULT, GLSL_PS_PROJFINISH);


        //vao
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.m_bufferVertexQuad);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.m_bufferIndicesQuad);

        gl.enableVertexAttribArray(this.m_programColor.AttrPosition);
        gl.vertexAttribPointer(this.m_programColor.AttrPosition,2,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this.m_programColor.AttrUV);
        gl.vertexAttribPointer(this.m_programColor.AttrUV,2,gl.FLOAT,false,0,0);

        gl.bindVertexArray(null);
        this.m_vaoQuad = vao;

        //image
        this.m_texImage = this.LoadImage('image.png');

        //framebuffer texture

        let textureR = this.CreateTexture(gl.R32F,gl.RED,SIM_SIZE_W,SIM_SIZE_H,gl.FLOAT);
        this.m_tempTextureR = textureR;

        let textureRG =this.CreateTexture(gl.RG32F,gl.RG,SIM_SIZE_W,SIM_SIZE_H,gl.FLOAT);
        this.m_tempTextureRG = textureRG;

        //framebuffer
        let fbuffer :WebGLFramebuffer= gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER,fbuffer);
        //gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,textureRG,0);
        this.m_frameBuffer = fbuffer;

        gl.viewport(0,0,SIM_SIZE_W,SIM_SIZE_H);
        gl.clearColor(0,0,0,1);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);



        this.m_inited = true;
        
    }

    public onFrame(ts: number) {
        if(!this.m_inited) return;

        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindVertexArray(this.m_vaoQuad);
        gl.useProgram(this.m_programColor.Program);
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);

    }

    private CreateTexture(internalFormat:number,format:number,width:number,height:number,type:number):WebGLTexture{
        let gl = this.gl;

        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,tex);

        gl.texImage2D(gl.TEXTURE_2D,0,internalFormat,width,height,0,format,type,null);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

        return tex;
    }

    private LoadImage(src:string):WebGLTexture{
        var img = new Image();
        var gl = this.gl; 
        var tex = gl.createTexture();
        img.onload = ()=>{
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,tex);
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
            gl.generateMipmap(gl.TEXTURE_2D);

            console.log('init webgl texture');
        };
        img.src = src;
        return tex;
    }


}

class ShaderProgram {

    public Program: WebGLProgram;

    public Attributes: { [key: string]: number } = {};
    public Unifroms: { [key: string]: WebGLUniformLocation } = {};

    public AttrPosition:number;
    public AttrUV:number;

    public UnifColor: WebGLUniformLocation;
    public UnifSampler: WebGLUniformLocation;

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

        this.AttrPosition = this.Attributes['aPosition'];
        this.AttrUV = this.Attributes['aUV'];

        this.UnifColor = this.Unifroms['uColor'];
        this.UnifSampler = this.Unifroms['uSampler'];

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

        return new ShaderProgram(gl, program);
    }
}