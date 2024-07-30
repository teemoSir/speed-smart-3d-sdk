import Speed from '../../core/speed'
import * as Cesium from "cesium";
import baseMapLayer from '../../core/layer/baseMapLayer.js';

class mapSplit extends Speed {
	constructor(viewer, options,element) {
		super(viewer, options)
		this.viewer = viewer;
		this.options = options;
		this.slider=element
        this.moveActive = false;

		this.addSplit()
	}

	addSplit(){
		let layer1 =undefined
		let layer2 =undefined
		let layers = this.viewer.imageryLayers;
		for (let index = 0; index < this.options.leftLayer.length; index++) {
			const item = this.options.leftLayer[index];
			layer1 = baseMapLayer.getImageryProviderNew(item);
			if(layer1!=undefined){
				break
			}
		}
		for (let index = 0; index < this.options.rightLayer.length; index++) {
			const item = this.options.rightLayer[index];
			layer2 = baseMapLayer.getImageryProviderNew(item);
			if(layer2!=undefined){
				break
			}
		}

		let earthAtLeft = layers.addImageryProvider(layer1.layer);
		let earthAtRight = layers.addImageryProvider(layer2.layer);
		earthAtLeft.splitDirection = Cesium.SplitDirection.LEFT;
		earthAtRight.splitDirection = Cesium.SplitDirection.RIGHT;

		this.viewer.scene.splitPosition =
				this.slider.offsetLeft / this.slider.parentElement.offsetWidth;

			this.handler = new Cesium.ScreenSpaceEventHandler(this.slider);

			let that=this
			this.handler.setInputAction(function () {
				that.moveActive = true;
			}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
			this.handler.setInputAction(function () {
				that.moveActive = true;
			}, Cesium.ScreenSpaceEventType.PINCH_START);


			const mouseHandler = function (movement) {
				if (!that.moveActive) {
					return;
				}
				const relativeOffset = movement.endPosition.x;
				const splitPosition =
					(that.slider.offsetLeft + relativeOffset) /
					that.slider.parentElement.offsetWidth;
					that.slider.style.left = `${100.0 * splitPosition}%`;
					that.viewer.scene.splitPosition = splitPosition;

			}
			this.handler.setInputAction(mouseHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			this.handler.setInputAction(mouseHandler, Cesium.ScreenSpaceEventType.PINCH_MOVE);

			this.handler.setInputAction(function () {
				that.moveActive = false;
			}, Cesium.ScreenSpaceEventType.LEFT_UP);
			this.handler.setInputAction(function () {
				that.moveActive = false;
			}, Cesium.ScreenSpaceEventType.PINCH_END);

	}

	move(movement) {

		let that=this
		if (!that.moveActive) {
			return;
		}

		const relativeOffset = movement.endPosition.x;
		const splitPosition =
			(this.slider.offsetLeft + relativeOffset) /
			this.slider.parentElement.offsetWidth;
		this.slider.style.left = `${100.0 * splitPosition}%`;
		this.viewer.scene.splitPosition = splitPosition;
	}
}
export default mapSplit;
