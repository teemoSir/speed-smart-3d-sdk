import * as Cesium from 'cesium';
import SpeedPrimitive from "@/cesiumSDK/core/primitiveJS/primitive";
let headingPitchRoll = new Cesium.HeadingPitchRoll();
// 局部变换坐标系
let fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");
// 每次姿态变化4°
let deltaRadians = Cesium.Math.toRadians(4);
// 速度向量
let speedVector = new Cesium.Cartesian3();
// 控制视角
let view = 'none';
// 地图容器
let V = '';
// 计数器,只添加一次模型
let firstModel = '';
let position;
// 模型运动速度
let speed;
// 自定义控制模型视角Cesium.Cartesian3
let xyz = [];
// 自定义控制模型视角Cesium.Cartesian3
let firstRoamXYZ = [0, -100, 10];
// 自定义控制模型视角Cesium.Cartesian3
let godRoamXYZ = [0, 0, 100];
// 模型参数对象
let myParameter = {};
/**
* 第一视角漫游
*/
class firstRoam {
	/**
	* 构造函数
	* @param {*} viewer -地图主窗口
	*/
	constructor(viewer) {
		V = viewer
	}
	/**
	* 第一视角漫游加载方法
	* @param: 使用键盘控制第一视角漫游，模型姿态：↑：抬头；↓：低头；←：左转；→：右转；9：顺时针旋转；0：逆时针旋转；1：加速；2：减速；Ctrl：切换视角
	* @param {Object} parameter -第一视角漫游默认配置项
	* @param {String} parameter.modelPath -模型路径
	* @param {Array} parameter.startPosition -模型初始坐标位置
	* @param {Number} [parameter.minSize] -模型的最小显示像素大小，默认64
	* @param {Number} [parameter.maxSize] -模型的最大显示像素大小，默认128
	* @param {Number} [parameter.speed] -漫游速度，默认为1
	*/
	start(parameter) {
		if (!firstModel) {
			position = new Cesium.Cartesian3.fromDegrees(...parameter.startPosition);
			V.camera.flyTo({
				// fromDegrees()方法，将经纬度和高程转换为世界坐标
				destination: Cesium.Cartesian3.fromDegrees(118.7759, 32.1975, 200), //设置位置
				orientation: {
					// 方向
					heading: Cesium.Math.toRadians(0),
					// 视角、倾斜角度
					pitch: Cesium.Math.toRadians(-20),
					roll: 0.0
				}
			})
			// 模型初始位置
			this.priCover = new SpeedPrimitive(V);
			myParameter.clickPointH = parameter.startPosition;
			myParameter.modelPath = parameter.modelPath;
			myParameter.maxSize = parameter.maxSize;
			myParameter.minSize = parameter.minSize;
			speed = parameter.speed || 1;
			// 使用primitive方式加载模型
			firstModel = this.priCover.PrimitiveModel(myParameter);
			// 模型行进-俯仰-滚动角度的转换
			firstModel.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
				position,
				headingPitchRoll,
				Cesium.Ellipsoid.WGS84,
				fixedFrameTransform
			)
		}
		if (this.firstDown) {
			document.removeEventListener('keydown', this.firstDown, false);
		}
		// 添加键盘监听事件
		document.addEventListener('keydown', this.firstDown = function (e) {
			switch (e.key) {
				// 抬头
				case 'ArrowUp':
					headingPitchRoll.pitch += deltaRadians;
					break;

				// 低头
				case 'ArrowDown':
					headingPitchRoll.pitch -= deltaRadians;
					break;

				// 左转
				case 'ArrowLeft':
					headingPitchRoll.heading -= deltaRadians;
					break;

				// 右转
				case 'ArrowRight':
					headingPitchRoll.heading += deltaRadians;
					break;

				// 顺时针
				case '9':
					headingPitchRoll.roll += deltaRadians;
					break;

				// 逆时针
				case '0':
					headingPitchRoll.roll -= deltaRadians;
					break;

				// 加速
				case '1':
					speed += 10
					speed = Math.min(speed, 10000);
					break;
				// 减速
				case '2':
					speed -= 10;
					speed = Math.max(speed, 10);
					break;
				// 切换视角
				// case 'Control':
				// 	view = !view;
				// 	break;
				default:
					break;
			}
		})
		if (this.preUpdate) {
			// 移除模型移动事件
			V.scene.preUpdate.removeEventListener(this.preUpdate);
		}
		// 渲染更新前阶段添加监听
		V.scene.preUpdate.addEventListener(this.preUpdate = () => {
			// 乘以速度向量，计算速度矩阵
			speedVector = Cesium.Cartesian3.multiplyByScalar(
				Cesium.Cartesian3.UNIT_X,
				speed / 10,
				speedVector
			);
			// 根据速度计算下一个位置，本地坐标转世界坐标
			position = Cesium.Matrix4.multiplyByPoint(
				firstModel.modelMatrix,
				speedVector,
				position
			);
			// 更新模型姿态与位置
			Cesium.Transforms.headingPitchRollToFixedFrame(
				position,
				headingPitchRoll,
				Cesium.Ellipsoid.WGS84,
				fixedFrameTransform,
				firstModel.modelMatrix
			)
			if (view != 'none') {
				V.camera.lookAt(position, new Cesium.Cartesian3(...xyz))
			}
		})
		return firstModel;
	}
	/**
	* 漫游视角切换方法
    * @param {String} value -value为'first'为第一视角，'god'为上帝视角，'definition'为自定义视角，'none'为取消视角跟随
	* @param {Array} newModelXYZ -自定义视角时可用，通过[x(相机在模型左右),y(相机在模型前后),z(相机在模型上下)]设置视角相机位置
	*/
	changeView(value, newModelXYZ) {
		view = value;
		if (value == 'first') {
			// 更新相机位置（第一视角）
			xyz = firstRoamXYZ;
		} else if (value == 'god') {
			// 更新相机位置（上帝视角）
			xyz = godRoamXYZ;
		} else if (value == 'definition') {
			xyz = newModelXYZ;
		}
	}
	/**
	* 暂停第一视角漫游事件
	*/
	stop() {
		// 移除第一视角键盘事件
		document.removeEventListener('keydown', this.firstDown, false);
		// 移除模型移动事件
		V.scene.preUpdate.removeEventListener(this.preUpdate);
		V.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
	}
	/**
	* 销毁第一视角漫游事件
	*/
	quit() {
		this.stop();
		V.scene.primitives.remove(firstModel);
		firstModel = '';
		view == 'none'
	}
}
export default firstRoam
