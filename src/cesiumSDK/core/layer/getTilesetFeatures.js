import axios from "axios"



class getTilesetFeatures {

	async getTilesetScenetree(path) {
		let result = []
		await axios.get(path).then((res) => {
			if (res.status == 200) {
				let data = res.data
				let resdata = {}
				this.nextTree(data.scenes, resdata, true)
				result.push(resdata)
				return result
			}
		})
	}


	nextTree(data, nodeObj, root) {
		const mesh = {}
		for (let i = 0; i < data.length; i++) {
			let node = data[i]
			if (node.children != undefined && node.children) {
				if (root) {
					nodeObj.id = node.id
					nodeObj.label = node.name
					nodeObj.type = node.type
					nodeObj.sphere = node.sphere
					mesh[node.id] = node
					this.nextTree(node.children, nodeObj, false)
				} else {
					if (nodeObj.children == undefined) {
						nodeObj.children = []
					}
					nodeObj.children[i] = {
						id: node.id,
						label: node.name,
						type: node.type,
						sphere: node.sphere,
					};
					mesh[node.id] = node
					if ("element" == node.type) {
						// return nodeObj
					} else {
						this.nextTree(node.children, nodeObj.children[i], false)
					}
				}
			} else {
				if (nodeObj.children == undefined) {
					nodeObj.children = []
				}
				nodeObj.children[i] = {
					id: node.id,
					label: node.name,
					type: node.type,
					sphere: node.sphere,
				};
				mesh[node.id] = node
			}
		}
	}

}

export default getTilesetFeatures;
