import { GLSL_VS_DEFAULT, GLSL_PS_ADVECT, GLSL_PS_FORCE, GLSL_PS_JACOBI1D, GLSL_PS_JACOBI2D, GLSL_PS_PROJSETUP, GLSL_PS_PROJFINISH, GLSL_PS_DEFAULT, GLSL_PS_COLOR, GLSL_PS_FLUID, GLSL_VS_DEFAULT_FLIP } from "./ShaderLibs";


/// <reference path='./../../node_modules/wglut/dist/wglut.d.ts'/>
import wglut = require('wglut');

type GLContext = wglut.GLContext;
type GLProgram = wglut.GLProgram;

const SIM_SIZE_W: number = 512;
const SIM_SIZE_H: number = 512;

export class StableFluids {

    private gl: WebGL2RenderingContext;
    private glctx: GLContext;

    private m_frameBuffer: WebGLFramebuffer;

    private m_bufferVertexQuad: WebGLBuffer;
    private m_bufferIndicesQuad: WebGLBuffer;

    private m_vaoQuad: WebGLVertexArrayObject;

    private m_programAdvect: GLProgram;
    private m_programForce: GLProgram;
    private m_programProjSetup: GLProgram;
    private m_programProjFinish: GLProgram;
    private m_programJacobi1D: GLProgram;
    private m_programJacobi2D: GLProgram;
    private m_programColor: GLProgram;

    private m_programDefault: GLProgram;
    private m_programDefaultFlipY: GLProgram;

    private m_programFluid: GLProgram;

    private m_texImage: WebGLTexture;

    private m_inited: boolean = false;
    private m_textureLoaded: boolean = false;
    private m_lastTimestamp: number = 0;

    private m_inputX:number = 0;
    private m_inputY:number = 0;

    private m_inputX_pre:number = 0;
    private m_inputY_pre:number = 0;

    private m_inputOnDrag:boolean = false;

    private m_mouseMoved:boolean = false;
    private m_mouseDown:boolean = false;

    private m_canvasWidth:number;
    private m_canvasHeight:number;



    public constructor(canvas: HTMLCanvasElement) {

        this.glctx = wglut.GLContext.createFromCanvas(canvas);
        if (this.glctx == null) {
            throw new Error("webgl2 not supported!");
        }
        this.gl = this.glctx.gl;


        this.m_canvasWidth = canvas.width;
        this.m_canvasHeight = canvas.height;

        canvas.addEventListener('mousemove', this.EvtOnMouseMove.bind(this), false);
        canvas.addEventListener('mousedown',this.EvtOnMouseDown.bind(this),false);
        canvas.addEventListener('mouseup',this.EvtOnMouseUp.bind(this),false);
        canvas.addEventListener('mouseleave',this.EvtOnMouseLeave.bind(this),false);

        this.InitGL();
    }

    private EvtOnMouseUp(e:MouseEvent){
        this.m_inputOnDrag = false;
        this.m_mouseDown = false;
    }

    private EvtOnMouseLeave(e:MouseEvent){
        this.m_inputOnDrag = false;
        this.m_mouseDown = false;
    }

    private EvtOnMouseDown(e:MouseEvent){
        this.m_mouseDown = true;
        this.m_inputOnDrag = true;
    }

    private EvtOnMouseMove(e: MouseEvent) {

        this.m_inputX_pre = this.m_inputX;
        this.m_inputY_pre = this.m_inputY;

        this.m_inputX = e.offsetX / SIM_SIZE_H;
        this.m_inputY = 1.0 - e.offsetY / SIM_SIZE_H;
        
    }

    private InitGL() {
        let gl = this.gl;
        let glctx = this.glctx;

        //exts
        let avail_exts = gl.getSupportedExtensions();
        let ext = gl.getExtension('EXT_color_buffer_float');
        let extf = gl.getExtension('OES_texture_float_linear');

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
        let idata: number[] = [0, 1, 2, 0, 2, 3];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
        this.m_bufferIndicesQuad = ibuffer;

        //shader programs
        this.m_programColor = glctx.createProgram(GLSL_VS_DEFAULT, GLSL_PS_COLOR);
        this.m_programDefault = glctx.createProgram( GLSL_VS_DEFAULT, GLSL_PS_DEFAULT);
        this.m_programDefaultFlipY =glctx.createProgram(GLSL_VS_DEFAULT_FLIP,GLSL_PS_DEFAULT);


        this.m_programFluid = glctx.createProgram(GLSL_VS_DEFAULT,GLSL_PS_FLUID);
        console.log(this.m_programFluid);

        this.m_programAdvect = glctx.createProgram(GLSL_VS_DEFAULT, GLSL_PS_ADVECT);
        this.m_programForce = glctx.createProgram(GLSL_VS_DEFAULT, GLSL_PS_FORCE);
        this.m_programJacobi1D =glctx.createProgram( GLSL_VS_DEFAULT, GLSL_PS_JACOBI1D);
        this.m_programJacobi2D = glctx.createProgram( GLSL_VS_DEFAULT, GLSL_PS_JACOBI2D);
        this.m_programProjSetup = glctx.createProgram( GLSL_VS_DEFAULT, GLSL_PS_PROJSETUP);
        this.m_programProjFinish = glctx.createProgram(GLSL_VS_DEFAULT, GLSL_PS_PROJFINISH);

        //vao
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_bufferVertexQuad);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_bufferIndicesQuad);

        gl.enableVertexAttribArray(this.m_programColor.Attributes['aPosition']);
        gl.vertexAttribPointer(this.m_programColor.Attributes['aPosition'], 2, gl.FLOAT, false,0, 0);
        gl.enableVertexAttribArray(this.m_programColor.Attributes['aUV']);
        gl.vertexAttribPointer(this.m_programColor.Attributes['aUV'], 2, gl.FLOAT, false,  0,0);

        gl.bindVertexArray(null);
        this.m_vaoQuad = vao;

        //image
        this.m_texImage = glctx.createTextureImage('image.png',()=>this.m_textureLoaded = true);

        //framebuffer
        let fbuffer: WebGLFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbuffer);
        this.m_frameBuffer = fbuffer;

        gl.viewport(0, 0, SIM_SIZE_W, SIM_SIZE_H);
        gl.clearColor(0, 0, 0, 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }

    private m_texV1: WebGLTexture;
    private m_texV2: WebGLTexture;
    private m_texV3: WebGLTexture;
    private m_texP1: WebGLTexture;
    private m_texP2: WebGLTexture;

    private m_colRT1 :WebGLTexture;
    private m_colRT2: WebGLTexture;

    private m_dx: number;
    private m_difAlpha_prec:number;
    private m_viscosity:number = 0.000001;
    private m_force:number = 300;
    private m_exponent:number = 200;


    private InitSimulator() {
        if(!this.m_textureLoaded) return;

        let glctx = this.glctx;

        let gl = this.gl;
        this.m_texV1 = glctx.createTexture(gl.RG32F,SIM_SIZE_W,SIM_SIZE_H,true,false);
        this.m_texV2 = glctx.createTexture(gl.RG32F,SIM_SIZE_W,SIM_SIZE_H,true,false);
        this.m_texV3 = glctx.createTexture(gl.RG32F,SIM_SIZE_W,SIM_SIZE_H,true,false);

        this.m_texP1 = glctx.createTexture(gl.R32F,SIM_SIZE_W,SIM_SIZE_H,true,false);
        this.m_texP2 = glctx.createTexture(gl.R32F,SIM_SIZE_W,SIM_SIZE_H,true,false);
        
        this.m_colRT1 = glctx.createTexture(gl.RGBA8,SIM_SIZE_W,SIM_SIZE_H,true,true);
        this.m_colRT2 = glctx.createTexture(gl.RGBA8,SIM_SIZE_W,SIM_SIZE_H,true,true);

        this.RenderToTexture(this.m_texImage,this.m_colRT1,true);
        this.ResetFrameBuffer();

        this.m_inited = true;

        let dx = 1.0/ SIM_SIZE_H;
        this.m_dx = dx;
        this.m_difAlpha_prec = dx * dx / this.m_viscosity;
    }

    public onFrame(ts: number) {
        if (!this.m_inited){
            this.InitSimulator();
            return;
        }
        if (this.m_lastTimestamp == 0.0) {
            this.m_lastTimestamp = ts;
            return;
        }
        let deltaTime = (ts - this.m_lastTimestamp)/1000.0;
        this.m_lastTimestamp = ts;

        var gl = this.gl;


        let debug_Velocity:boolean = false;
        let debug_enableProj:boolean = true;
        let debug_enableDiffuse:boolean= true;

        //Do simulation

        //Advection
        this.SetRenderTarget(this.m_texV2);
        this.DrawTexture(this.m_texV1,null,null,this.m_programAdvect,(p)=>{
            let wgl = gl;
            let uDeltaTime = p['uDeltaTime'];
            gl.uniform1f(uDeltaTime,deltaTime);
        });

        //Diffuse setup
        let dif_alpha = this.m_difAlpha_prec / deltaTime;  //0.1
        let alpha = dif_alpha;
        let beta = alpha + 4;
        if(debug_enableDiffuse){
            
            //copy v2 to v1
            this.RenderToTexture(this.m_texV2,this.m_texV1);

            //jacobi iteration 2D
            for(let i=0;i<20;i++){
                this.SetRenderTarget(this.m_texV3);
                this.DrawTexture(this.m_texV2,this.m_texV1,null,this.m_programJacobi2D,(p)=>{
                    let wgl = gl;

                    let ualpha = p['uAlpha'];
                    let ubeta = p['uBeta'];
                    wgl.uniform1f(ualpha,alpha);
                    wgl.uniform1f(ubeta,beta);
                })

                this.SetRenderTarget(this.m_texV2);
                this.DrawTexture(this.m_texV3,this.m_texV1,null,this.m_programJacobi2D,(p)=>{
                    let wgl = gl;
                    let ualpha = p['uAlpha'];
                    let ubeta = p['uBeta'];
                    wgl.uniform1f(ualpha,alpha);
                    wgl.uniform1f(ubeta,beta);
                })
            }
        }

        //add external force V2->V3

        let forceX = 0;
        let forceY = 0;

        let force = this.m_force;
        if(this.m_inputOnDrag){
            forceX = force *(this.m_inputX - this.m_inputX_pre);
            forceY = force *(this.m_inputY - this.m_inputY_pre);
        }
        else if(this.m_mouseDown){
            force *=0.1;
            let rvec = this.RandomVecIdentity();
            forceX = force * rvec[0];
            forceY = force * rvec[1];
            this.m_mouseDown = false;
        }

        this.SetRenderTarget(this.m_texV3);
        this.DrawTexture(this.m_texV2,null,null,this.m_programForce,(p)=>{
            let wgl = gl;

            let uForceExponent = p['uForceExponent'];
            let uForceOrigin = p['uForceOrigin'];
            let uForceVector = p['uForceVector'];
            wgl.uniform1f(uForceExponent,this.m_exponent);
            wgl.uniform2f(uForceOrigin,this.m_inputX,this.m_inputY);
            wgl.uniform2f(uForceVector,forceX,forceY);
        });

        this.RenderToTexture(this.m_texV3,this.m_texV1);

        //Proj setup V3->V1

        if(debug_enableProj){
            this.SetRenderTarget(this.m_texV2);

            //V2(divergence of Velocity)
            this.DrawTexture(this.m_texV3,null,null,this.m_programProjSetup,null);

            //set P1 to 0
            this.SetRenderTarget(this.m_texP1);
            this.DrawColor([0,0,0,0]);
    
            //Jacobi 1D
            let dx = this.m_dx;
            var alpha1d  = -dx * dx;
            var beta1d = 4;
            for(var i=0;i<20;i++){
                this.SetRenderTarget(this.m_texP2);
                this.DrawTexture(this.m_texP1,this.m_texV2,null,this.m_programJacobi1D,(p)=>{
                    let wgl = gl;
                    wgl.uniform1f(p['uAlpha'],alpha1d);
                    wgl.uniform1f(p['uBeta'],beta1d);
                });
    
                this.SetRenderTarget(this.m_texP1);
                this.DrawTexture(this.m_texP2,this.m_texV2,null,this.m_programJacobi1D,(p)=>{
                    let wgl = gl;
                    wgl.uniform1f(p['uAlpha'],alpha1d);
                    wgl.uniform1f(p['uBeta'],beta1d);
                });
            }
    
            //ProjFinish
            this.SetRenderTarget(this.m_texV1);
            this.DrawTexture(this.m_texP1,this.m_texV3,null,this.m_programProjFinish,null);
        }
        else{
            this.RenderToTexture(this.m_texV3,this.m_texV1);
        }

        //Use velocity to carry color

        if(debug_Velocity){
            this.ResetFrameBuffer();
            this.DrawTextureDefault(this.m_texV1);
            return;
        }
        else{
            this.SetRenderTarget(this.m_colRT2);
            this.DrawTexture(this.m_colRT1, this.m_texV1, null, this.m_programFluid, (p) => {
                let wgl = gl;
                wgl.uniform1f(p['uDeltaTime'], deltaTime);
                wgl.uniform1f(p['uTime'],ts/1000.0);
                wgl.uniform1f(p['uForceExponent'],this.m_exponent);
                
                if(this.m_inputOnDrag){
                    wgl.uniform2f(p['uForceOrigin'],this.m_inputX,this.m_inputY);
                }
                else{
                    wgl.uniform2f(p['uForceOrigin'],-10.0,-10.0);
                }
            })

            this.ResetFrameBuffer();
            this.DrawTextureDefault(this.m_colRT2);

            //swrap colorbuffer
            let temp = this.m_colRT1;
            this.m_colRT1 = this.m_colRT2;
            this.m_colRT2 = temp;
        }
    }

    private RandomVecIdentity():number[]{

        let t = Math.random()*Math.PI *2;
        let x = Math.sin(t);
        let y = Math.cos(t);

        return [x,y];
    }


    private Clear(){
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    private ResetFrameBuffer(){
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    }

    private SetRenderTarget(texture: WebGLTexture) {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }

    private RenderToTexture(src:WebGLTexture,dest:WebGLTexture,flipY:boolean = false){
        if(src === dest){
            console.error('can not render to the same texture');
            return;
        }

        this.SetRenderTarget(dest);
        this.DrawTextureDefault(src,flipY);
    }

    private DrawTextureDefault(tex0:WebGLTexture,flipY:boolean = false){
        this.DrawTexture(tex0,null,null,flipY? this.m_programDefaultFlipY : this.m_programDefault,null);
    }

    private DrawColor(color:number[]){
        let gl = this.gl;
        gl.bindVertexArray(this.m_vaoQuad);
        gl.useProgram(this.m_programColor.Program);

        let ucolor = this.m_programColor['uColor'];

        gl.uniform4fv(ucolor,color);
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);

    }

    private DrawTexture(tex0:WebGLTexture,tex1?:WebGLTexture,tex2?:WebGLTexture,program?:GLProgram,setUniform?:(p:GLProgram)=>void){
        if(program == null) program = this.m_programDefault;

        let gl = this.gl;
        gl.bindVertexArray(this.m_vaoQuad);
        gl.useProgram(program.Program);

        if(tex0 != null){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,tex0);

            let usampler0 = program['uSampler'];
            gl.uniform1i(usampler0,0);
        }
        if(tex1 != null){
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D,tex1);

            let usampler1 = program['uSampler1'];
            gl.uniform1i(usampler1,1);
        }
        if(tex2 != null){
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D,tex2);
            let usampler2 = program['uSampler2'];
            gl.uniform1i(usampler2,2);
        }

        if(setUniform != null){
            setUniform(program);
        }
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);

    }
}