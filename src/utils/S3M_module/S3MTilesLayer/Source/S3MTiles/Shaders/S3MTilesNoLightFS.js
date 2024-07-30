var _0x506b=['1cEMyeG','819101HvpeTO','100761XolOgK','87ldKvib','1469149kGSpKQ','774232HGLQQv','\x0a#ifdef\x20GL_OES_standard_derivatives\x0a#extension\x20GL_OES_standard_derivatives\x20:\x20enable\x0a#endif\x0a#ifdef\x20GL_EXT_shader_texture_lod\x0a#extension\x20GL_EXT_shader_texture_lod\x20:\x20enable\x0a#endif\x0a\x20\x20\x20\x20uniform\x20vec4\x20uDiffuseColor;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uAmbientColor;\x0a#ifdef\x20TexCoord\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uTexture;\x0a\x20\x20\x20\x20uniform\x20float\x20uTexture0Width;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexCoord;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexCoordTransform;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexMatrix;\x0a#endif\x0a#ifdef\x20VertexColor\x0a\x20\x20\x20\x20varying\x20vec4\x20vColor;\x0a#endif\x0a\x20\x20\x20\x20varying\x20vec4\x20vSecondColor;\x0a\x20\x20\x20\x20varying\x20vec4\x20vPositionMC;\x0a\x20\x20\x20\x20varying\x20vec3\x20vPositionEC;\x0a\x20\x20\x20\x20void\x20calculateMipLevel(in\x20vec2\x20inTexCoord,\x20in\x20float\x20vecTile,\x20in\x20float\x20fMaxMip,\x20inout\x20float\x20mipLevel)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20dx\x20=\x20dFdx(inTexCoord\x20*\x20vecTile);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20dy\x20=\x20dFdy(inTexCoord\x20*\x20vecTile);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dotX\x20=\x20dot(dx,\x20dx);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dotY\x20=\x20dot(dy,\x20dy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dMax\x20=\x20max(dotX,\x20dotY);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dMin\x20=\x20min(dotX,\x20dotY);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20offset\x20=\x20(dMax\x20-\x20dMin)\x20/\x20(dMax\x20+\x20dMin);\x0a\x20\x20\x20\x20\x20\x20\x20\x20offset\x20=\x20clamp(offset,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20d\x20=\x20dMax\x20*\x20(1.0\x20-\x20offset)\x20+\x20dMin\x20*\x20offset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20mipLevel\x20=\x200.5\x20*\x20log2(d);\x0a\x20\x20\x20\x20\x20\x20\x20\x20mipLevel\x20=\x20clamp(mipLevel,\x200.0,\x20fMaxMip\x20-\x201.62);\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20void\x20calculateMipLevel(in\x20vec2\x20inTexCoord,\x20in\x20vec2\x20vecTile,\x20in\x20float\x20fMaxMip,\x20inout\x20float\x20mipLevel)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20dx\x20=\x20dFdx(inTexCoord\x20*\x20vecTile.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20dy\x20=\x20dFdy(inTexCoord\x20*\x20vecTile.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dotX\x20=\x20dot(dx,\x20dx);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dotY\x20=\x20dot(dy,\x20dy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dMax\x20=\x20max(dotX,\x20dotY);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dMin\x20=\x20min(dotX,\x20dotY);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20offset\x20=\x20(dMax\x20-\x20dMin)\x20/\x20(dMax\x20+\x20dMin);\x0a\x20\x20\x20\x20\x20\x20\x20\x20offset\x20=\x20clamp(offset,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20d\x20=\x20dMax\x20*\x20(1.0\x20-\x20offset)\x20+\x20dMin\x20*\x20offset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20mipLevel\x20=\x200.5\x20*\x20log2(d);\x0a\x20\x20\x20\x20\x20\x20\x20\x20mipLevel\x20=\x20clamp(mipLevel,\x200.0,\x20fMaxMip\x20-\x201.62);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20void\x20calculateTexCoord(in\x20vec3\x20inTexCoord,\x20in\x20float\x20scale,\x20in\x20float\x20XTran,\x20in\x20float\x20YTran,\x20in\x20float\x20fTile,\x20in\x20float\x20mipLevel,\x20inout\x20vec2\x20outTexCoord)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(inTexCoord.z\x20<\x20-9000.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20outTexCoord\x20=\x20inTexCoord.xy;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20fTexCoord\x20=\x20fract(inTexCoord.xy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20offset\x20=\x201.0\x20*\x20pow(2.0,\x20mipLevel)\x20/\x20fTile;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fTexCoord\x20=\x20clamp(fTexCoord,\x20offset,\x201.0\x20-\x20offset);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20outTexCoord.x\x20=\x20(fTexCoord.x\x20+\x20XTran)\x20*\x20scale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20outTexCoord.y\x20=\x20(fTexCoord.y\x20+\x20YTran)\x20*\x20scale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20vec4\x20getTexColorForS3M(sampler2D\x20curTexture,\x20vec3\x20oriTexCoord,\x20float\x20texTileWidth,\x20float\x20fMaxMipLev,\x20float\x20fTexCoordScale,\x20vec2\x20vecTexCoordTranslate)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color\x20=\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20mipLevel\x20=\x200.0;\x0a\x20\x20\x20\x20#ifdef\x20GL_OES_standard_derivatives\x0a\x20\x20\x20\x20\x20\x20\x20\x20calculateMipLevel(oriTexCoord.xy,\x20texTileWidth,\x20fMaxMipLev,\x20mipLevel);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20realTexCoord;\x0a\x20\x20\x20\x20\x20\x20\x20\x20calculateTexCoord(oriTexCoord,\x20fTexCoordScale,\x20vecTexCoordTranslate.x,\x20vecTexCoordTranslate.y,\x20texTileWidth,\x20mipLevel,\x20realTexCoord);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(oriTexCoord.z\x20<\x20-9000.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color\x20=\x20texture2D(curTexture,\x20realTexCoord.xy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20GL_EXT_shader_texture_lod\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color\x20=\x20texture2DLodEXT(curTexture,\x20realTexCoord.xy,\x20mipLevel);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color\x20=\x20texture2D(curTexture,\x20realTexCoord.xy,\x20mipLevel);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20color;\x0a\x20\x20\x20\x20}\x0a#ifdef\x20TexCoord\x0a\x20\x20\x20\x20vec4\x20getTextureColor()\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(vTexMatrix.z\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20texTileWidth0\x20=\x20vTexMatrix.z\x20*\x20uTexture0Width;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20realTexCoord\x20=\x20vec3(vTexCoord.xy,\x20vTexCoordTransform.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20FColor\x20=\x20getTexColorForS3M(uTexture,\x20realTexCoord,\x20texTileWidth0,\x20vTexMatrix.w,\x20vTexMatrix.z,\x20vTexMatrix.xy);\x0a\x20\x20\x20\x20#ifdef\x20TexCoord2\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20texTileWidth1\x20=\x20vTexMatrix2.z\x20*\x20uTexture1Width;\x0a\x20\x20\x20\x20\x20\x20\x20\x20realTexCoord\x20=\x20vec3(vTexCoord.zw,\x20vTexCoordTransform.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20SColor\x20=\x20getTexColorForS3M(uTexture2,\x20realTexCoord,\x20texTileWidth1,\x20vTexMatrix2.w,\x20vTexMatrix2.z,\x20vTexMatrix2.xy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20SColor.r\x20=\x20clamp(SColor.r,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20SColor.g\x20=\x20clamp(SColor.g,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20SColor.b\x20=\x20clamp(SColor.b,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20FColor\x20*\x20SColor;\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20FColor;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x20\x20\x20\x20\x0a#ifdef\x20CLIP\x0a\x20\x20\x20\x20uniform\x20float\x20uClipMode;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uClipPlanes[6];\x0a\x20\x20\x20\x20float\x20getClipDistance(vec3\x20pos,\x20vec3\x20planeNormal,\x20float\x20disToOrigin)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20dot(planeNormal,\x20pos)\x20+\x20disToOrigin;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20float\x20clipBehindAllPlane(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x20-1.0;\x0a\x20\x20\x20\x20#ifdef\x20CLIPPLANE\x0a\x20\x20\x20\x20\x20\x20\x20\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[0].xyz,\x20uClipPlanes[0].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if\x20(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20float\x20clipBehindAnyPlane(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if((distance\x20+\x20fBorderWidth)\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20float\x20clipAnythingButLine(float\x20fBorderWidth,\x20vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20result\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i\x20=\x200;\x20i\x20<\x206;\x20i++)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x20getClipDistance(vertex.xyz,\x20uClipPlanes[i].xyz,\x20uClipPlanes[i].w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(distance\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(distance\x20<\x20fBorderWidth)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20result\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20result;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20vec4\x20clip(vec4\x20vertex)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(uClipMode\x20<\x200.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#ifdef\x20GL_OES_standard_derivatives\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dxc\x20=\x20abs(dFdx(vertex.x));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dyc\x20=\x20abs(dFdy(vertex.y));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fBorderWidth\x20=\x20max(dxc,\x20dyc);\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fBorderWidth\x20=\x201.0;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20clipResult\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(uClipMode\x20<\x201.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipBehindAnyPlane(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(uClipMode\x20<\x202.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipBehindAllPlane(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(uClipMode\x20<\x203.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clipResult\x20=\x20clipAnythingButLine(fBorderWidth,\x20vertex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(clipResult\x20<\x20-0.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(clipResult\x20<\x200.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(1.0);\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x0a#ifdef\x20HYPSOMETRIC\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uHypsometricTexture;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uMinMaxValue;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uOpacityIntervalFillMode;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uHypLineColor;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uNoValueColor;\x0a\x20\x20\x20\x20varying\x20float\x20wValue;\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20float\x20computeMixCon(float\x20fValue)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20distanceToContour;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20minVisibleValue\x20=\x20uMinMaxValue.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20maxVisibleValue\x20=\x20uMinMaxValue.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20interval\x20=\x20uOpacityIntervalFillMode.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(abs(maxVisibleValue\x20-\x20minVisibleValue)\x20>\x200.1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fValue\x20<\x200.5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20distanceToContour\x20=\x20mod(fValue\x20-\x200.0002,\x20interval);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20t\x20=\x20floor(fValue\x20/\x20interval);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20distanceToContour\x20=\x20abs(fValue\x20-\x20(t\x20*\x20interval)\x20-\x200.1);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20distanceToContour\x20=\x20abs(fValue\x20-\x20maxVisibleValue);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dxc\x20=\x20abs(dFdx(fValue));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dyc\x20=\x20abs(dFdy(fValue));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20dF\x20=\x20max(dxc,\x20dyc);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20distanceToContour\x20<\x20dF\x20?\x201.0\x20:\x200.0;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20vec4\x20computeContourMapColor(float\x20fValue)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20floorValue\x20=\x20uMinMaxValue.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20ceilValue\x20=\x20uMinMaxValue.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20threshold\x20=\x20abs(ceilValue\x20-\x20floorValue);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20contourRate\x20=\x20(fValue\x20-\x20floorValue)\x20/\x20threshold;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20finalCoord\x20=\x20clamp(contourRate,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20count\x20=\x20floor(finalCoord\x20*\x2016.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20y\x20=\x20(count*2.0\x20+\x201.0)/32.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20x\x20=\x20fract(finalCoord*16.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(y\x20>\x201.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20x\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20contourCoord\x20=\x20vec2(x,\x20y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20texture2D(uHypsometricTexture,\x20contourCoord);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20vec4\x20getContourMapColor(vec4\x20oriColor,\x20float\x20fValue)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20contourMapColor\x20=\x20vec4(0.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20finalOpacity\x20=\x20uOpacityIntervalFillMode.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20minVisibleValue\x20=\x20uMinMaxValue.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20maxVisibleValue\x20=\x20uMinMaxValue.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fillMode\x20=\x20uOpacityIntervalFillMode.z;\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(fValue\x20>\x20maxVisibleValue\x20+\x204.0\x20||\x20fValue\x20<\x20minVisibleValue\x20-\x204.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20uNoValueColor\x20*\x20oriColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode\x20>\x202.9)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20mix_con\x20=\x20computeMixCon(fValue);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contourMapColor\x20=\x20mix(computeContourMapColor(fValue),\x20uHypLineColor,\x20mix_con);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(fillMode\x20>\x201.9)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20finalOpacity\x20=\x20computeMixCon(fValue);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contourMapColor\x20=\x20uHypLineColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(fillMode\x20>\x200.9)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contourMapColor\x20=\x20computeContourMapColor(fValue);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20finalOpacity\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20finalColor\x20=\x20mix(oriColor,\x20contourMapColor,\x20finalOpacity);\x0a\x20\x20\x20\x20#ifdef\x20PT_CLOUD\x0a\x20\x20\x20\x20\x20\x20\x20\x20finalColor\x20=\x20mix(vec4(1.0,1.0,1.0,1.0),\x20contourMapColor,\x20finalOpacity);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20finalColor;\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x20\x20\x0a#ifdef\x20APPLY_SWIPE\x0a\x20\x20\x20\x20uniform\x20vec4\x20uSwipeRegion;\x0a\x20\x20\x20\x20void\x20rollerShutter(vec2\x20coord,\x20vec4\x20region)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20f\x20=\x20step(region.xw,\x20coord);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20s\x20=\x20step(coord,\x20region.zy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(f.x\x20*\x20f.y\x20*\x20s.x\x20*\x20s.y\x20<\x201.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20void\x20main()\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20#ifdef\x20APPLY_SWIPE\x0a\x20\x20\x20\x20\x20\x20\x20\x20rollerShutter(gl_FragCoord.xy,\x20uSwipeRegion);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20vec4\x20baseColorWithAlpha\x20=\x20vec4(1.0);\x0a\x20\x20\x20\x20#ifdef\x20VertexColor\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20baseColorWithAlpha\x20=\x20vColor;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20#ifdef\x20TexCoord\x0a\x20\x20\x20\x20\x20\x20\x20\x20baseColorWithAlpha\x20*=\x20getTextureColor();\x0a\x20\x20\x20\x20#endif\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20outColor\x20=\x20baseColorWithAlpha;\x0a\x20\x20\x20\x20#ifdef\x20HYPSOMETRIC\x0a\x20\x20\x20\x20\x20\x20\x20\x20outColor\x20=\x20getContourMapColor(outColor,\x20wValue);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20#ifdef\x20CLIP\x0a\x20\x20\x20\x20\x20\x20\x20\x20outColor\x20*=\x20clip(vec4(vPositionEC,\x201.0));\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20outColor;\x0a\x20\x20\x20\x20}\x0a','324026QQxcWP','1IvEGVa','1PVUOLG','1104jgoEVi','740509MAfFFa'];var _0x377768=_0x5231;function _0x5231(_0x57d88d,_0x37c857){_0x57d88d=_0x57d88d-0x101;var _0x506bac=_0x506b[_0x57d88d];return _0x506bac;}(function(_0x27f460,_0x2ffec1){var _0x3b9942=_0x5231;while(!![]){try{var _0xd9e0b9=parseInt(_0x3b9942(0x108))*-parseInt(_0x3b9942(0x103))+-parseInt(_0x3b9942(0x107))*-parseInt(_0x3b9942(0x109))+-parseInt(_0x3b9942(0x10c))+parseInt(_0x3b9942(0x102))+parseInt(_0x3b9942(0x106))+-parseInt(_0x3b9942(0x104))*-parseInt(_0x3b9942(0x10b))+parseInt(_0x3b9942(0x10a))*-parseInt(_0x3b9942(0x105));if(_0xd9e0b9===_0x2ffec1)break;else _0x27f460['push'](_0x27f460['shift']());}catch(_0x4f8459){_0x27f460['push'](_0x27f460['shift']());}}}(_0x506b,0xe6ba8));export default _0x377768(0x101);