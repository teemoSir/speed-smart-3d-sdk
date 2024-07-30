/*
 * 自定义弹窗
 */
import * as Cesium from "cesium";
import { zepto } from "../../core/util/zepto";


class PopupWindow {
	constructor(viewer, options) {
		if (!viewer) throw new Error("no viewer object!");
		this.viewer = viewer;
		this.options = options
		this.initPopup()
		this.mouseClick()
	}
	initPopup() {
		let inhtml = '<div id="popup-view" class="popup" ><el-button class="popup-close-button popup-color" >×</el-button><div class="popup-background" ><div id="tooltip-content" class="popup-content popup-color"></div></div><div class="popup-tip-container"><div class="popup-tip popup-background"></div></div></div>';
		zepto("#" + this.viewer._container.id).append(inhtml);
		let popDiv = zepto(".popup")
		popDiv.css({
			position: "absolute",
			left: "0",
			top: "5px",
			textAlign: "left",
			zIndex: "9999",
			display: "none"
		})
		let popBackground = zepto(".popup-background")
		popBackground.css({
			background: "rgba(28, 57, 77, 0.7)",
			borderRadius: "6px",
			padding: "1px 0"
		})

		let popcolor = zepto(".popup-color")
		popcolor.css({
			color: "white"
		})
		let popcontent = zepto(".popup-content")
		popcontent.css({
			margin: "15px 10px 10px",
			lineHeight: "1.4",
			fontSize: "13px",
			// maxWidth: "439px",
			// minWidth: "50px"
		})
		let popupContainer = zepto(".popup-tip-container")
		popupContainer.css({
			margin: "0 auto",
			width: "40px",
			height: "13px",
			position: "relative",
			overflow: "hidden",
		})
		let popupTip = zepto(".popup-tip")
		popupTip.css({
			boxShadow: "0 3px 14px rgba(0, 0, 0, .4)",
			width: "17px",
			height: "17px",
			padding: "1px",
			margin: "-10px auto 0",
			transform: "rotate(45deg)"
		})
		let closeBtn = zepto(".popup-close-button")
		closeBtn.css({
			position: "absolute",
			top: 0,
			right: 0,
			padding: "4px",
			// textAlign: "center",
			width: "20px",
			height: "20px",
			// textDecoration: "none",
			// fontWeight: "bold",
			// background: "transparent",
			// zIndex: "9999",
			cursor: "pointer",
		})
		closeBtn.on('click', function (e) {
			let popupHtml = document.getElementById("popup-view");
			popupHtml.style.display = 'none';
		})
	}

	mouseClick() {
		let that = this
		this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
		this.handler.setInputAction((pick) => {
			let pickedObject = that.viewer.scene.pick(pick.position);
			let cartesian = that.viewer.scene.pickPosition(pick.position);
			let position = undefined
			if (Cesium.defined(cartesian)) {
				let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				let lon = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
				let lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
				let height = Number(cartographic.height.toFixed(2));
				position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
			}
			if (Cesium.defined(pickedObject)) {
				if (Cesium.defined(pickedObject.id) && pickedObject.id instanceof Cesium.Entity) {
					let entity = pickedObject.id;
					if (Cesium.defined(entity.popup)) {
						that.newPopup(position)
					}
				}
				//单体化3dtiles数据的处理(如：BIM的构件，城市白膜建筑)
				else if (Cesium.defined(pickedObject.tileset) && Cesium.defined(pickedObject.getProperty)) {
					//取属性
					var attr = {};
					var names = pickedObject.getPropertyNames();
					for (var i = 0; i < names.length; i++) {
						var name = names[i];
						if (!pickedObject.hasProperty(name)) continue;

						var val = pickedObject.getProperty(name);
						if (val == null) continue;
						attr[name] = val;
					}
				}
				else if (Cesium.defined(pickedObject.primitive)) {
					let primitive = pickedObject.primitive;
					if (Cesium.defined(primitive.popup)) {
						that.newPopup(position, primitive.properties)
					} else {
						this.remove()
					}
				}
			} else {
				this.remove()
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


	}
	newPopup(position, properties) {
		let viewer = this.viewer;
		let popContent = zepto(".popup-content")
		popContent.empty()
		if (this.options.popup instanceof Array) {
			let keys = Object.keys(properties)
			let inthtml = `<table>`
			for (let index = 0; index < this.options.popup.length; index++) {
				const option = this.options.popup[index];
				for (let index = 0; index < keys.length; index++) {
					if (option.field.toUpperCase() == keys[index].toUpperCase()) {
						let value = properties[keys[index]]
						inthtml += `<tr><td >` + option.name + `：</td><td >` + value + ` </td></tr>`
						break
					}
				}
			}
			inthtml += ` </table>`
			popContent.append(inthtml)
		} else {
			popContent.append(this.options.popup)
		}

		let popupHtml = document.getElementById("popup-view");
		popupHtml.style.display = "block";
		viewer.scene.preRender.addEventListener(function () {
			let canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
				position
			);
			if (Cesium.defined(canvasPosition)) {
				popupHtml.style.position = "fixed"
				popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight + "px";
				popupHtml.style.left = canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
			}
		});

	}
	remove() {
		let popContent = zepto(".popup-content")
		popContent.empty()
		let popup = zepto(".popup")
		popup.hide()

	}

}
export default PopupWindow;
