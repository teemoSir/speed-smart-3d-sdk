import SpeedLayer from './base/speedLayer'
import * as Cesium from "cesium";


class KmlLayer extends SpeedLayer {
	constructor(viewer) {
		super(viewer)
		this.viewer = viewer
	}

	LoadKmlLayer(options) {
		let kmlDataPromise = Cesium.KmlDataSource.load(options.url, {
			camera: this.viewer.scene.camera,
			canvas: this.viewer.scene.canvas,
			clampToGround: options.clampToGround
		});
		return kmlDataPromise
	}


}
export default KmlLayer
