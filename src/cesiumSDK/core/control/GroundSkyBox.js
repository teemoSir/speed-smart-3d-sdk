import Control from './base/control'
import * as Cesium from 'cesium'


/**
 * 近地天空盒子
 */
class GroundSkyBox extends Control {

	constructor(options) {
		super(options)
		this.sources = this.options.sources;
		this._sources = undefined;
		this.show = Cesium.defaultValue(this.options.show, true);
		this._command = new Cesium.DrawCommand({
			modelMatrix: Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY),
			owner: this
		});
		this._cubeMap = undefined;
		this._attributeLocations = undefined;
		this._useHdr = undefined;
		this.skyboxMatrix3 = new Cesium.Matrix3();


		//片元着色器，直接从源码复制
		this.SkyBoxFS = `uniform samplerCube u_cubeMap;
		varying vec3 v_texCoord;
		void main()
		{
		vec4 color = textureCube(u_cubeMap, normalize(v_texCoord));
		gl_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);
		}
		`;

		//顶点着色器有修改，主要是乘了一个旋转矩阵
		this.SkyBoxVS = `attribute vec3 position;
		varying vec3 v_texCoord;
		uniform mat3 u_rotateMatrix;
		void main()
		{
		vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));
		gl_Position = czm_projection * vec4(p, 1.0);
		v_texCoord = position.xyz;
		}`;

		this.updateSkyBox(frameState, this.useHdr)
	}



	updateSkyBox(frameState, useHdr) {
		const that = this;

		if (!this.show) {
			return undefined;
		}

		if ((frameState.mode !== Cesium.SceneMode.SCENE3D) &&
			(frameState.mode !== Cesium.SceneMode.MORPHING)) {
			return undefined;
		}

		if (!frameState.passes.render) {
			return undefined;
		}

		const context = frameState.context;

		if (this._sources !== this.sources) {
			this._sources = this.sources;
			const sources = this.sources;

			if ((!Cesium.defined(sources.positiveX)) ||
				(!Cesium.defined(sources.negativeX)) ||
				(!Cesium.defined(sources.positiveY)) ||
				(!Cesium.defined(sources.negativeY)) ||
				(!Cesium.defined(sources.positiveZ)) ||
				(!Cesium.defined(sources.negativeZ))) {
				throw new Cesium.DeveloperError('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
			}

			if ((typeof sources.positiveX !== typeof sources.negativeX) ||
				(typeof sources.positiveX !== typeof sources.positiveY) ||
				(typeof sources.positiveX !== typeof sources.negativeY) ||
				(typeof sources.positiveX !== typeof sources.positiveZ) ||
				(typeof sources.positiveX !== typeof sources.negativeZ)) {
				throw new Cesium.DeveloperError('this.sources properties must all be the same type.');
			}

			if (typeof sources.positiveX === 'string') {
				// Given urls for cube-map images. Load them.
				Cesium.loadCubeMap(context, this._sources).then(function (cubeMap) {
					that._cubeMap = that._cubeMap && that._cubeMap.destroy();
					that._cubeMap = cubeMap;
				});
			} else {
				this._cubeMap = this._cubeMap && this._cubeMap.destroy();
				this._cubeMap = new Cesium.CubeMap({
					context: context,
					source: sources
				});
			}
		}

		const command = this._command;

		command.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(frameState.camera._positionWC);
		if (!Cesium.defined(command.vertexArray)) {
			command.uniformMap = {
				u_cubeMap: function () {
					return that._cubeMap;
				},
				u_rotateMatrix: function () {
					return Cesium.Matrix4.getRotation(command.modelMatrix, this.skyboxMatrix3);
				},
			};

			const geometry = Cesium.BoxGeometry.createGeometry(Cesium.BoxGeometry.fromDimensions({
				dimensions: new Cesium.Cartesian3(2.0, 2.0, 2.0),
				vertexFormat: Cesium.VertexFormat.POSITION_ONLY
			}));
			const attributeLocations = this._attributeLocations = Cesium.GeometryPipeline.createAttributeLocations(geometry);

			command.vertexArray = Cesium.VertexArray.fromGeometry({
				context: context,
				geometry: geometry,
				attributeLocations: attributeLocations,
				bufferUsage: Cesium.BufferUsage._DRAW
			});

			command.renderState = Cesium.RenderState.fromCache({
				blending: Cesium.BlendingState.ALPHA_BLEND
			});
		}

		if (!Cesium.defined(command.shaderProgram) || this._useHdr !== useHdr) {
			const fs = new Cesium.ShaderSource({
				defines: [useHdr ? 'HDR' : ''],
				sources: [this.SkyBoxFS]
			});
			command.shaderProgram = Cesium.ShaderProgram.fromCache({
				context: context,
				vertexShaderSource: this.SkyBoxVS,
				fragmentShaderSource: fs,
				attributeLocations: this._attributeLocations
			});
			this._useHdr = useHdr;
		}

		if (!Cesium.defined(this._cubeMap)) {
			return undefined;
		}

		return command;
	}

	destroy() {
		const command = this._command;
		command.vertexArray = command.vertexArray && command.vertexArray.destroy();
		command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
		this._cubeMap = this._cubeMap && this._cubeMap.destroy();
		return Cesium.destroyObject(this);
	}


	// let groundSkybox = new Speed.GroundSkyBox({
		// 	sources: {
		// 		negativeX: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Left.jpg',
		// 		positiveX: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Right.jpg',
		// 		negativeY: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Back.jpg',
		// 		positiveY: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Front.jpg',
		// 		negativeZ: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Down.jpg',
		// 		positiveZ: 'http://localhost:8080/Apps/Sandcastle/images/skybox/sm/Up.jpg'
		// 	}
		// })
		// // 自带的默认天空盒
		// let defaultSkybox = this.map._viewer.scene.skyBox;

		// let that=this
		// // 渲染前监听并判断相机位置
		// this.map._viewer.scene.preUpdate.addEventListener(() => {
		// 	let position = that.map._viewer.scene.camera.position;
		// 	let cameraHeight = Cesium.Cartographic.fromCartesian(position).height;
		// 	if (cameraHeight < 240000) {
		// 		that.map._viewer.scene.skyBox = groundSkybox;
		// 		that.map._viewer.scene.skyAtmosphere.show = false;
		// 	} else {
		// 		that.map._viewer.scene.skyBox = defaultSkybox;
		// 		that.map._viewer.scene.skyAtmosphere.show = true;
		// 	}
		// })

}



export default GroundSkyBox;
