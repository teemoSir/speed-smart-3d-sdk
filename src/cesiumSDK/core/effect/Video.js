import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'

export default class Video {
	constructor(_options) {
		this.id = _options.id
		const videoElement = document.createElement('video')
		videoElement.muted = true
		videoElement.id = this.id
		videoElement.autoplay = true
		videoElement.loop = true
		videoElement.crossOrigin = 'anonymous'
		videoElement.className =
			'video-js vjs-default-skin vjs-big-play-centered vjs-16-9'
		this.videoElement = videoElement
		this._video = videojs(videoElement, {
			bigPlayButton: true,
			textTrackDisplay: false,
			posterImage: false,
			errorDisplay: false,
		})
		if (_options.src) {
			this.setSrc(_options.src)
			this.play()
		}
	}
	setSrc(vdoSrc) {
		if (/\.m3u8$/.test(vdoSrc)) {
			//判断视频源是否是m3u8的格式
			this._video.src({
				src: vdoSrc,
				type: 'application/x-mpegURL', //在重新添加视频源的时候需要给新的type的值
			})
		} else {
			this._video.src(vdoSrc)
		}
	}
	play() {
		if (!this._video.isReady_) {
			this._video.load()
		}
		this._video.play()
	}
	pause() {
		return this._video.pause()
	}
	destroy() {
		return this._video.dispose()
	}
}
