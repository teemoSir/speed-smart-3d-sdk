import * as Cesium from "cesium";
import Speed from '../../core/speed'
import CesiumNavigation from "cesium-navigation-es6"
import { zepto } from "../../core/util/zepto";

/**
 * 工具栏按钮
 */
class navigationControl extends Speed {
	constructor(viewer, options) {
		super(viewer, options)
		if (!viewer) return
		this.viewer = viewer
		this.options = options

		this.addNavigationWidget()

	}

	addNavigationWidget() {
		const opts = {};
		// 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
		opts.defaultResetView = Cesium.Rectangle.fromDegrees(110, 20, 120, 30);
		//相机方向
		opts.orientation = {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-90),
			roll: Cesium.Math.toRadians(0)
		}
		//相机延时
		opts.duration = 4//默认为3s
		// 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
		opts.enableCompass = this.options.compass != undefined ? Cesium.defaultValue(this.options.compass.show, false) : false;
		// 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
		opts.enableZoomControls = this.options.zoom != undefined ? Cesium.defaultValue(this.options.zoom.show, true) : true;
		// 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
		opts.enableDistanceLegend = this.options.legend != undefined ? Cesium.defaultValue(this.options.legend.show, false) : false;
		// 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
		opts.enableCompassOuterRing = this.options.compass != undefined ? Cesium.defaultValue(this.options.compass.show, false) : false;

		//修改重置视图的tooltip
		opts.resetTooltip = "重置视图";
		//修改放大按钮的tooltip
		opts.zoomInTooltip = "放大";
		//修改缩小按钮的tooltip
		opts.zoomOutTooltip = "缩小";

		new CesiumNavigation(this.viewer, opts);

		//比例尺
		zepto(".distance-legend").css({
			left: "-10px",
			bottom: "-1px",
			border: "none",
			background: "rgba(0, 0, 0, 0)",
			zIndex: "99"
		});
		if (this.options.legend) {
			let css = this.options.legend.style;
			if (Cesium.defined(css.bottom) && css.bottom != "auto") {
				css.bottom = this.viewer.timeline ? "25px" : css.bottom;
			}
			if (Cesium.defined(css.left) && css.left != "auto") {
				css.left = this.viewer.animation ? "170px" : css.left;
			}

			zepto(".distance-legend").css(css);

		} else {
			zepto(".distance-legend").remove();
		}

		//导航球
		if (this.options.compass) {
			let css = this.options.compass.style;

			if (!Cesium.defined(css.bottom) && css.bottom != "auto") {
				css.bottom = "auto";
			}
			if (!Cesium.defined(css.top) && css.top != "auto") {
				css.top = "auto";
			}
			if (!Cesium.defined(css.left) && css.left != "auto") {
				css.left = "auto";
			}
			if (!Cesium.defined(css.right) && css.right != "auto") {
				css.right = "auto";
			}
			zepto(".compass").css(css);
		} else {
			zepto(".compass").remove();
		}

		zepto(".navigation-controls").remove();

		zepto(".compass-outer-ring-background").css({
			borderColor: "rgb(22 37 47 / 80%)",
		});
		zepto(".compass-gyro-background").css({
			backgroundColor:"rgb(22 37 47 / 80%)",
			borderColor: "rgb(22 37 47 / 80%)"
		})
		zepto(".compass-gyro").css({
			fill:"#0099ff"
		})
		zepto(".compass-outer-ring").css({
			fill:"rgb(0 153 255 / 50%)"
		})
	}

}
export default navigationControl
