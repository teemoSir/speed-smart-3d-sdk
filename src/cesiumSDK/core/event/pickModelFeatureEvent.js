import SpeedEvent from "./base/speedEvent";
import * as Cesium from "cesium";

/**
 * BIM模型要素点击高亮时间
 */
class pickModelFeatureEvent extends SpeedEvent {

	constructor(options) {
		super(options);
		this._viewer = options.speedViewer;
		this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
	}

	_handler;
	_silhouette;

	hightLighted = {
		feautre: undefined,
		originalColor: new Cesium.Color(),
	}

	property = [];

	pickFeature(options) {
		let that = this
		if (options.border) {
			this._silhouette = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
			this._silhouette.uniforms.color = Cesium.defaultValue(options.color,Cesium.Color.GREENYELLOW);
			this._silhouette.uniforms.length = Cesium.defaultValue(options.length,0.01) ;
			this._silhouette.selected = [];

			this._viewer.scene.postProcessStages.removeAll()
			this._viewer.scene.postProcessStages.add(
				Cesium.PostProcessStageLibrary.createSilhouetteStage([
					this._silhouette,
				])
			);
		}

		this._handler.setInputAction(function (event) {
			// 选择新要素
			const pickedFeature = that._viewer.scene.pick(event.position);
			if (options.border) {//高亮轮廓
				// 清除之前的高亮元素
				that._silhouette.selected = [];
				if (!Cesium.defined(pickedFeature)) {
					return;
				}
				if (that._silhouette.selected[0] === pickedFeature) {
					return;
				}
				// 高亮新选择的要素
				that._silhouette.selected = [pickedFeature];
			}else{
				// 清除之前的高亮元素
				if (Cesium.defined(that.hightLighted.feature)) {
					that.hightLighted.feature.color = that.hightLighted.originalColor;
					that.hightLighted.feature = undefined;
				}
				// 选择新要素
				if (!Cesium.defined(pickedFeature)) {
					return;
				}

				// 存储选中要素的信息
				that.hightLighted.feature = pickedFeature;
				Cesium.Color.clone(
					pickedFeature.color,
					that.hightLighted.originalColor
				);
				// 高亮选中元素
				pickedFeature.color = Cesium.defaultValue(options.color,Cesium.Color.YELLOW);
			}

		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	}


	pickFeatureProperty(options) {
		let that = this
		this._handler.setInputAction(function (event) {
			// 选择新要素
			const pickedFeature = that._viewer.scene.pick(event.position);
			that.property = []
			if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
				const propertyIds = pickedFeature.getPropertyIds();
				const length = propertyIds.length;
				for (let i = 0; i < length; ++i) {
					let map = {};
					const propertyId = propertyIds[i];
					map.value = pickedFeature.getProperty(propertyId);
					map.key = propertyId;
					that.property.push(map)

				}

				options.success(that.property)
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


	}


}

export default pickModelFeatureEvent;
