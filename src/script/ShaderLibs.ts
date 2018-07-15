export const GLSL_PS_ADVECT =           '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\nuniform float uDeltaTime;\n\nout vec2 fragmentColor;\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nivec2 texsize = textureSize(uSampler,1);\nvec2 duv = col.xy * vec2(texsize.y/texsize.x,1.0) * uDeltaTime;\nfragmentColor = texture(uSampler,vUV - duv).xy;\n}';           
export const GLSL_PS_DEFAULT =         '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';         
export const GLSL_PS_FORCE =       '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //W_in 2D\nuniform float uDeltaTime;\n\n//map to [0,1.0]\nuniform vec2 uForceOrigin;\nuniform vec2 uForceVector;\nuniform float uForceExponent;\n\nout vec2 fragColor; //W_out 2D\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nivec2 texsize = textureSize(uSampler,0);\n\nvec2 pos = vUV;\nfloat amp = exp(-uForceExponent * distance(uForceOrigin,pos));\nfragColor = col.xy + uForceVector * amp;\n}';       
export const GLSL_PS_JACOBI1D =      '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform sampler2D uSampler; //1D X1\nuniform sampler2D uSampler1;//1D B1\n\nuniform float uAlpha;\nuniform float uBeta;\n\nout float fragColor;\n\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0 / float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nfloat x1 = texture(uSampler,vUV - vec2(uoff,0)).x;\nfloat x2 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat y1 = texture(uSampler,vUV - vec2(0,voff)).x;\nfloat y2 = texture(uSampler,vUV + vec2(0,voff)).x;\n\nfloat b1 = texture(uSampler1,vUV).x;\n\nfragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;\n}';      
export const GLSL_PS_JACOBI2D =     '#version 300 es\nprecision mediump float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //2D X2\nuniform sampler2D uSampler1;//2D B2\n\nuniform float uAlpha;\nuniform float uBeta;\n\nout vec2 fragColor;\n\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0/ float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nvec2 x1 = texture(uSampler,vUV - vec2(uoff,0)).xy;\nvec2 x2 = texture(uSampler,vUV + vec2(uoff,0)).xy;\nvec2 y1 = texture(uSampler,vUV - vec2(0,voff)).xy;\nvec2 y2 = texture(uSampler,vUV + vec2(0,voff)).xy;\n\nvec2 b1 = texture(uSampler1,vUV).xy;\n\nfragColor = (x1 + x2 +y1+y2 + uAlpha *b1) / uBeta;\n}';     
export const GLSL_PS_PROJFINISH =    '#version 300 es\nprecision mediump float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //1D P_in\nuniform sampler2D uSampler1; //2D W_in\n\nout vec2 fragColor;\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0 / float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\nfloat p1 = texture(uSampler,vUV - vec2(uoff,0)).x;\nfloat p2 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat p3 = texture(uSampler,vUV - vec2(0,voff)).x;\nfloat p4 = texture(uSampler,vUV + vec2(0,voff)).x;\n\nvec2 u = texture(uSampler1,vUV).xy - vec2(p2-p1,p4-p3) /(2.0 * voff);\n\nfragColor = u;\n}';    
export const GLSL_PS_PROJSETUP =   '#version 300 es\nprecision highp float;\nin vec2 vUV;\n\nuniform sampler2D uSampler; //W_in 2D\n\nout vec2 fragColor;    //DivW_out 1D\nvoid main(){\nivec2 texsize = textureSize(uSampler,0);\nfloat uoff = 1.0/ float(texsize.x);\nfloat voff = 1.0 / float(texsize.y);\n\n\nfloat x1 = texture(uSampler,vUV + vec2(uoff,0)).x;\nfloat x2 = texture(uSampler,vUV - vec2(uoff,0)).x;\n\nfloat y1 = texture(uSampler,vUV + vec2(0,voff)).y;\nfloat y2 = texture(uSampler,vUV - vec2(0,voff)).y;\n\nfloat v =  (x1 - x2 + y1 - y2) / (2.0 * uoff);\nfragColor = vec2(v,v);\n}';   
export const GLSL_VS_DEFAULT =  '#version 300 es\nprecision mediump float;\nlayout(location = 0) in vec2 aPosition;\nlayout(location = 1) in vec2 aUV;\n\nout vec2 vUV;\n\nvoid main(){\ngl_Position = vec4(aPosition *2.0-1.0,0,1);\n\nvUV = aUV;\n}';  
export const GLSL_PS_COLOR =          '#version 300 es\nprecision highp float;\nin vec2 vUV;\nuniform vec4 uColor;\n\nout vec4 fragColor;\nvoid main(){\nfragColor = uColor;\n}';          
export const GLSL_PS_FLUID =        '#version 300 es\nprecision mediump float;\nin vec2 vUV;\nuniform sampler2D uSampler; //Color Texture RGB\nuniform sampler2D uSampler1; //Velocity texture RG32F\n\nuniform float uDeltaTime;\n\nuniform float uForceExponent;\nuniform vec2 uForceOrigin;\nuniform float uTime;\n\n\nout vec4 fragColor;\nvoid main(){\n//color advection\nvec2 delta = texture(uSampler1,vUV).xy  * uDeltaTime;\nvec3 color =texture(uSampler,vUV - delta).xyz;\n\n//color added\n// vec3 dye = clamp(sin(uTime * vec3(2.72, 5.12, 4.98))+0.5,0.0,1.0);\n// float amp = exp(-uForceExponent * distance(uForceOrigin, vUV));\n// color = mix(color, dye,  clamp(amp * 100.0,0.0,1.0));\n\nfragColor = vec4(color,1.0);\n}';        
export const GLSL_VS_DEFAULT_FLIP = '#version 300 es\nprecision mediump float;\nlayout(location = 0) in vec2 aPosition;\nlayout(location = 1) in vec2 aUV;\n\nout vec2 vUV;\n\nvoid main(){\ngl_Position = vec4(aPosition *2.0-1.0,0,1);\n\nvUV = aUV;\nvUV.y = 1.0 - vUV.y;\n}'; 
