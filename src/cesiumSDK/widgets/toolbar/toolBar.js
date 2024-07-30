import * as Cesium from "cesium";
import Speed from '../../core/speed'
import { zepto } from "../../core/util/zepto";

/**
 * 工具栏按钮
 */
class toolBar extends Speed {

	static loadToolBar(viewer, options) {
		var toolbar = zepto(".cesium-viewer-toolbar")
		toolbar.css({
			position: "absolute",
			top: 'unset',
			right: 'unset',
			left: options.toolBar.style.left,
			bottom: options.toolBar.style.bottom,
			display: "flex",
			flexDirection: "column",
			textAlign:"left"
		});


		zepto(".cesium-sceneModePicker-wrapper").css({
			width: "120px",
			height: "38px",
		})


		zepto(".cesium-baseLayerPicker-dropDown").css({
			top: "unset",
			right: "unset",
			left: "40px",
			bottom: "5%",
			backgroundColor: "rgb(16 48 76 / 80%)",
			borderColor: "rgb(1 149 248)",
		})
		zepto(".cesium-baseLayerPicker-choices").css({
			borderColor: "rgb(1 149 248)"
		})

		zepto(".cesium-navigation-help").css({
			top: "unset",
			right: "unset",
			left: "40px",
			bottom: "5%",
			backgroundColor: "rgb(16 48 76 / 80%)",
		})

		var domFull = zepto(".cesium-fullscreenButton");
		domFull.removeClass("cesium-viewer-fullscreenContainer");
		toolbar.append(domFull);
		domFull.css({
			width: '32px',
			height: '32px',
			borderRadius: '14%',
			marginLeft: '2px'
		})

		if (options.zoom) {
			var zoominBtnHtml = '<button class="cesium-button cesium-toolbar-button zoomin-button" title="放大"><img src=' + require("@/assets/img/放大.png") + '></button>'
			toolbar.append(zoominBtnHtml);
			zepto(".zoomin-button").on('click', function (e) {
				let position = viewer.camera.position;
				let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
				let moveRate = cameraHeight / 20.0;
				viewer.camera.moveForward(moveRate);
			})

			var zoomoutBtnHtml = '<button class="cesium-button cesium-toolbar-button zoomout-button" title="缩小"><img src=' + require("@/assets/img/缩小.png") + '></button>'
			toolbar.append(zoomoutBtnHtml);
			zepto(".zoomout-button").on('click', function (e) {
				let position = viewer.camera.position;
				let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
				let moveRate = cameraHeight / 20.0;
				viewer.camera.moveBackward(moveRate);
			})
		}

		// var view2DBtnHtml = '<button class="cesium-button cesium-toolbar-button view2D-button" title="二维视图"><img src=' + require("@/assets/img/二维视图.png") + '></button>'
		// toolbar.append(view2DBtnHtml);
		// zepto(".view2D-button").on('click', function (e) {
		// 	viewer.scene.morphTo2D(1);//二维
		// })
		// var view3DBtnHtml = '<button class="cesium-button cesium-toolbar-button view3D-button" title="三维视图"><img src=' + require("@/assets/img/三维视图.png") + '></button>'
		// toolbar.append(view3DBtnHtml);
		// zepto(".view3D-button").on('click', function (e) {
		// 	viewer.scene.morphTo3D(1);
		// })


		zepto(".cesium-button").css({
			background: "rgb(17 92 146 / 80%)",
			borderColor: "rgb(17 92 146 / 80%)",
			marginRight: "0.4rem !important"
		})



	}
}
export default toolBar
