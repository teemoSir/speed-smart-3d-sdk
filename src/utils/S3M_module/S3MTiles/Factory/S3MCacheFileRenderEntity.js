import S3MTilesVS from '../Shaders/S3MTilesVS.js';
import S3MTilesFS from '../Shaders/S3MTilesFS.js';
import RenderEntity from './RenderEntity.js';
import VertexCompressOption from '../Enum/VertexCompressOption.js';

function S3MCacheFileRenderEntity(options) {
    RenderEntity.call(this, options);
    this.vs = S3MTilesVS;
    this.fs = S3MTilesFS;
    this.useLineColor = false;
}

S3MCacheFileRenderEntity.prototype = Object.create( RenderEntity.prototype );

S3MCacheFileRenderEntity.prototype.constructor = RenderEntity;

function getOpaqueRenderState() {
    return Cesium.RenderState.fromCache({
        cull : {
            enabled : false
        },
        depthTest : {
            enabled : true,
            func : Cesium.DepthFunction.LESS_OR_EQUAL
        },
        blending : Cesium.BlendingState.ALPHA_BLEND
    });
}

function getTransparentRenderState() {
    return Cesium.RenderState.fromCache({
        cull : {
            enabled : true
        },
        depthTest : {
            enabled : true,
            func : Cesium.DepthFunction.LESS_OR_EQUAL
        },
        blending : Cesium.BlendingState.ALPHA_BLEND
    });
}

function getUniformMap(material, layer, ro) {
    const uniformMap = {
        uGeoMatrix : function() {
            return ro.geoMatrix;
        },
        uTexMatrix : function() {
            return material.texMatrix;
        },
        uFillForeColor : function(){
            if(ro.useLineColor){
                return layer.style3D.lineColor;
            }

            return layer.style3D.fillForeColor;
        },
        uInverseGeoMatrix : function() {
            return ro.invGeoMatrix;
        },
        uTexture : function() {
            return material.textures[0];
        },
        uTexture2 : function() {
            return material.textures[1];
        },
        uTexture0Width : function(){
            return material.textures[0].width;
        },
        uTexture1Width : function(){
            return material.textures[1].width;
        },
        uDiffuseColor : function() {
            return material.diffuseColor;
        },
        uSelectedColor : function() {
            return layer._selectedColor;
        }
    };

    const vertexPackage = ro.vertexPackage;
    const nCompressOptions = vertexPackage.compressOptions;
    if((nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex){
        uniformMap['decode_position_min'] = function() {
            return vertexPackage.minVerticesValue;
        };
        uniformMap['decode_position_normConstant'] = function() {
            return vertexPackage.vertCompressConstant;
        };
    }

    if((nCompressOptions & VertexCompressOption.SVC_Normal) === VertexCompressOption.SVC_Normal){
        uniformMap['normal_rangeConstant'] = function() {
            return vertexPackage.normalRangeConstant;
        };
    }

    if((nCompressOptions & VertexCompressOption.SVC_TexutreCoord) === VertexCompressOption.SVC_TexutreCoord){
        if(vertexPackage.texCoordCompressConstant.length > 0){
            uniformMap['decode_texCoord0_min'] = function() {
                return vertexPackage.minTexCoordValue[0];
            };
            uniformMap['decode_texCoord0_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[0];
            };
            uniformMap['decode_texCoord0_vNormConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[0];
            };

        }
        if(vertexPackage.texCoordCompressConstant.length > 1){
            uniformMap['decode_texCoord1_min'] = function() {
                return vertexPackage.minTexCoordValue[1];
            };
            uniformMap['decode_texCoord1_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[1];
            };
            uniformMap['decode_texCoord1_vNormConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[1];
            };

        }
        if(vertexPackage.texCoordCompressConstant.length > 2){
            uniformMap['decode_texCoord2_min'] = function() {
                return vertexPackage.minTexCoordValue[2];
            };
            uniformMap['decode_texCoord2_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[2];
            };
        }
        if(vertexPackage.texCoordCompressConstant.length > 3){
            uniformMap['decode_texCoord3_min'] = function() {
                return vertexPackage.minTexCoordValue[3];
            };
            uniformMap['decode_texCoord3_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[3];
            };
        }
        if(vertexPackage.texCoordCompressConstant.length > 4){
            uniformMap['decode_texCoord4_min'] = function() {
                return vertexPackage.minTexCoordValue[4];
            };
            uniformMap['decode_texCoord4_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[4];
            };
        }
        if(vertexPackage.texCoordCompressConstant.length > 5){
            uniformMap['decode_texCoord5_min'] = function() {
                return vertexPackage.minTexCoordValue[5];
            };
            uniformMap['decode_texCoord5_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[5];
            };
        }
        if(vertexPackage.texCoordCompressConstant.length > 6){
            uniformMap['decode_texCoord6_min'] = function() {
                return vertexPackage.minTexCoordValue[6];
            };
            uniformMap['decode_texCoord6_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[6];
            };
        }
        if(vertexPackage.texCoordCompressConstant.length > 7){
            uniformMap['decode_texCoord7_min'] = function() {
                return vertexPackage.minTexCoordValue[7];
            };
            uniformMap['decode_texCoord7_normConstant'] = function() {
                return vertexPackage.texCoordCompressConstant[7];
            };
        }
    }

    return uniformMap;
}

S3MCacheFileRenderEntity.prototype.createCommand = function() {
    if(Cesium.defined(this.colorCommand) || this.vertexBufferToCreate.length !== 0 || this.indexBufferToCreate.length !== 0 || this.shaderProgramToCreate.length !== 0) {
        return ;
    }

    let layer = this.layer;
    let context = layer.context;
    let vertexPackage = this.vertexPackage;
    let arrIndexPackage = this.arrIndexPackage;
    let attributes = vertexPackage.vertexAttributes;
    if(arrIndexPackage.length < 1) {
        return ;
    }

    let indexPackage = arrIndexPackage[0];
    let material = this.material;

    this.vertexArray = new Cesium.VertexArray({
        context : context,
        attributes : attributes,
        indexBuffer : indexPackage.indexBuffer
    });

    let primitiveType = Cesium.PrimitiveType.TRIANGLES;
    switch(indexPackage.primitiveType){
        case 1 : primitiveType = Cesium.PrimitiveType.POINTS; break;
        case 2 : primitiveType = Cesium.PrimitiveType.LINES; break;
        case 4 : primitiveType = Cesium.PrimitiveType.TRIANGLES; break;
        default : break;
    }

    this.useLineColor = primitiveType === Cesium.PrimitiveType.LINES;

    this.colorCommand = new Cesium.DrawCommand({
        primitiveType : primitiveType,
        modelMatrix : this.modelMatrix,
        boundingVolume : Cesium.BoundingSphere.clone(this.boundingVolume),
        pickId : this.pickColorIdentifier,
        vertexArray : this.vertexArray,
        shaderProgram : this.shaderProgram,
        pass : material.bTransparentSorting ? Cesium.Pass.TRANSLUCENT : Cesium.Pass.OPAQUE,
        renderState : material.bTransparentSorting ? getTransparentRenderState() : getOpaqueRenderState(),
        instanceCount : vertexPackage.instanceCount
    });

    let uniformMap = getUniformMap(material, layer, this);
    if(this.batchTable){
        uniformMap = this.batchTable.getUniformMapCallback()(uniformMap);
    }

    this.colorCommand.uniformMap = uniformMap;

    this.vertexPackage = undefined;
    this.arrIndexPackage = undefined;
    this.vs = undefined;
    this.fs = undefined;
    this.ready = true;
};

S3MCacheFileRenderEntity.prototype.update = function(frameState, layer) {
    if(!this.ready) {
        this.createBatchTable(frameState);
        this.createPickIds();
        this.createBuffers(frameState);
        this.createShaderProgram(frameState);
        this.createCommand(frameState);
        this.initLayerSetting(layer);
        return ;
    }

    if(this.batchTableDirty){
        this.updateBatchTableAttributes();
        this.batchTableDirty = false;
    }

    if(this.batchTable){
        this.batchTable.update(frameState);
    }

    frameState.commandList.push(this.colorCommand);
};

S3MCacheFileRenderEntity.prototype.isDestroyed = function() {
    return false;
};

S3MCacheFileRenderEntity.prototype.destroy = function() {
    this.shaderProgram = this.shaderProgram && !this.shaderProgram.isDestroyed() && this.shaderProgram.destroy();
    this.vertexArray = this.vertexArray && !this.vertexArray.isDestroyed() && this.vertexArray.destroy();
    this.material = this.material && !this.material.isDestroyed() && this.material.destroy();
    this.batchTable = this.batchTable && !this.batchTable.isDestroyed() && this.batchTable.destroy();
    this.colorCommand = undefined;
    this.vertexPackage = null;
    this.arrIndexPackage = null;
    this.modelMatrix = undefined;
    this.pickInfo = undefined;
    this.selectionInfoMap = undefined;
    this.vs = undefined;
    this.fs = undefined;
    return Cesium.destroyObject(this);
};

export default S3MCacheFileRenderEntity;