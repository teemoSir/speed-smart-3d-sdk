var _0x4ed1=['1459796fQwMBq','715718OBEaHU','\x0a\x20\x20\x20\x20attribute\x20vec4\x20aPosition;\x0a#ifdef\x20VertexColor\x0a\x20\x20\x20\x20attribute\x20vec4\x20aColor;\x0a#endif\x0a#ifdef\x20VertexNormal\x0a\x20\x20\x20\x20attribute\x20vec3\x20aNormal;\x0a#endif\x0a#ifdef\x20Instance\x0a\x20\x20\x20\x20attribute\x20float\x20instanceId;\x0a#else\x0a\x20\x20\x20\x20attribute\x20float\x20batchId;\x0a#endif\x20\x0a\x0a#ifdef\x20TextureAtlas\x0a\x20\x20\x20\x20attribute\x20float\x20aTextureBatchId0;\x0a#endif\x0a\x0a#ifdef\x20TexCoord\x0a\x20\x20\x20\x20attribute\x20vec4\x20aTexCoord0;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexCoord;\x0a\x20\x20\x20\x20uniform\x20mat4\x20uTexMatrix;\x0a#ifdef\x20COMPUTE_TEXCOORD\x0a#ifdef\x20TextureAtlas\x0a\x20\x20\x20\x20uniform\x20vec4\x20uTexAtlasDim;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexAtlasTran;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexAtlasScale;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexAtlasSize;\x0a\x20\x20\x20\x20varying\x20vec2\x20vMaxMipLevel;\x0a#else\x0a\x20\x20\x20\x20uniform\x20float\x20uTexture0Width;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexMatrix;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexCoordTransform;\x0a#endif\x20\x20\x20\x20\x0a#endif\x0a#endif\x0a\x0a#ifdef\x20TexCoord2\x0a\x20\x20\x20\x20attribute\x20vec4\x20aTexCoord1;\x0a\x20\x20\x20\x20uniform\x20float\x20uTexture1Width;\x0a\x20\x20\x20\x20varying\x20vec4\x20vTexMatrix2;\x0a#endif\x0a#ifdef\x20InstanceBim\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv2;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv3;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv4;\x0a\x20\x20\x20\x20attribute\x20vec4\x20secondary_colour;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv6;\x20\x20\x20\x0a#endif\x0a\x0a#ifdef\x20InstancePipe\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv1;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv2;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv3;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv4;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv5;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv6;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv7;\x0a\x20\x20\x20\x20attribute\x20vec4\x20secondary_colour;\x0a\x20\x20\x20\x20attribute\x20vec4\x20uv9;\x0a#endif\x0a\x0a#ifdef\x20HYPSOMETRIC\x0a\x20\x20\x20\x20varying\x20float\x20wValue;\x20\x20\x20\x20\x0a#endif\x0a#ifdef\x20FLATTEN\x0a\x20\x20\x20\x20uniform\x20mat4\x20uGeoMatrix;\x0a\x20\x20\x20\x20uniform\x20mat4\x20uInverseGeoMatrix;\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uFlattenTexture;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uFlattenRect;\x0a#endif\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20uniform\x20vec4\x20uSelectedColor;\x0a\x20\x20\x20\x20uniform\x20vec4\x20uFillForeColor;\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20varying\x20vec4\x20vSecondColor;\x0a\x20\x20\x20\x20varying\x20vec4\x20vPositionMC;\x0a\x20\x20\x20\x20varying\x20vec3\x20vPositionEC;\x0a#ifdef\x20VertexNormal\x0a\x20\x20\x20\x20varying\x20vec3\x20vNormalEC;\x0a#endif\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20varying\x20vec4\x20vColor;\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20const\x20float\x20SHIFT_LEFT8\x20=\x20256.0;\x0a\x20\x20\x20\x20const\x20float\x20SHIFT_RIGHT8\x20=\x201.0\x20/\x20256.0;\x0a\x20\x20\x20\x20const\x20float\x20SHIFT_RIGHT4\x20=\x201.0\x20/\x2016.0;\x0a\x20\x20\x20\x20const\x20float\x20SHIFT_LEFT4\x20=\x2016.0;\x0a\x20\x20\x20\x20void\x20getTextureMatrixFromZValue(in\x20float\x20nZ,\x20inout\x20float\x20XTran,\x20inout\x20float\x20YTran,\x20inout\x20float\x20scale)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(nZ\x20<=\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20nDel8\x20=\x20floor(nZ\x20*\x20SHIFT_RIGHT8);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20nDel16\x20=\x20floor(nDel8\x20*\x20SHIFT_RIGHT8);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20nDel20\x20=\x20floor(nDel16\x20*\x20SHIFT_RIGHT4);\x0a\x20\x20\x20\x20\x20\x20\x20\x20YTran\x20=\x20nZ\x20-\x20nDel8\x20*\x20SHIFT_LEFT8;\x0a\x20\x20\x20\x20\x20\x20\x20\x20XTran\x20=\x20nDel8\x20-\x20nDel16\x20*\x20SHIFT_LEFT8;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20nLevel\x20=\x20nDel16\x20-\x20nDel20\x20*\x20SHIFT_LEFT4;\x0a\x20\x20\x20\x20\x20\x20\x20\x20scale\x20=\x201.0\x20/\x20pow(2.0,\x20nLevel);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20void\x20operation(vec4\x20operationType,\x20vec4\x20color,\x20vec4\x20selectedColor,\x20inout\x20vec4\x20vertexColor)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20right_2\x20=\x20operationType.x\x20*\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20right_4\x20=\x20right_2\x20*\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20right_8\x20=\x20right_4\x20*\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20right_16\x20=\x20right_8\x20*\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20isSetColor\x20=\x20fract(right_2);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(isSetColor\x20>\x200.1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vertexColor\x20*=\x20color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20isPicked\x20=\x20fract(floor(right_2)*\x200.5);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(isPicked\x20>\x200.1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vertexColor\x20*=\x20selectedColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20isHide\x20=\x20fract(floor(right_4)*\x200.5);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(isHide\x20>\x200.1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vertexColor.a\x20=\x200.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a#ifdef\x20FLATTEN\x0a\x20\x20\x20\x20float\x20unpackValue(vec4\x20packedValue)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20SHIFT_LEFT16\x20=\x2065536.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20SHIFT_LEFT8\x20=\x20256.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20value\x20=\x20packedValue\x20*\x20255.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20value.r\x20*\x20SHIFT_LEFT16\x20+\x20value.g\x20*\x20SHIFT_LEFT8\x20+\x20value.b\x20-\x209000.0;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20vec4\x20calculateHeight(vec4\x20vertexPos)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20vecPos\x20=\x20uGeoMatrix\x20*\x20vec4(vertexPos.xyz,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20vecRatio\x20=\x20vec2(uFlattenRect.z\x20-\x20uFlattenRect.x,\x20uFlattenRect.w\x20-\x20uFlattenRect.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20vecTexCoord\x20=\x20vec2(vecPos.x\x20-\x20uFlattenRect.x,\x20vecPos.y\x20-\x20uFlattenRect.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vecTexCoord.x\x20=\x20vecTexCoord.x\x20/\x20vecRatio.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vecTexCoord.y\x20=\x20vecTexCoord.y\x20/\x20vecRatio.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(vecTexCoord.x\x20>\x201.0\x20||\x20vecTexCoord.x\x20<\x200.0\x20||\x20vecTexCoord.y\x20>\x201.0\x20||\x20vecTexCoord.y\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vertexPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20fHeight\x20=\x20unpackValue(texture2D(uFlattenTexture,\x20vecTexCoord.xy));\x0a\x20\x20\x20\x20\x20\x20\x20\x20fHeight\x20=\x20fHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(vecPos.z\x20>\x20fHeight)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vecPos.z\x20=\x20fHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vecPos.w\x20=\x20vecPos.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20uInverseGeoMatrix\x20*\x20vec4(vecPos.xyz,\x201.0);\x0a\x20\x20\x20\x20}\x0a#endif\x0a#ifdef\x20TextureAtlas\x0a\x20\x20\x20\x20uniform\x20highp\x20sampler2D\x20batchTextureAtlas;\x20\x0a\x20\x20\x20\x20uniform\x20vec4\x20batchTextureAtlasStep;\x20\x0a#ifdef\x20SecTextureAtlas\x0a\x20\x20\x20\x20uniform\x20highp\x20sampler2D\x20batchTextureAtlasSec;\x20\x0a\x20\x20\x20\x20uniform\x20vec4\x20batchTextureAtlasStepSec;\x20\x0a#endif\x0a\x20\x20\x20\x20vec2\x20computeAtlasSt(float\x20batchId,\x20vec4\x20step)\x20\x0a\x20\x20\x20\x20{\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20stepX\x20=\x20step.x;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20centerX\x20=\x20step.y;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20numberOfAttributes\x20=\x20float(1);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(centerX\x20+\x20(batchId\x20*\x20numberOfAttributes\x20*\x20stepX),\x200.5);\x20\x0a\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20vec4\x20atlas_batchTable_xywh(float\x20batchId,\x20sampler2D\x20texture,\x20vec4\x20step)\x20\x0a\x20\x20\x20\x20{\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20st\x20=\x20computeAtlasSt(batchId,\x20step);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20st.x\x20+=\x20step.x\x20*\x20float(0);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20textureValue\x20=\x20texture2D(texture,\x20st);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20value\x20=\x20textureValue;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20value;\x20\x0a\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20void\x20getTexAtlasParameter(in\x20vec4\x20xywh,\x20in\x20vec2\x20textureDim,\x20inout\x20vec2\x20translate,\x20inout\x20vec2\x20scale,\x20inout\x20vec2\x20texSize,\x20inout\x20float\x20maxMipLevel)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20width\x20=\x20xywh.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20height\x20\x20=\x20xywh.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width\x20*=\x202.0\x20/\x203.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20maxMipLevel\x20=\x20log2(min(width,\x20height));\x0a\x20\x20\x20\x20\x20\x20\x20\x20scale.x\x20=\x20width\x20/\x20textureDim.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20scale.y\x20=\x20height\x20/\x20textureDim.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20translate.x\x20=\x20xywh.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20translate.y\x20\x20=\x20xywh.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20translate\x20/=\x20textureDim;\x0a\x20\x20\x20\x20\x20\x20\x20\x20texSize.x\x20=\x20width;\x0a\x20\x20\x20\x20\x20\x20\x20\x20texSize.y\x20=\x20height;\x0a\x20\x20\x20\x20}\x0a#endif\x0a\x20\x20\x20\x20void\x20main()\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20#ifdef\x20COMPUTE_TEXCOORD\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoord.xy\x20=\x20aTexCoord0.xy;\x0a\x20\x20\x20\x20#ifdef\x20TextureAtlas\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(aTextureBatchId0\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vMaxMipLevel.x\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20xywh\x20=\x20atlas_batchTable_xywh(aTextureBatchId0,\x20batchTextureAtlas,\x20batchTextureAtlasStep);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20getTexAtlasParameter(xywh,\x20uTexAtlasDim.xy,\x20vTexAtlasTran.xy,\x20vTexAtlasScale.xy,\x20vTexAtlasSize.xy,\x20vMaxMipLevel.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix\x20=\x20vec4(0.0,0.0,1.0,0.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoordTransform.x\x20=\x20aTexCoord0.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(vTexCoordTransform.x\x20<\x20-90000.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix.z\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20getTextureMatrixFromZValue(floor(vTexCoordTransform.x),\x20vTexMatrix.x,\x20vTexMatrix.y,\x20vTexMatrix.z);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix.w\x20=\x20log2(uTexture0Width\x20*\x20vTexMatrix.z);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20#ifdef\x20TexCoord2\x0a\x20\x20\x20\x20#ifdef\x20TextureAtlas\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(aTextureBatchIdSec\x20<\x200.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vMaxMipLevel.y\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20else\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20xywh2\x20=\x20atlas_batchTable_xywh(aTextureBatchIdSec,\x20batchTextureAtlasSec,\x20batchTextureAtlasStepSec);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20getTexAtlasParameter(xywh2,\x20uTexAtlasDim.zw,\x20vTexAtlasTran.zw,\x20vTexAtlasScale.zw,\x20vTexAtlasSize.zw,\x20vMaxMipLevel.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoord.zw\x20=\x20aTexCoord1.xy;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix2\x20=\x20vec4(0.0,0.0,1.0,0.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoordTransform.y\x20=\x20aTexCoord1.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(vTexCoordTransform.y\x20<\x20-90000.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix2.z\x20=\x20-1.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20getTextureMatrixFromZValue(floor(vTexCoordTransform.y),\x20vTexMatrix2.x,\x20vTexMatrix2.y,\x20vTexMatrix2.z);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexMatrix2.w\x20=\x20log2(uTexture1Width\x20*\x20vTexMatrix.z);\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20vec4\x20vertexPos\x20=\x20aPosition;\x0a#ifdef\x20FLATTEN\x0a\x20\x20\x20\x20vertexPos\x20=\x20calculateHeight(vertexPos);\x0a#endif\x0a\x20\x20\x20\x20vec4\x20vertexColor\x20=\x20uFillForeColor;\x0a#ifdef\x20VertexColor\x0a\x20\x20\x20\x20vertexColor\x20*=\x20aColor;\x0a#endif\x0a#ifdef\x20VertexNormal\x0a\x20\x20\x20\x20vec3\x20normal\x20=\x20aNormal;\x0a#endif\x0a#ifdef\x20InstanceBim\x0a\x20\x20\x20\x20mat4\x20worldMatrix;\x0a\x20\x20\x20\x20worldMatrix[0]\x20=\x20uv2;\x0a\x20\x20\x20\x20worldMatrix[1]\x20=\x20uv3;\x0a\x20\x20\x20\x20worldMatrix[2]\x20=\x20uv4;\x0a\x20\x20\x20\x20worldMatrix[3]\x20=\x20vec4(0,\x200,\x200,\x201);\x0a\x20\x20\x20\x20vertexPos\x20=\x20vec4(vertexPos.xyz,1.0)\x20*\x20worldMatrix;\x0a\x20\x20\x20\x20vertexColor\x20*=\x20secondary_colour;\x20\x0a#endif\x0a#ifdef\x20InstancePipe\x0a\x20\x20\x20\x20mat4\x20worldMatrix;\x0a\x20\x20\x20\x20mat4\x20worldMatrix0;\x0a\x20\x20\x20\x20mat4\x20worldMatrix1;\x0a\x20\x20\x20\x20vec4\x20worldPos0;\x0a\x20\x20\x20\x20vec4\x20worldPos1;\x0a\x20\x20\x20\x20worldMatrix0[0]\x20=\x20uv1;\x0a\x20\x20\x20\x20worldMatrix0[1]\x20=\x20uv2;\x0a\x20\x20\x20\x20worldMatrix0[2]\x20=\x20uv3;\x0a\x20\x20\x20\x20worldMatrix0[3]\x20=\x20vec4(\x200.0,\x200.0,\x200.0,\x201.0\x20);\x0a\x20\x20\x20\x20worldMatrix1[0]\x20=\x20uv4;\x0a\x20\x20\x20\x20worldMatrix1[1]\x20=\x20uv5;\x0a\x20\x20\x20\x20worldMatrix1[2]\x20=\x20uv6;\x0a\x20\x20\x20\x20worldMatrix1[3]\x20=\x20vec4(\x200.0,\x200.0,\x200.0,\x201.0\x20);\x0a\x20\x20\x20\x20vec4\x20realVertex\x20=\x20vec4(vertexPos.xyz,\x201.0);\x0a\x20\x20\x20\x20realVertex.x\x20=\x20realVertex.x\x20*\x20uv7.z;\x0a\x20\x20\x20\x20worldPos0\x20=\x20realVertex\x20*\x20worldMatrix0;\x0a\x20\x20\x20\x20worldPos1\x20=\x20realVertex\x20*\x20worldMatrix1;\x0a\x20\x20\x20\x20vertexColor\x20*=\x20secondary_colour;\x20\x0a#ifdef\x20TexCoord\x0a\x20\x20\x20\x20if(aTexCoord0.y\x20>\x200.5)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20tex4Vec\x20=\x20uTexMatrix\x20*\x20vec4(uv7.y,\x20aTexCoord0.x,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoord.xy\x20=\x20tex4Vec.xy;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vertexPos\x20=\x20worldPos1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20worldMatrix\x20=\x20worldMatrix1;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20else\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20tex4Vec\x20=\x20uTexMatrix\x20*\x20vec4(uv7.x,\x20aTexCoord0.x,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTexCoord.xy\x20=\x20tex4Vec.xy;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vertexPos\x20=\x20worldPos0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20worldMatrix\x20=\x20worldMatrix0;\x0a\x20\x20\x20\x20}\x0a#endif\x0a#ifdef\x20VertexNormal\x0a\x20\x20\x20\x20normal.x\x20=\x20normal.x\x20*\x20uv7.z;\x0a#endif\x0a#endif\x0a\x20\x20\x20\x20#ifdef\x20Instance\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20index\x20=\x20instanceId;\x0a\x20\x20\x20\x20#else\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20index\x20=\x20batchId;\x0a\x20\x20\x20\x20#endif\x20\x20\x0a\x20\x20\x20\x20#ifdef\x20HYPSOMETRIC\x0a\x20\x20\x20\x20\x20\x20\x20\x20wValue\x20=\x20vertexPos.w;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20operationType\x20=\x20s3m_batchTable_operation(index);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20objsColor\x20=\x20s3m_batchTable_color(index);\x0a\x20\x20\x20\x20\x20\x20\x20\x20operation(operationType,\x20objsColor,\x20uSelectedColor,\x20vertexColor);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vSecondColor\x20=\x20s3m_batchTable_pickColor(index);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20positionMC\x20=\x20vec4(vertexPos.xyz,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vColor\x20=\x20vertexColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vPositionMC\x20=\x20positionMC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vPositionEC\x20=\x20(czm_modelView\x20*\x20positionMC).xyz;\x0a\x20\x20\x20\x20#ifdef\x20VertexNormal\x0a\x20\x20\x20\x20\x20\x20\x20\x20vNormalEC\x20=\x20czm_normal\x20*\x20normal;\x0a\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_modelViewProjection\x20*\x20vec4(vertexPos.xyz,\x201.0);\x0a\x20\x20\x20\x20}\x0a','572571gTuTRm','1014561EkuVvN','81QeUemy','14765ZzsHRg','1hlJqGx','10qNXqnL','6317JvkJKa','275967vAydTu'];var _0x51c27c=_0x41cb;(function(_0x50afd3,_0x1912ec){var _0x1f7fec=_0x41cb;while(!![]){try{var _0x4e3a1f=-parseInt(_0x1f7fec(0x79))+-parseInt(_0x1f7fec(0x78))+-parseInt(_0x1f7fec(0x7b))*-parseInt(_0x1f7fec(0x7d))+parseInt(_0x1f7fec(0x75))+-parseInt(_0x1f7fec(0x74))+-parseInt(_0x1f7fec(0x7a))*-parseInt(_0x1f7fec(0x73))+parseInt(_0x1f7fec(0x7c))*parseInt(_0x1f7fec(0x76));if(_0x4e3a1f===_0x1912ec)break;else _0x50afd3['push'](_0x50afd3['shift']());}catch(_0x2095fe){_0x50afd3['push'](_0x50afd3['shift']());}}}(_0x4ed1,0xed3de));function _0x41cb(_0x40a9ba,_0x28a89a){_0x40a9ba=_0x40a9ba-0x73;var _0x4ed1c1=_0x4ed1[_0x40a9ba];return _0x4ed1c1;}export default _0x51c27c(0x77);