<template>
	<div class="address-left">
		<span class="search"></span>
		<input class="search_address" v-model="search_address" placeholder="地名地址检索" @keyup.enter.native="searchData()" />
		<div v-for="item in address" :key="item.id" class="address_info" @click="flyAddress(item)">
			<div class="address_title" :class="item.type === '点状地址' ? 'new-address' : ''">
				<!-- <el-image  :src="require('@/assets/speed/case/civil/地址图标.png')" ></el-image> -->
				{{ item.标准名称 }}
			</div>
			<p class="address_content">{{ item.地名代码 }}</p>
		</div>

		<el-pagination
			small
			background
			layout="prev, pager, next"
			v-model:page-size="page.size"
			:total="page.total"
			v-model:current-page="page.current"
			class="page_info"
			@current-change="refresh()"
		/>
	</div>
</template>

<script>
import address_data from "./data.js";

export default {
	data() {
		return {
			page: {
				current: 1,
				size: 10,
				total:address_data.length,
				data:address_data,
			},
			search_address: "",
			address: address_data.slice(0, 10),
		};
	},
	mounted(){

		this.locationAddress(this.address);
},
	methods: {
		refresh(){
			console.log(this.page.current)
			this.address=this.page.data.slice((this.page.current-1 )* 10, (this.page.current-1 )* 10+10);
			this.locationAddress(this.address);
		},

		searchData(){
			let that = this;
			let temp = address_data.filter(item=>item.标准名称.includes(that.search_address));
			that.page.data = temp;
			that.page.total = temp.length;
			that.page.current = 1;
			that.address=temp.slice(0, 10);
			this.locationAddress(that.address);
		},
		locationAddress(address){
			//撒地名点
			this.$emit("address",address,1)
		},
		flyAddress(address){
			this.$emit("flyAddress",address)
		}
	},
};
</script>

<style scoped>
.address-left {
	width: 21.9%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	text-align: center;
}

.search_address {
	text-indent: 10%;
	color: white;
	background-size: 100% 100%;
	background: url("@/assets/speed/case/civil/search.png") no-repeat;
	width: 93%;
	height: 5%;
	border: none;
}

.search {
	width: 6%;
	height: 3%;
	background-size: 100% 100%;
	background: url("@/assets/speed/case/civil/search1.png") no-repeat;
	display: inline-block;
	position: absolute;
	left: 8%;
	top: 2.5%;
}

.address_info {
	width: 93%;
	height: 8%;
	background: url("@/assets/speed/case/civil/list.png") no-repeat;
	background-size: 100% 100%;
	display: block;
	position: relative;
	top: 1%;
	left: 3.2%;
	margin-top: 1.5%;
}
.address_info:hover {
	transform: scale(1.05);
	cursor: pointer;
}

.address_title {
	color: white;
	text-align: left;
	height: 56%;
	background: url("@/assets/speed/case/civil/addresspoint.png") no-repeat;
	text-indent: 10%;
	line-height: 56%;
	padding-top: 3.5%;
	font-size: 20px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 400;
	text-shadow: -2px 0px 8px 2px rgba(9, 35, 81, 0.9);
	overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
	text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
	white-space: nowrap; /*文本不换行*/
}

.address_content {
	color: white;
	text-align: left;
	text-indent: 10%;
	font-size: 14px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	text-shadow: -2px 0px 8px 2px rgba(9, 35, 81, 0.9);
}

.page_info {
	position: absolute;
	right: 5%;
	bottom: 2%;
}

.new-address {
	background: url("@/assets/speed/case/civil/localpoint.png") no-repeat;
	background-size: 22px 22px;
    background-position: 8px 8px;
}

</style>
