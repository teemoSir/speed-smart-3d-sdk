/*
 * 编辑gltf主类
 */
import CoordTransform from "../util/CoordTransform";
import * as Cesium from 'cesium'

class EditGltf4Entity {
	/**
	 * gltf模型编辑-Entity形式
	 * @param {Viewer} viewer
	 * @param {*} gltf
	 */
	constructor(viewer, gltf, d, r) {
		if (!viewer) throw new Error("viewer is required!");
		this._viewer = viewer;
		this._gltf = gltf;
		this._handler = undefined;
		this._defaultWidth = 15; //默认指示线的宽度
		this._currentPick = undefined;
		this._dStep = d;
		this._rStep = r;
		this._params = {
			tx: 0, //模型中心X轴坐标（经度，单位：十进制度）
			ty: 0, //模型中心Y轴坐标（纬度，单位：十进制度）
			tz: 0, //模型中心Z轴坐标（高程，单位：米）
			heading: 0,
			pitch: 0,
			roll: 0,
			scale: 1, //放大倍比
		};
		this._coordArrows = undefined; //平移指示器
		this._coordCircle = []; //旋转指示器
		this.initEvent();
	}
	get params() {
		return this._params;
	}
	initParam() {
		this.removeAllTools();
		let gltf = this._gltf;
		const length = 1000;
		const originDegree = this.returnGltfCentorDegree(gltf);
		const originRotation = this.returnGltfRotation(gltf);
		this._params.tx = originDegree.lng;
		this._params.ty = originDegree.lat;
		this._params.tz = originDegree.alt;
		this._params.heading = originRotation.heading;
		this._params.pitch = originRotation.pitch;
		this._params.roll = originRotation.roll;
		return { originDegree, length };
	}
	returnGltfRotation(gltf) {
		const orientation = gltf.orientation.getValue(Cesium.JulianDate.now());
		const position = gltf.position.getValue(Cesium.JulianDate.now());
		var mtx3 = Cesium.Matrix3.fromQuaternion(orientation);

		var mtx4 = Cesium.Matrix4.fromRotationTranslation(
			mtx3,
			position,
			new Cesium.Matrix4()
		);

		var hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(
			mtx4,
			this._viewer.scene.globe.ellipsoid
		);
		return hpr;
	}
	returnGltfCentor(gltf) {
		let gltfCenter = gltf.position.getValue(Cesium.JulianDate.now());
		return gltfCenter;
	}
	returnGltfCentorDegree(gltf) {
		let gltfCenter = this.returnGltfCentor(gltf);
		const originDegree = CoordTransform.transformCartesianToWGS84(
			this._viewer,
			gltfCenter
		);
		return originDegree;
	}
	/**
	 * 开始旋转编辑
	 */
	editRtation() {
		const option = this.initParam();
		this.createCircle(
			option.originDegree.lng,
			option.originDegree.lat,
			option.originDegree.alt,
			option.length
		);
	}
	createCircle(lon, lat, height, radius) {
		const position = [];
		for (let i = 0; i <= 360; i += 3) {
			const sin = Math.sin(Cesium.Math.toRadians(i));
			const cos = Math.cos(Cesium.Math.toRadians(i));
			const x = radius * cos;
			const y = radius * sin;
			position.push(new Cesium.Cartesian3(x, y, 0));
		}
		const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(
			new Cesium.Cartesian3.fromDegrees(lon, lat, height)
		);
		//绕Z轴
		const axisSphereZ = this.createAxisSphere(
			"model_edit_zCircle",
			position,
			matrix,
			Cesium.Color.RED
		);
		this._viewer.scene.primitives.add(axisSphereZ);

		//绕Y周
		const axisSphereY = this.createAxisSphere(
			"model_edit_yCircle",
			position,
			matrix,
			Cesium.Color.BLUE
		);
		this._viewer.scene.primitives.add(axisSphereY);
		let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90));
		let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
		Cesium.Matrix4.multiply(
			axisSphereY.geometryInstances.modelMatrix,
			rotationY,
			axisSphereY.geometryInstances.modelMatrix
		);

		//绕X周
		const axisSphereX = this.createAxisSphere(
			"model_edit_xCircle",
			position,
			matrix,
			Cesium.Color.GREEN
		);
		this._viewer.scene.primitives.add(axisSphereX);
		let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90));
		let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
		Cesium.Matrix4.multiply(
			axisSphereX.geometryInstances.modelMatrix,
			rotationX,
			axisSphereX.geometryInstances.modelMatrix
		);
	}
	createAxisSphere(name, position, matrix, color) {
		let result = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				id: name,
				geometry: new Cesium.PolylineGeometry({
					positions: position,
					width: 5,
				}),
				attributes: {
					color: Cesium.ColorGeometryInstanceAttribute.fromColor(
						color
					),
				},
			}),
			releaseGeometryInstances: false,
			appearance: new Cesium.PolylineColorAppearance({
				translucent: false,
			}),
			modelMatrix: matrix,
		});
		result._name = name;
		this._coordCircle.push(result);
		return result;
	}
	//修改模型透明度和可选择性
	onEdit(bool) {
		const color = bool ? Cesium.Color.GREEN.withAlpha(0.5) : undefined;
		// this._gltf.model.color = color;
		// this._gltf._allowPicking = !bool;
	}
	/**
	 * 开始编辑平移
	 */
	editTranslation() {
		const option = this.initParam();
		console.log(option);
		// eslint-disable-next-line no-unreachable
		this.onEdit(true);
		const length = option.length;
		let translateCartesian = new Cesium.Cartesian3(length, length, length); //单位为米
		let originPos = this.returnGltfCentor(this._gltf);
		let targetDegree = this.getTransPostion(originPos, translateCartesian);
		this.initLineArrow(option.originDegree, targetDegree, length);
	}
	updateLineArrow(gltf, originDegree) {
		this.removeCoordArrows();
		const length = 1000;
		let translateCartesian = new Cesium.Cartesian3(length, length, length); //单位为米
		let originPos = this.returnGltfCentor(this._gltf);
		let targetDegree = this.getTransPostion(originPos, translateCartesian);
		this.initLineArrow(originDegree, targetDegree, length);
	}
	//初始化鼠标事件（移动，按下，抬起）
	initEvent() {
		const $this = this;
		const viewer = this._viewer;
		$this._handler = new Cesium.ScreenSpaceEventHandler(
			viewer.scene.canvas
		);
		$this._handler.setInputAction(function (event) {
			let pick = viewer.scene.pick(event.position); //获取的pick对象
			console.log(pick);
			if (
				pick &&
				pick.primitive &&
				pick.primitive._name &&
				pick.primitive._name.indexOf("model_edit") != -1
			) {
				viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
				//高亮加粗显示
				$this._currentPick = pick.primitive;
				$this._currentPick.width = 25;
				let downPos = viewer.scene.camera.pickEllipsoid(
					event.position,
					viewer.scene.globe.ellipsoid
				);
				let downMatrix = undefined;
				let _tx = 0,
					_ty = 0,
					_tz = 0; //xyz方向的平移量（经纬度，经纬度，米）
				let _rx = 0,
					_ry = 0,
					_rz = 0; //xyz方向的旋转量（度）
				// 防止点击到地球之外报错，加个判断
				if (downPos && Cesium.defined(downPos)) {
					_tx = 0;
					_ty = 0;
					_tz = 0;
					_rx = 0;
					_ry = 0;
					_rz = 0;
					const downDegree = CoordTransform.transformCartesianToWGS84(
						viewer,
						downPos
					);
					$this._handler.setInputAction(function (movement) {
						let endPos = viewer.scene.camera.pickEllipsoid(
							movement.endPosition,
							viewer.scene.globe.ellipsoid
						);
						const endDegree =
							CoordTransform.transformCartesianToWGS84(
								viewer,
								endPos
							);
						const _yPix = movement.endPosition.y - event.position.y;
						const _xPix = movement.endPosition.x - event.position.x;
						switch ($this._currentPick._name) {
							case "model_edit_xArrow":
								_tx = endDegree.lng - downDegree.lng;
								break;
							case "model_edit_yArrow":
								_ty = endDegree.lat - downDegree.lat;
								break;
							case "model_edit_zArrow":
								_tz = -$this._dStep * _yPix;
								break;
							case "model_edit_xCircle":
								_rx = $this._rStep * _yPix;
								break;
							case "model_edit_yCircle":
								_ry = $this._rStep * _xPix;
								break;
							case "model_edit_zCircle":
								_rz = $this._rStep * _xPix;
								break;
						}
						$this.updateModel(
							$this._params,
							_tx,
							_ty,
							_tz,
							_rx,
							_ry,
							_rz,
							downMatrix
						);
					}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				}

				$this._handler.setInputAction(function () {
					viewer.scene.screenSpaceCameraController.enableRotate = true; // 取消相机锁定
					$this._currentPick.width = $this._defaultWidth;
					$this._currentPick = undefined;
					$this._params.tx += _tx;
					$this._params.ty += _ty;
					$this._params.tz += _tz;
					let hpr = $this.returnGltfRotation($this._gltf);
					$this._params.heading = hpr.heading;
					$this._params.pitch = hpr.pitch;
					$this._params.roll = hpr.roll;
					//为viewer绑定LEFT_UP事件监听器（执行函数，监听的事件）
					$this._handler.removeInputAction(
						Cesium.ScreenSpaceEventType.MOUSE_MOVE
					); // 解除viewer的LEFT_UP事件监听器
					$this._handler.removeInputAction(
						Cesium.ScreenSpaceEventType.LEFT_UP
					); // 解除viewer的LEFT_UP事件监听器
				}, Cesium.ScreenSpaceEventType.LEFT_UP);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	}
	//更新模型位置
	updateModel(params, _tx, _ty, _tz, _rx, _ry, _rz) {
		if (this._coordArrows) {
			let cartesian = new Cesium.Cartesian3.fromDegrees(
				params.tx + _tx,
				params.ty + _ty,
				params.tz + _tz
			);
			this._gltf.position = cartesian;
			this.updateLineArrow(this._gltf, {
				lng: params.tx + _tx,
				lat: params.ty + _ty,
				alt: params.tz + _tz,
			}); //如果是平移操作，需要更新平移指示器
		}
		if (this._coordCircle) {
			const rx = Cesium.Math.toDegrees(this._params.heading);
			const ry = Cesium.Math.toDegrees(this._params.pitch);
			const rz = Cesium.Math.toDegrees(this._params.roll);
			let hpr = new Cesium.HeadingPitchRoll(
				Cesium.Math.toRadians(rx + _rx),
				Cesium.Math.toRadians(ry + _ry),
				Cesium.Math.toRadians(rz + _rz)
			);
			let orientation = Cesium.Transforms.headingPitchRollQuaternion(
				this._gltf.position.getValue(Cesium.JulianDate.now()),
				hpr
			);
			this._gltf.orientation = orientation;
		}
	}
	//绘制箭头
	initLineArrow(originDegree, targetDegree) {
		const arrows = new Cesium.PolylineCollection();
		const xPos = [
			originDegree.lng,
			originDegree.lat,
			originDegree.alt,
			targetDegree.lng,
			originDegree.lat,
			originDegree.alt,
		];
		this.darwArrow(arrows, "model_edit_xArrow", xPos, Cesium.Color.GREEN);
		const yPos = [
			originDegree.lng,
			originDegree.lat,
			originDegree.alt,
			originDegree.lng,
			targetDegree.lat,
			originDegree.alt,
		];
		this.darwArrow(arrows, "model_edit_yArrow", yPos, Cesium.Color.BLUE);
		const zPos = [
			originDegree.lng,
			originDegree.lat,
			originDegree.alt,
			originDegree.lng,
			originDegree.lat,
			targetDegree.alt,
		];
		this.darwArrow(arrows, "model_edit_zArrow", zPos, Cesium.Color.RED);
		this._coordArrows = this._viewer.scene.primitives.add(arrows);
		this._coordArrows._name = "CoordAxis";
	}
	darwArrow(arrows, name, positions, color) {
		const arrow = arrows.add({
			positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
			width: this._defaultWidth,
			material: Cesium.Material.fromType(
				Cesium.Material.PolylineArrowType,
				{
					color: color,
				}
			),
		});
		arrow._name = name;
	}
	//根据平移距离获取目标点
	getTransPostion(originPosition, translateCartesian) {
		let transform =
			Cesium.Transforms.eastNorthUpToFixedFrame(originPosition); //东-北-上参考系构造出4*4的矩阵
		let m = new Cesium.Matrix4();
		Cesium.Matrix4.setTranslation(
			Cesium.Matrix4.IDENTITY,
			translateCartesian,
			m
		); //构造平移矩阵
		let modelMatrix = Cesium.Matrix4.multiply(transform, m, transform); //将当前位置矩阵乘以平移矩阵得到平移之后的位置矩阵
		Cesium.Matrix4.getTranslation(modelMatrix, originPosition); //从位置矩阵中取出坐标信息
		const result = CoordTransform.transformCartesianToWGS84(
			this._viewer,
			originPosition
		);
		return result;
	}
	removeCoordArrows() {
		if (this._coordArrows) {
			this._viewer.scene.primitives.remove(this._coordArrows);
			this._coordArrows = undefined;
		}
	}
	removeCoordCircle() {
		this._coordCircle.forEach((element) => {
			this._viewer.scene.primitives.remove(element);
		});
		this._coordCircle = [];
	}
	removeAllTools() {
		this.removeCoordArrows();
		this.removeCoordCircle();
	}
	/**
	 * 关闭/注销
	 */
	destroy() {
		this._gltf.currentPosition = [
			this._params.tx,
			this._params.ty,
			this._params.tz,
		];
		this.removeAllTools();
		this._handler.destroy();
		this.onEdit(false);
	}
}
export default EditGltf4Entity;
