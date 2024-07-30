import pickModelFeatureEvent from "../event/pickModelFeatureEvent";

/**
 * 高亮模型要素类
 */
class featureProperty {

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

	property=[]

	constructor(options) {
		this.init(options);
		return this;
	}

	destroy() {
		if (this.pickFeatureEvent && this.pickFeatureEvent._handler) {
			this.pickFeatureEvent.property = [];
			this.pickFeatureEvent._handler.destroy();
			this.pickFeatureEvent = undefined;
		}
	}

	init(options) {
		this.destroy()
		let that = this
		this.pickFeatureEvent = new pickModelFeatureEvent({
			speedViewer: options.viewer
		});
		this.pickFeatureEvent.pickFeatureProperty(options)
	}

}

export default featureProperty
