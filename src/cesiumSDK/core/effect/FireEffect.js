
import * as Cesium from 'cesium'

//火焰特效
class FireEffect {
	constructor(viewer, options) {
		if (!options || (!options.position && !options.entity)) {
			return
		}
		this.viewer = viewer
		this.defaultParams = {
			image: require('@/assets/speed/effect/fire.png'),
			startColor: Cesium.Color.RED.withAlpha(0.5),
			endColor: Cesium.Color.YELLOW.withAlpha(0.2),
			emissionRate: 100,
			gravity: 0.0,
			minimumParticleLife: 1.5,
			maximumParticleLife: 2,
			minimumSpeed: 29,
			maximumSpeed: 30,
			startScale: 1.0,
			endScale: 5.0,
			particleSize: 5.0,
			heading: 0,
			pitch: 0,
			translationX: 0,
			translationY: 0,
			translationZ: 0,
		}
		this.particleSystem = ''
		if (options.entity) {
			this.entity = options.entity
		} else {
			this.entity = this.viewer.entities.add({
				position: Cesium.Cartesian3.fromDegrees(...options.position)
			});
		}
		options.particleParams = options.particleParams || {}
		this.particleParams = {
			image: options.particleParams.image || this.defaultParams.image,
			startColor:  options.particleParams.startColor || this.defaultParams.startColor,
			endColor: options.particleParams.endColor || this.defaultParams.endColor,
			startScale: options.particleParams.startScale || this.defaultParams.startScale,
			endScale: options.particleParams.endScale || this.defaultParams.endScale,
			minimumParticleLife: options.particleParams.minimumParticleLife || this.defaultParams.minimumParticleLife,
			maximumParticleLife: options.particleParams.maximumParticleLife || this.defaultParams.maximumParticleLife,
			minimumSpeed: options.particleParams.minimumSpeed || this.defaultParams.minimumSpeed,
			maximumSpeed: options.particleParams.maximumSpeed || this.defaultParams.maximumSpeed,
			particleSize: options.particleParams.particleSize || this.defaultParams.particleSize,
			emissionRate: options.particleParams.emissionRate || this.defaultParams.emissionRate,
			heading: options.particleParams.heading || this.defaultParams.heading,
			pitch: options.particleParams.pitch || this.defaultParams.pitch,
			translationX: options.particleParams.translationX || this.defaultParams.translationX,
			translationY: options.particleParams.translationY || this.defaultParams.translationY,
			translationZ: options.particleParams.translationZ || this.defaultParams.translationZ,
		}
		this.init();
	}

	init() {
		// this.viewer.clock.shouldAnimate = true;
		let particleSystem = this.viewer.scene.primitives.add(
			new Cesium.ParticleSystem({
				image: this.particleParams.image,
				//粒子在生命周期开始时的颜色
				startColor:  this.particleParams.startColor,
				//粒子在生命周期结束时的颜色
				endColor: this.particleParams.endColor,
				//粒子在生命周期开始时初始比例
				startScale: this.particleParams.startScale,
				//粒子在生命周期结束时比例
				endScale: this.particleParams.endScale,
				minimumParticleLife: this.particleParams.minimumParticleLife,
				maximumParticleLife: this.particleParams.maximumParticleLife,
				minimumSpeed: this.particleParams.minimumSpeed,
				maximumSpeed: this.particleParams.maximumSpeed,
				//以像素为单位缩放粒子图像尺寸
				imageSize: new Cesium.Cartesian2(
					this.particleParams.particleSize,
					this.particleParams.particleSize
				),
				//每秒发射的粒子数
				emissionRate: this.particleParams.emissionRate,
				//粒子系统发射粒子的时间（秒）
				// lifetime: 10.0,
				//设置粒子的大小是否以米或像素为单位
				sizeInMeters: true,
				//系统的粒子发射器
				emitter: new Cesium.CircleEmitter(10.0),
				emitterModelMatrix: this.computeEmitterModelMatrix(),
				// updateCallback: this.applyGravity,
			})
		)
		this.particleSystem = particleSystem
		this.preUpdateEvent()
	}

	//场景渲染事件
	preUpdateEvent() {
		this.viewer.scene.preUpdate.addEventListener( (scene, time) => {
		//发射器地理位置
		this.particleSystem.modelMatrix = this.computeModelMatrix(time)
		});
	}

	computeModelMatrix(time) {
		return this.entity.computeModelMatrix(time, new Cesium.Matrix4())
	}

	computeEmitterModelMatrix() {
		let hpr = Cesium.HeadingPitchRoll.fromDegrees(this.particleParams.heading, this.particleParams.pitch, 0.0)
		let trs = new Cesium.TranslationRotationScale()
		trs.translation = Cesium.Cartesian3.fromElements(this.particleParams.translationX, this.particleParams.translationY, this.particleParams.translationZ)
		trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
		return Cesium.Matrix4.fromTranslationRotationScale(trs)
	}

	applyGravity(p, dt) {
		const gravityScratch = new Cesium.Cartesian3()
		const position = p.position
		Cesium.Cartesian3.normalize(position, gravityScratch)
		Cesium.Cartesian3.multiplyByScalar(
		  gravityScratch,
		  this.gravity * dt,
		  gravityScratch
		)
		p.velocity = Cesium.Cartesian3.add(
		  p.velocity,
		  gravityScratch,
		  p.velocity
		)
	}

	removeEvent(){
		this.viewer.scene.preUpdate.removeEventListener(this.preUpdateEvent, this)
	}

	//移除粒子特效
	remove() {
		this.removeEvent()//清除事件
		this.viewer.scene.primitives.remove(this.particleSystem) //删除粒子对象
		this.viewer.entities.remove(this.entity) //删除entity
	}
}

export default FireEffect


