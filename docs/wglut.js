(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.wglut = {})));
}(this, (function (exports) { 'use strict';

    var GLProgram = /** @class */ (function () {
        function GLProgram(gl, program) {
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
        }
        GLProgram.prototype.GetUnifrom = function (key) {
            return this.Unifroms[key];
        };
        GLProgram.prototype.GetAttribute = function (key) {
            return this.Attributes[key];
        };
        return GLProgram;
    }());

    var GLContext = /** @class */ (function () {
        function GLContext(wgl) {
            this.gl = wgl;
        }
        GLContext.createFromGL = function (wgl) {
            return new GLContext(wgl);
        };
        GLContext.createFromCanvas = function (canvas) {
            var g = canvas.getContext('webgl2');
            if (g == null) {
                g = canvas.getContext('webgl');
            }
            if (g == null)
                return null;
            return new GLContext(g);
        };
        GLContext.prototype.createProgram = function (vsource, psource) {
            var gl = this.gl;
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
            if (program == null)
                return null;
            var p = new GLProgram(gl, program);
            var handler = {
                get: function (tar, name) {
                    if (name in tar)
                        return tar[name];
                    if (name in tar.Unifroms) {
                        tar[name] = tar.Unifroms[name];
                        return tar[name];
                    }
                    else if (name in tar.Attributes) {
                        tar[name] = tar.Attributes[name];
                        return tar[name];
                    }
                    console.warn('program can not find attr/uniform:' + name);
                    tar[name] = undefined;
                    return null;
                }
            };
            return new Proxy(p, handler);
        };
        GLContext.prototype.createTextureImage = function (src, callback) {
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
        GLContext.prototype.createTexture = function (internalFormat, width, height, linear, mipmap) {
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
        return GLContext;
    }());

    exports.GLContext = GLContext;
    exports.GLProgram = GLProgram;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wglut.umd.js.map
