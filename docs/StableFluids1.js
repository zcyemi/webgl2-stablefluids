define("ShaderLibs", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_PS_ADVECT = '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\nuniform float uDeltaTime;\n\nout vec2 fragmentColor;\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nivec2 texsize = textureSize(uSampler,1);\nvec2 duv = col.xy * vec2(texsize.y/texsize.x,1.0) * uDeltaTime;\nfragmentColor = texture(uSampler,vUV - duv).xy;\n}';
    exports.GLSL_PS_DEFAULT = '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';
    exports.GLSL_PS_FORCE = '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //W_in 2D\nuniform float uDeltaTime;\n\n//map to [0,1.0]\nuniform vec2 uForceOrigin;\nuniform vec2 uForceVector;\nuniform float uForceExponent;\n\nout vec2 fragColor; //W_out 2D\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nivec2 texsize = textureSize(uSampler,0);\n\nvec2 pos = vUV;\nfloat amp = exp(-uForceExponent * distance(uForceOrigin,pos));\nfragColor = col.xy + uForceVector * amp;\n}';
    exports.GLSL_PS_JACOBI1D = '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform sampler2D uSampler; //1D X1\nuniform sampler2D uSampler1;//1D B1\n\nuniform float uAlpha;\nuniform float uBeta;\n\nout float fragColor;\n\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0 / float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nfloat x1 = texture(uSampler,vUV - vec2(uoff,0)).x;\nfloat x2 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat y1 = texture(uSampler,vUV - vec2(0,voff)).x;\nfloat y2 = texture(uSampler,vUV + vec2(0,voff)).x;\n\nfloat b1 = texture(uSampler1,vUV).x;\n\nfragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;\n}';
    exports.GLSL_PS_JACOBI2D = '#version 300 es\nprecision mediump float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //2D X2\nuniform sampler2D uSampler1;//2D B2\n\nuniform float uAlpha;\nuniform float uBeta;\n\nout vec2 fragColor;\n\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0/ float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nvec2 x1 = texture(uSampler,vUV - vec2(uoff,0)).xy;\nvec2 x2 = texture(uSampler,vUV + vec2(uoff,0)).xy;\nvec2 y1 = texture(uSampler,vUV - vec2(0,voff)).xy;\nvec2 y2 = texture(uSampler,vUV + vec2(0,voff)).xy;\n\nvec2 b1 = texture(uSampler1,vUV).xy;\n\nfragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;\n}';
    exports.GLSL_PS_PROJFINISH = '#version 300 es\nprecision mediump float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //1D P_in\nuniform sampler2D uSampler1; //2D W_in\n\nout vec2 fragColor;\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0 / float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nfloat p1 = texture(uSampler,vUV - vec2(uoff,0)).x;\nfloat p2 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat p3 = texture(uSampler,vUV - vec2(0,voff)).x;\nfloat p4 = texture(uSampler,vUV + vec2(0,voff)).x;\n\nvec2 u = texture(uSampler1,vUV).xy - vec2(p2-p1,p4-p3) /(2.0 * voff);\n\nfragColor = u;\n}';
    exports.GLSL_PS_PROJSETUP = '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //W_in 2D\n\nout vec2 fragColor;    //DivW_out 1D\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0/ float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\n\nfloat x1 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat x2 = texture(uSampler,vUV - vec2(uoff,0)).x;\n\nfloat y1 = texture(uSampler,vUV + vec2(0,voff)).y;\nfloat y2 = texture(uSampler,vUV - vec2(0,voff)).y;\n\nfloat v =  (x1 - x2 + y1 - y2) / (2.0 * uoff);\nfragColor = vec2(v,v);\n}';
    exports.GLSL_VS_DEFAULT = '#version 300 es\nprecision mediump float;\nlayout(location = 0) in vec2 aPosition;\nlayout(location = 1) in vec2 aUV;\n\nout vec2 vUV;\n\nvoid main(){\ngl_Position = vec4(aPosition *2.0-1.0,0,1);\n\nvUV = aUV;\n}';
    exports.GLSL_PS_COLOR = '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform vec4 uColor;\n\nout vec4 fragColor;\nvoid main(){\nfragColor = uColor;\n}';
    exports.GLSL_PS_FLUID = '#version 300 es\nprecision mediump float;\nin vec2 vUV;\nuniform sampler2D uSampler; //Color Texture RGB\nuniform sampler2D uSampler1; //Velocity texture RG32F\n\nuniform float uDeltaTime;\n\nuniform float uForceExponent;\nuniform vec2 uForceOrigin;\nuniform float uTime;\n\n\nout vec4 fragColor;\nvoid main(){\n//color advection\nvec2 delta = texture(uSampler1,vUV).xy  * uDeltaTime;\nvec3 color =texture(uSampler,vUV - delta).xyz;\n\n//color added\n// vec3 dye = clamp(sin(uTime * vec3(2.72, 5.12, 4.98))+0.5,0.0,1.0);\n// float amp = exp(-uForceExponent * distance(uForceOrigin, vUV));\n// color = mix(color, dye,  clamp(amp * 100.0,0.0,1.0));\n\nfragColor = vec4(color,1.0);\n}';
    exports.GLSL_VS_DEFAULT_FLIP = '#version 300 es\nprecision mediump float;\nlayout(location = 0) in vec2 aPosition;\nlayout(location = 1) in vec2 aUV;\n\nout vec2 vUV;\n\nvoid main(){\ngl_Position = vec4(aPosition *2.0-1.0,0,1);\n\nvUV = aUV;\nvUV.y = 1.0 - vUV.y;\n}';
});
define("StableFluids", ["require", "exports", "ShaderLibs"], function (require, exports, ShaderLibs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SIM_SIZE_W = 512;
    var SIM_SIZE_H = 512;
    var StableFluids = /** @class */ (function () {
        function StableFluids(canvas) {
            this.m_inited = false;
            this.m_textureLoaded = false;
            this.m_lastTimestamp = 0;
            this.m_inputX = 0;
            this.m_inputY = 0;
            this.m_inputX_pre = 0;
            this.m_inputY_pre = 0;
            this.m_inputOnDrag = false;
            this.m_mouseMoved = false;
            this.m_mouseDown = false;
            this.m_viscosity = 0.000001;
            this.m_force = 300;
            this.m_exponent = 200;
            this.gl = canvas.getContext('webgl2');
            if (this.gl == null) {
                throw new Error("webgl2 not supported!");
                return;
            }
            this.m_canvasWidth = canvas.width;
            this.m_canvasHeight = canvas.height;
            canvas.addEventListener('mousemove', this.EvtOnMouseMove.bind(this), false);
            canvas.addEventListener('mousedown', this.EvtOnMouseDown.bind(this), false);
            canvas.addEventListener('mouseup', this.EvtOnMouseUp.bind(this), false);
            canvas.addEventListener('mouseleave', this.EvtOnMouseLeave.bind(this), false);
            this.InitGL();
        }
        StableFluids.prototype.EvtOnMouseUp = function (e) {
            this.m_inputOnDrag = false;
            this.m_mouseDown = false;
        };
        StableFluids.prototype.EvtOnMouseLeave = function (e) {
            this.m_inputOnDrag = false;
            this.m_mouseDown = false;
        };
        StableFluids.prototype.EvtOnMouseDown = function (e) {
            this.m_mouseDown = true;
            this.m_inputOnDrag = true;
        };
        StableFluids.prototype.EvtOnMouseMove = function (e) {
            this.m_inputX_pre = this.m_inputX;
            this.m_inputY_pre = this.m_inputY;
            this.m_inputX = e.offsetX / SIM_SIZE_H;
            this.m_inputY = 1.0 - e.offsetY / SIM_SIZE_H;
        };
        StableFluids.prototype.InitGL = function () {
            var _this = this;
            var gl = this.gl;
            //exts
            var avail_exts = gl.getSupportedExtensions();
            var ext = gl.getExtension('EXT_color_buffer_float');
            var extf = gl.getExtension('OES_texture_float_linear');
            //buffers
            var vbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            var vdata = [];
            vdata.push(0, 0);
            vdata.push(0, 1.0);
            vdata.push(1.0, 1.0);
            vdata.push(1.0, 0);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vdata), gl.STATIC_DRAW);
            this.m_bufferVertexQuad = vbuffer;
            var ibuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
            var idata = [0, 1, 2, 0, 2, 3];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
            this.m_bufferIndicesQuad = ibuffer;
            //shader programs
            this.m_programColor = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_COLOR);
            this.m_programDefault = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_DEFAULT);
            this.m_programDefaultFlipY = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT_FLIP, ShaderLibs_1.GLSL_PS_DEFAULT);
            this.m_programFluid = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_FLUID);
            this.m_programAdvect = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_ADVECT);
            this.m_programForce = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_FORCE);
            this.m_programJacobi1D = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_JACOBI1D);
            this.m_programJacobi2D = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_JACOBI2D);
            this.m_programProjSetup = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_PROJSETUP);
            this.m_programProjFinish = ShaderProgram.LoadShader(gl, ShaderLibs_1.GLSL_VS_DEFAULT, ShaderLibs_1.GLSL_PS_PROJFINISH);
            //vao
            var vao = gl.createVertexArray();
            gl.bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_bufferVertexQuad);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_bufferIndicesQuad);
            gl.enableVertexAttribArray(this.m_programColor.AttrPosition);
            gl.vertexAttribPointer(this.m_programColor.AttrPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.m_programColor.AttrUV);
            gl.vertexAttribPointer(this.m_programColor.AttrUV, 2, gl.FLOAT, false, 0, 0);
            gl.bindVertexArray(null);
            this.m_vaoQuad = vao;
            //image
            this.m_texImage = this.LoadImage('image.png', function () { return _this.m_textureLoaded = true; });
            //framebuffer
            var fbuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbuffer);
            this.m_frameBuffer = fbuffer;
            gl.viewport(0, 0, SIM_SIZE_W, SIM_SIZE_H);
            gl.clearColor(0, 0, 0, 1);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        };
        StableFluids.prototype.InitSimulator = function () {
            if (!this.m_textureLoaded)
                return;
            var gl = this.gl;
            this.m_texV1 = this.CreateTexture(gl.RG32F, SIM_SIZE_W, SIM_SIZE_H, true, false);
            this.m_texV2 = this.CreateTexture(gl.RG32F, SIM_SIZE_W, SIM_SIZE_H, true, false);
            this.m_texV3 = this.CreateTexture(gl.RG32F, SIM_SIZE_W, SIM_SIZE_H, true, false);
            this.m_texP1 = this.CreateTexture(gl.R32F, SIM_SIZE_W, SIM_SIZE_H, true, false);
            this.m_texP2 = this.CreateTexture(gl.R32F, SIM_SIZE_W, SIM_SIZE_H, true, false);
            this.m_colRT1 = this.CreateTexture(gl.RGBA8, SIM_SIZE_W, SIM_SIZE_H, true, true);
            this.m_colRT2 = this.CreateTexture(gl.RGBA8, SIM_SIZE_W, SIM_SIZE_H, true, true);
            this.RenderToTexture(this.m_texImage, this.m_colRT1, true);
            this.ResetFrameBuffer();
            this.m_inited = true;
            var dx = 1.0 / SIM_SIZE_H;
            this.m_dx = dx;
            this.m_difAlpha_prec = dx * dx / this.m_viscosity;
        };
        StableFluids.prototype.onFrame = function (ts) {
            var _this = this;
            if (!this.m_inited) {
                this.InitSimulator();
                return;
            }
            if (this.m_lastTimestamp == 0.0) {
                this.m_lastTimestamp = ts;
                return;
            }
            var deltaTime = (ts - this.m_lastTimestamp) / 1000.0;
            this.m_lastTimestamp = ts;
            var gl = this.gl;
            var debug_Velocity = false;
            var debug_enableProj = true;
            var debug_enableDiffuse = true;
            //Do simulation
            //Advection
            this.SetRenderTarget(this.m_texV2);
            this.DrawTexture(this.m_texV1, null, null, this.m_programAdvect, function (p) {
                var wgl = gl;
                gl.uniform1f(p.UnifDeltaTime, deltaTime);
            });
            //Diffuse setup
            var dif_alpha = this.m_difAlpha_prec / deltaTime; //0.1
            var alpha = dif_alpha;
            var beta = alpha + 4;
            if (debug_enableDiffuse) {
                //copy v2 to v1
                this.RenderToTexture(this.m_texV2, this.m_texV1);
                //jacobi iteration 2D
                for (var i_1 = 0; i_1 < 20; i_1++) {
                    this.SetRenderTarget(this.m_texV3);
                    this.DrawTexture(this.m_texV2, this.m_texV1, null, this.m_programJacobi2D, function (p) {
                        var wgl = gl;
                        wgl.uniform1f(p.UnifAlpha, alpha);
                        wgl.uniform1f(p.UnifBeta, beta);
                    });
                    this.SetRenderTarget(this.m_texV2);
                    this.DrawTexture(this.m_texV3, this.m_texV1, null, this.m_programJacobi2D, function (p) {
                        var wgl = gl;
                        wgl.uniform1f(p.UnifAlpha, alpha);
                        wgl.uniform1f(p.UnifBeta, beta);
                    });
                }
            }
            //add external force V2->V3
            var forceX = 0;
            var forceY = 0;
            var force = this.m_force;
            if (this.m_inputOnDrag) {
                forceX = force * (this.m_inputX - this.m_inputX_pre);
                forceY = force * (this.m_inputY - this.m_inputY_pre);
            }
            else if (this.m_mouseDown) {
                force *= 0.1;
                var rvec = this.RandomVecIdentity();
                forceX = force * rvec[0];
                forceY = force * rvec[1];
                this.m_mouseDown = false;
            }
            this.SetRenderTarget(this.m_texV3);
            this.DrawTexture(this.m_texV2, null, null, this.m_programForce, function (p) {
                var wgl = gl;
                wgl.uniform1f(p.UnifForceExponent, _this.m_exponent);
                wgl.uniform2f(p.UnifForceOrigin, _this.m_inputX, _this.m_inputY);
                wgl.uniform2f(p.UnifForceVector, forceX, forceY);
            });
            this.RenderToTexture(this.m_texV3, this.m_texV1);
            //Proj setup V3->V1
            if (debug_enableProj) {
                this.SetRenderTarget(this.m_texV2);
                //V2(divergence of Velocity)
                this.DrawTexture(this.m_texV3, null, null, this.m_programProjSetup, null);
                // this.ResetFrameBuffer();
                // this.DrawTextureDefault(this.m_texV2);
                // return;
                //set P1 to 0
                this.SetRenderTarget(this.m_texP1);
                this.DrawColor([0, 0, 0, 0]);
                //Jacobi 1D
                var dx = this.m_dx;
                var alpha1d = -dx * dx;
                var beta1d = 4;
                for (var i = 0; i < 20; i++) {
                    this.SetRenderTarget(this.m_texP2);
                    this.DrawTexture(this.m_texP1, this.m_texV2, null, this.m_programJacobi1D, function (p) {
                        var wgl = gl;
                        wgl.uniform1f(p.UnifAlpha, alpha1d);
                        wgl.uniform1f(p.UnifBeta, beta1d);
                    });
                    this.SetRenderTarget(this.m_texP1);
                    this.DrawTexture(this.m_texP2, this.m_texV2, null, this.m_programJacobi1D, function (p) {
                        var wgl = gl;
                        wgl.uniform1f(p.UnifAlpha, alpha1d);
                        wgl.uniform1f(p.UnifBeta, beta1d);
                    });
                }
                //ProjFinish
                this.SetRenderTarget(this.m_texV1);
                this.DrawTexture(this.m_texP1, this.m_texV3, null, this.m_programProjFinish, null);
            }
            else {
                this.RenderToTexture(this.m_texV3, this.m_texV1);
            }
            //Use velocity to carry color
            if (debug_Velocity) {
                this.ResetFrameBuffer();
                this.DrawTextureDefault(this.m_texV1);
                return;
            }
            else {
                this.SetRenderTarget(this.m_colRT2);
                this.DrawTexture(this.m_colRT1, this.m_texV1, null, this.m_programFluid, function (p) {
                    var wgl = gl;
                    wgl.uniform1f(p.UnifDeltaTime, deltaTime);
                    wgl.uniform1f(p.UnifTime, ts / 1000.0);
                    wgl.uniform1f(p.UnifForceExponent, _this.m_exponent);
                    if (_this.m_inputOnDrag) {
                        wgl.uniform2f(p.UnifForceOrigin, _this.m_inputX, _this.m_inputY);
                    }
                    else {
                        wgl.uniform2f(p.UnifForceOrigin, -10.0, -10.0);
                    }
                });
                this.ResetFrameBuffer();
                this.DrawTextureDefault(this.m_colRT2);
                //swrap colorbuffer
                var temp = this.m_colRT1;
                this.m_colRT1 = this.m_colRT2;
                this.m_colRT2 = temp;
            }
        };
        StableFluids.prototype.RandomVecIdentity = function () {
            var t = Math.random() * Math.PI * 2;
            var x = Math.sin(t);
            var y = Math.cos(t);
            return [x, y];
        };
        StableFluids.prototype.Clear = function () {
            var gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT);
        };
        StableFluids.prototype.ResetFrameBuffer = function () {
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        };
        StableFluids.prototype.SetRenderTarget = function (texture) {
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        };
        StableFluids.prototype.RenderToTexture = function (src, dest, flipY) {
            if (flipY === void 0) { flipY = false; }
            if (src === dest) {
                console.error('can not render to the same texture');
                return;
            }
            this.SetRenderTarget(dest);
            this.DrawTextureDefault(src, flipY);
        };
        StableFluids.prototype.DrawTextureDefault = function (tex0, flipY) {
            if (flipY === void 0) { flipY = false; }
            this.DrawTexture(tex0, null, null, flipY ? this.m_programDefaultFlipY : this.m_programDefault, null);
        };
        StableFluids.prototype.DrawColor = function (color) {
            var gl = this.gl;
            gl.bindVertexArray(this.m_vaoQuad);
            gl.useProgram(this.m_programColor.Program);
            gl.uniform4fv(this.m_programColor.UnifColor, color);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
        StableFluids.prototype.DrawTexture = function (tex0, tex1, tex2, program, setUniform) {
            if (program == null)
                program = this.m_programDefault;
            var gl = this.gl;
            gl.bindVertexArray(this.m_vaoQuad);
            gl.useProgram(program.Program);
            if (tex0 != null) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, tex0);
                gl.uniform1i(program.UnifSampler0, 0);
            }
            if (tex1 != null) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, tex1);
                gl.uniform1i(program.UnifSampler1, 1);
            }
            if (tex2 != null) {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, tex2);
                gl.uniform1i(program.UnifSampler2, 2);
            }
            if (setUniform != null) {
                setUniform(program);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
        StableFluids.prototype.CreateTexture = function (internalFormat, width, height, linear, mipmap) {
            if (linear === void 0) { linear = false; }
            if (mipmap === void 0) { mipmap = false; }
            var gl = this.gl;
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? (mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR) : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (mipmap)
                gl.generateMipmap(gl.TEXTURE_2D);
            return tex;
        };
        StableFluids.prototype.LoadImage = function (src, callback) {
            var img = new Image();
            var gl = this.gl;
            var tex = gl.createTexture();
            img.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                console.log('init webgl texture');
                if (callback != null)
                    callback();
            };
            img.src = src;
            return tex;
        };
        return StableFluids;
    }());
    exports.StableFluids = StableFluids;
    var ShaderProgram = /** @class */ (function () {
        function ShaderProgram(gl, program) {
            this.Attributes = {};
            this.Unifroms = {};
            this.Program = program;
            var numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < numAttrs; i++) {
                var attrInfo = gl.getActiveAttrib(program, i);
                if (attrInfo == null)
                    continue;
                var attrLoca = gl.getAttribLocation(program, attrInfo.name);
                this.Attributes[attrInfo.name] = attrLoca;
            }
            var numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < numUniform; i++) {
                var uniformInfo = gl.getActiveUniform(program, i);
                if (uniformInfo == null)
                    continue;
                var uniformLoca = gl.getUniformLocation(program, uniformInfo.name);
                this.Unifroms[uniformInfo.name] = uniformLoca;
            }
            this.AttrPosition = this.Attributes['aPosition'];
            this.AttrUV = this.Attributes['aUV'];
            this.UnifColor = this.Unifroms['uColor'];
            this.UnifSampler0 = this.Unifroms['uSampler'];
            this.UnifSampler1 = this.Unifroms['uSampler1'];
            this.UnifSampler2 = this.Unifroms['uSampler2'];
            this.UnifDeltaTime = this.Unifroms['uDeltaTime'];
            this.UnifTime = this.Unifroms['uTime'];
            this.UnifAlpha = this.Unifroms['uAlpha'];
            this.UnifBeta = this.Unifroms['uBeta'];
            this.UnifForceOrigin = this.Unifroms['uForceOrigin'];
            this.UnifForceExponent = this.Unifroms['uForceExponent'];
            this.UnifForceVector = this.Unifroms['uForceVector'];
        }
        ShaderProgram.LoadShader = function (gl, vsource, psource) {
            var vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vsource);
            gl.compileShader(vs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
                gl.deleteShader(vs);
                return null;
            }
            var ps = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(ps, psource);
            gl.compileShader(ps);
            if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
                console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
                gl.deleteShader(ps);
                return null;
            }
            var program = gl.createProgram();
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
        };
        return ShaderProgram;
    }());
});
