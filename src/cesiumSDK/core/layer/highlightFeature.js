import pickModelFeatureEvent from "../event/pickModelFeatureEvent";

/**
 * 高亮模型要素类
 */
class highlightFeature {

	/**
	 * @member {pickFeatureEvent}点击事件
	 * @memberof Visible
	 */
	pickFeatureEvent;

	/**
	 * @member {Cesium.Viewer} 这是cessium的viewer对象
	 * @memberof Visible
	 */
	_viewer;

	constructor(options) {
		options.border = options.border == undefined ? false : options.border;//如果为true只高亮边界
		this.init(options);
		return this;
	}

	destroy() {
		if (this.pickFeatureEvent && this.pickFeatureEvent._handler) {
			if(this.pickFeatureEvent._silhouette && this.pickFeatureEvent._silhouette.selected){
				this.pickFeatureEvent._silhouette.selected = [];
			}
			if (this.pickFeatureEvent.hightLighted.feature) {
				this.pickFeatureEvent.hightLighted.feature.color = this.pickFeatureEvent.hightLighted.originalColor;
				this.pickFeatureEvent.hightLighted.feature = undefined;
			}
			this.pickFeatureEvent.hightLighted=undefined;
			this.pickFeatureEvent._handler.destroy();
			this.pickFeatureEvent = undefined;
		}
	}

	init(options) {
		this.destroy()
		let speedViewer = options.speedViewer;
		this.pickFeatureEvent = new pickModelFeatureEvent({
			speedViewer: speedViewer,
		});
		this.pickFeatureEvent.pickFeature(options)

	}

}

export default highlightFeature;
