var _0x2ef2=['1gABakj','10577GPnfwL','254383JUVOCn','27QeGBKp','31FWtQhz','8701qLhysQ','1yLkKur','23BJQcoe','103364ldirFb','127712ReiyfS','7746JJDQNh','3ztQjDi','363475vTDyjh'];(function(_0x26fae9,_0x54a0a5){var _0x499442=_0x439b;while(!![]){try{var _0x69af00=parseInt(_0x499442(0x1e3))*parseInt(_0x499442(0x1e5))+parseInt(_0x499442(0x1e7))*-parseInt(_0x499442(0x1e0))+parseInt(_0x499442(0x1dd))*-parseInt(_0x499442(0x1db))+-parseInt(_0x499442(0x1de))*-parseInt(_0x499442(0x1e1))+parseInt(_0x499442(0x1e2))+-parseInt(_0x499442(0x1df))*-parseInt(_0x499442(0x1dc))+-parseInt(_0x499442(0x1e4))*parseInt(_0x499442(0x1e6));if(_0x69af00===_0x54a0a5)break;else _0x26fae9['push'](_0x26fae9['shift']());}catch(_0x3ccc5f){_0x26fae9['push'](_0x26fae9['shift']());}}}(_0x2ef2,0x5086a));function _0x439b(_0x34b9cb,_0x20a91b){_0x34b9cb=_0x34b9cb-0x1db;var _0x2ef232=_0x2ef2[_0x34b9cb];return _0x2ef232;}export default'uniform\x20sampler2D\x20uReflectMap;\x0auniform\x20sampler2D\x20uNoiseMap;\x0auniform\x20vec4\x20uTintColour;\x0auniform\x20vec4\x20uWaterColour;\x0auniform\x20vec4\x20uFillForeColor;\x0auniform\x20float\x20uFresnelPower;\x0auniform\x20float\x20uMinFresnel;\x0auniform\x20float\x20uMaxFresnel;\x0auniform\x20float\x20uNoiseScale;\x0auniform\x20float\x20uWaterBrightness;\x0avarying\x20vec2\x20vNoiseCoord;\x0avarying\x20vec3\x20vProjectionCoord;\x0avarying\x20vec3\x20vEyeDir;\x0avarying\x20vec3\x20vNormal;\x0avarying\x20vec4\x20vColor;\x0avarying\x20vec4\x20vSecondColor;\x0avarying\x20vec4\x20vPositionMC;\x0avarying\x20vec3\x20vPositionEC;\x0a\x0a#ifdef\x20APPLY_SWIPE\x0a\x20\x20\x20\x20uniform\x20vec4\x20uSwipeRegion;\x0a#endif\x0a\x0a#ifdef\x20APPLY_SWIPE\x0a\x20\x20\x20\x20uniform\x20vec4\x20uSwipeRegion;\x0a\x20\x20\x20\x20void\x20rollerShutter(vec2\x20coord,\x20vec4\x20region)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20f\x20=\x20step(region.xw,\x20coord);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20s\x20=\x20step(coord,\x20region.zy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(f.x\x20*\x20f.y\x20*\x20s.x\x20*\x20s.y\x20<\x201.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x0a#ifdef\x20CLIP\x0a\x20\x20\x20\x20uniform\x20float\x20uClipMode;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uClipPlanes[6];\x0a\x20\x20\x20\x20float\x20getClipDistance(vec3\x20pos,\x20vec3\x20planeNormal,\x20float\x20disToOrigin)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20dot(planeNormal,\x20pos)\x20+\x20disToOrigin;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20float\x20clipBehindAllPlane(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x20-1.0;\x0a\x20\x20\x20\x20#ifdef\x20CLIPPLANE\x0a\x20\x20\x20\x20\x20\x20\x20\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[0].xyz,\x20uClipPlanes[0].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if\x20(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20float\x20clipBehindAnyPlane(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if((distance\x20+\x20fBorderWidth)\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20float\x20clipAnythingButLine(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20vec4\x20clip(vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(uClipMode\x20<\x200.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#ifdef\x20GL_OES_standard_derivatives\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dxc\x20=\x20abs(dFdx(vertex.x));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dyc\x20=\x20abs(dFdy(vertex.y));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fBorderWidth\x20=\x20max(dxc,\x20dyc);\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fBorderWidth\x20=\x201.0;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20clipResult\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(uClipMode\x20<\x201.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipBehindAnyPlane(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(uClipMode\x20<\x202.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipBehindAllPlane(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(uClipMode\x20<\x203.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipAnythingButLine(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(clipResult\x20<\x20-0.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(clipResult\x20<\x200.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x0avec4\x20AdjSaturation(in\x20vec4\x20inputColor,\x20in\x20float\x20saturation)\x0a{\x0a\x09vec3\x20lumCoeff\x20=\x20vec3(0.2125,\x200.7154,\x200.0721);\x0a\x09vec3\x20intensity\x20=\x20vec3(dot(inputColor.rgb,\x20lumCoeff));\x0a\x09vec3\x20tempColor\x20=\x20mix(intensity,\x20inputColor.rgb,\x20saturation);\x0a\x09return\x20vec4(tempColor,\x201.0);\x0a}\x0avoid\x20main()\x0a{\x0a#ifdef\x20APPLY_SWIPE\x20\x0a\x20\x20\x20\x20rollerShutter(gl_FragCoord.xy,\x20uSwipeRegion);\x0a#endif\x0a\x20\x20\x20\x20if(vColor.a\x20<\x200.1)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20gl_FragColor\x20=\x20vColor;\x0a\x20\x20\x20\x20vec2\x20final\x20=\x20vProjectionCoord.xy\x20/\x20vProjectionCoord.z;\x0a\x20\x20\x20\x20vec3\x20noiseNormal\x20=\x20(texture2D(uNoiseMap,\x20(vNoiseCoord.xy\x20/\x205.0)).rgb\x20-\x200.5).rbg\x20*\x20uNoiseScale;\x0a\x20\x20\x20\x20final\x20+=\x20noiseNormal.xz;\x0a\x20\x20\x20\x20float\x20realMinFresnel,\x20realMaxFresnel;\x0a\x20\x20\x20\x20if(uMinFresnel\x20<\x20uMaxFresnel)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20realMinFresnel\x20=\x20uMinFresnel;\x0a\x20\x20\x20\x20\x20\x20\x20\x20realMaxFresnel\x20=\x20uMaxFresnel;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20else\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20realMinFresnel\x20=\x20uMaxFresnel;\x0a\x20\x20\x20\x20\x20\x20\x20\x20realMaxFresnel\x20=\x20uMinFresnel;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20float\x20fresnelBias\x20=\x20realMinFresnel;\x0a\x20\x20\x20\x20float\x20fresnelScale\x20=\x20(realMaxFresnel\x20-\x20realMinFresnel)\x20/\x201.0;\x0a\x20\x20\x20\x20float\x20fresnel\x20=\x20fresnelBias\x20+\x20fresnelScale\x20*\x20pow(1.0\x20+\x20dot(normalize(vEyeDir),\x20vNormal),\x20uFresnelPower);\x0a\x20\x20\x20\x20fresnel\x20=\x20clamp(fresnel,\x200.05,\x200.95);\x0a\x20\x20\x20\x20vec4\x20reflectionColour\x20=\x20texture2D(uReflectMap,\x20final);\x0a\x20\x20\x20\x20vec4\x20refractionColour\x20=\x20reflectionColour\x20+\x20uTintColour;\x0a\x20\x20\x20\x20vec4\x20resultColour\x20=\x20mix(uWaterColour,\x20reflectionColour,\x20fresnel);\x0a\x20\x20\x20\x20resultColour\x20=\x20AdjSaturation(resultColour,\x201.0);\x0a\x20\x20\x20\x20resultColour\x20=\x20resultColour\x20*\x20uWaterBrightness;\x0a\x20\x20\x20\x20resultColour.a\x20=\x20uWaterColour.a;\x0a\x20\x20\x20\x20resultColour\x20*=\x20uFillForeColor;\x0a\x20\x20\x20\x20gl_FragColor\x20=\x20gl_FragColor\x20*\x20resultColour;\x0a#ifdef\x20CLIP\x0a\x20\x20\x20\x20gl_FragColor\x20*=\x20clip(vec4(vPositionEC,\x201.0));\x0a#endif\x0a\x20\x20\x20\x20if(gl_FragColor.a\x20<\x200.1)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20}\x0a\x0a}';