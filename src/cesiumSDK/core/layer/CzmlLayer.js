import SpeedLayer from './base/speedLayer'
import * as Cesium from "cesium";


class CzmlLayer extends SpeedLayer {
	constructor(viewer) {
		super(viewer)
		this.viewer = viewer
	}

	LoadCzmlLayer(options) {
		let czmlDataPromise = Cesium.CzmlDataSource.load(options.url);
		return czmlDataPromise
	}


}
export default CzmlLayer
