
import * as Cesium from 'cesium'
import Effect from "./base/effect";

class LineAnimation extends Effect {

    /**
       * @member {Cesium.Viewer} - cesium的viewer对象
       * @memberof Visible
       */
    _viewer
	entity
	options

    /**
      * 
      * @class
      * @param {Object|Cesium.Viewer} map - viewer实例
      */
    constructor(map, options) {
        super(map)
        this.init(map, options)
    }


    /**
         * 初始化
         * @private
         * @property
         * @param {*} viewer 
         */
    init (map, options) {
        this._viewer = map._viewer || map
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.')
		this.options = options || {}
		this.interpolation = this.options.interpolation || 0
		this.creatEntity()
        this.activate()
    }

	creatEntity() {
		this.entity = this._viewer.entities.add({
			polyline: {
				positions: Cesium.Cartesian3.fromDegreesArray(this.options.positions),
				width: this.options.width || 10,
				material : new Cesium.PolylineArrowMaterialProperty( Cesium.Color.fromCssColorString(this.options.fillColor)),
				clampToGround: true
			}
		})
	}

	computerDistance(pos){
		var flag = false;
		if( pos[0].length == 3 ){
			flag = true;
		}
		var sumDis = 0.0;
		var distance = [];
		distance.push(0.0);
		for(var i = 0; i < pos.length - 1; ++i){
			
			var sPosi = pos[i];
			var ePosi = pos[i+1];

			var sPos = undefined;
			var ePos = undefined;
			if( flag){
				sPos = Cesium.Cartesian3.fromDegrees(sPosi[0],sPosi[1],sPosi[2]);
				ePos = Cesium.Cartesian3.fromDegrees(ePosi[0],ePosi[1],ePosi[2]);
			}else{
				sPos = Cesium.Cartesian3.fromDegrees(sPosi[0],sPosi[1]);
				ePos = Cesium.Cartesian3.fromDegrees(ePosi[0],ePosi[1]);
			}
			
			var disTemp = Cesium.Cartesian3.distance(sPos, ePos);
			sumDis += disTemp;
			distance.push(sumDis);
		}
		return {distance, sumDis}
	}

	activate() {
		this.posProperty = null
		var positions = this.handlePositons(this.options.positions)
		var totalTime = this.options.totalTime || 2000
		this.finish = false
		this.start = new Date()
	    this.posProperty = new Cesium.SampledPositionProperty()
	    
	    var keyPosTime = []
	    var keyPosition = []
	    var keyPos = this.posProperty

	    //计算距离
	    var result = this.computerDistance(positions)
	    
	    var refTime = null
	    var flag = false
	    for (var i = 0; i < positions.length; ++i) {
	       
	    	if( positions[i].length == 3)
			{
				flag = true;
			}
	    	refTime = new Date();
	    	var intervalTime = this.start.getTime() + (totalTime) * (result.distance[i] / result.sumDis);
	    	refTime.setTime( intervalTime );
	    	keyPosTime.push(intervalTime);
	    	
	    	var pos = null;
	    	if(flag){
	    		pos = Cesium.Cartesian3.fromDegrees(positions[i][0], positions[i][1], positions[i][2]);
	    		
	    	}else{
	    		
	    		pos = Cesium.Cartesian3.fromDegrees(positions[i][0], positions[i][1]);
	    	}
	    	
	    	this.posProperty.addSample(Cesium.JulianDate.fromDate(refTime),pos);
    		keyPosition.push(pos);
	        
	    }

	    var startPos = null;
	    if(flag){
	    	startPos = Cesium.Cartesian3.fromDegrees(positions[0][0], positions[0][1], positions[0][2]);
    	}else{
    		startPos = Cesium.Cartesian3.fromDegrees(positions[0][0], positions[0][1],0.0);
    	}
	    
	    if(this.interpolation === 1) {
	    	keyPos.setInterpolationOptions({
		        interpolationDegree: 2,
		        interpolationAlgorithm: Cesium.HermitePolynomialApproximation
		    });
	    }else if( this.interpolation === 2 ){
	    	keyPos.setInterpolationOptions({
		        interpolationDegree: 5,
		        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
		    });
	    }else{
	    	keyPos.setInterpolationOptions({
		        interpolationDegree: 1,
		        interpolationAlgorithm: Cesium.LinearApproximation
		    });
	    }
	    
	    var refStart = this.start;
	    var nowTime = this.start;
	    var keyTime = this.start;

	    var realPos = [startPos,startPos];
	    var tempPos = [ ];
	    tempPos.push( keyPosition[0] );

	    this.entity.polyline.positions = new Cesium.CallbackProperty( function(){ return realPos;},false ); 
	    var index = 0;
	    var changeFlag = false;
	    var endFlag = false;
	    keyTime.setTime(keyPosTime[index]);
	    //是否反向
        var reverse = this.reverse;
	    this.clock = setInterval(() => {
	        if ( nowTime <= refTime ){
	        	var fTime = nowTime.getTime();
	        	if(reverse && endFlag){
	        		if( fTime <= keyPosTime[index] && index > 0 ){
	        			tempPos.pop();
	        			index--;
	        			if(this.interpolation == 0){
		        			changeFlag = true;
		        		}
		        		
		        	}
	        		
		        	if(changeFlag){
		        		realPos = [];
		        		for( i in tempPos){
		        			realPos.push(tempPos[i]);
		        		}
		        		realPos.push( keyPos.getValue(Cesium.JulianDate.fromDate(nowTime)) );
			        	changeFlag = false;
			        	
		        	}else{
		        		if(this.interpolation == 0){
		        			realPos.pop();
		        			realPos.push( keyPos.getValue(Cesium.JulianDate.fromDate(nowTime)) );
		        		}else{
		        			realPos.pop();
		        		}
		        		
		        	}
		        	
	        	}else if( !endFlag){
	        		if( fTime > keyPosTime[index] && index < positions.length){
		        		tempPos.push( keyPosition[index] );
		        		index++;
		        		if(this.interpolation == 0){
		        			changeFlag = true;
		        		}
		        		
		        		if(tempPos.length > positions.length){
		        			tempPos.pop();
		        		}
		        		
		        	}
	        		
		        	if(changeFlag){
			        	realPos = tempPos;
			        	if(!reverse){
			        		realPos.push( keyPos.getValue(Cesium.JulianDate.fromDate(nowTime)) );
			        	}
			        	
			        	changeFlag = false;
		        	}else{
		        		if(this.interpolation == 0){
		        			realPos.pop();
		        		}
		        		
		        		realPos.push( keyPos.getValue(Cesium.JulianDate.fromDate(nowTime)) );
		        	}
		        	
	        	}
	        		
	        }
	        else {
	        	
	        	//是否循环
	        	var loop = this.loop || true;
	        	reverse = this.reverse;
	        	if(loop){
	        		if(reverse && !endFlag){
	        			endFlag = true;
	        			nowTime.setTime( refStart.getTime());
	        			tempPos = [];
	        			tempPos = keyPosition;
	        		}else{
	        			index = 0;
		        		tempPos = [];
		        		realPos = [startPos,startPos];
		        		nowTime.setTime(keyPosTime[0]);
		        		refStart.setTime(keyPosTime[0]);
	        		}
	        		
	        	}else{
	        		clearInterval(this.clock);
	        		this.clock = 0;
	        		this.finish = true;
	        		if(this.interpolation ==0){
	        			realPos = keyPosition;
	        		} 
		            endFlag = false;
		            this.entity.polyline.positions = new Cesium.CallbackProperty( function(){ return realPos;},true ); 
	        	}
	            
	        }
	        
	        
	        if(reverse && endFlag){
	        	nowTime.setTime( refStart.getTime() - 10);
	        	if(nowTime.getTime() <= keyPosTime[0]){
        			endFlag = false;
        			realPos = [];
	        		nowTime.setTime(keyPosTime[0]);
	        		refStart.setTime(keyPosTime[0]);
        		}
	        }else{
	        	nowTime.setTime( refStart.getTime() + 10);
	        }
	    }, 10);
	}

	inactivate() {
		clearInterval(this.clock);
	}

	handlePositons(positions) {
		let result = []
		for (let i = 0; i < positions.length; i += 2) {
			result.push([positions[i], positions[i + 1]])
		}
		return result
	}

	setEntityVisible(flag) {
		this.entity.show = flag
	}
	destroy() {
		this.inactivate()
		if (this.entity) {
			this._viewer.entities.remove(this.entity)
			this.entity = null
		}
	}
   
}

export default LineAnimation;


