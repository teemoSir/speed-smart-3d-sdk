

export default class Validate{

	static define(object){
		let define=false;
		if(object==undefined || object == null){
			define=false;
		}else{
			define=true;
		}
		return define;
	}

}
