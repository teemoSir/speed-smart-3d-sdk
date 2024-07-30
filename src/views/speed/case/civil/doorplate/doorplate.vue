<template>
	<div class="doorplate-left">
		<el-row class="input-search">
			<el-col :span="8">
				<el-select v-model="selectValue" placeholder="全部" style="margin: 3px 0 0 3px"
					@change="selectChange"  :popper-append-to-body="false">
					<el-option class="selectItem" style="color: #35a7ff" v-for="item in selectOptions" :key="item.value" :label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<div class="line"></div>
			</el-col>
			<el-col :span="14">
				<input class="search_door" placeholder="请输入搜索内容" v-model="search_content"
					@keyup.enter.native="searchData()" />
			</el-col>
			<el-col :span="2">
				<div class="search_btn"></div>
			</el-col>
		</el-row>
		<!-- <span class="search"></span>
		<input class="search_door" placeholder="道路门牌检索" v-model="search_content" @keyup.enter.native="searchData()" /> -->
		<div class="door_info">
			<el-table class="doorTable" :data="allDoorData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
				border style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }">
				<el-table-column prop="POI" label="名称" :formatter="nameFormatter" />
				<el-table-column prop="门牌号" label="编号" width="60" :formatter="numberFormatter" />
				<el-table-column prop="imageUrl" label="二维码" width="65">
					<template #default="scope">
						<el-image :src="imageUrls[0]" max-width="60" max-height="60" :zoom-rate="1.2"
							:preview-src-list="imageUrls" fit="cover" hide-on-click-modal="true"
							preview-teleported="true" />
					</template>
				</el-table-column>

				<el-table-column label="操作" width="125">
					<template #default="scope">
						<el-button class="pageBtn" type="primary" size="small" title="定位" @click="zoomto(scope.row)">
							<svg t="1678427365158" class="icon" viewBox="0 0 1024 1024" version="1.1"
								xmlns="http://www.w3.org/2000/svg" p-id="2786" width="16" height="16">
								<path
									d="M874.048 533.333333C863.424 716.629333 716.629333 863.424 533.333333 874.048V917.333333a21.333333 21.333333 0 0 1-42.666666 0v-43.285333C307.370667 863.424 160.576 716.629333 149.952 533.333333H106.666667a21.333333 21.333333 0 0 1 0-42.666666h43.285333C160.576 307.370667 307.370667 160.576 490.666667 149.952V106.666667a21.333333 21.333333 0 0 1 42.666666 0v43.285333c183.296 10.624 330.090667 157.418667 340.714667 340.714667h42.816a21.333333 21.333333 0 1 1 0 42.666666H874.026667z m-42.752 0h-127.786667a21.333333 21.333333 0 0 1 0-42.666666h127.786667C820.778667 330.922667 693.056 203.221333 533.333333 192.704V320a21.333333 21.333333 0 0 1-42.666666 0V192.704C330.922667 203.221333 203.221333 330.944 192.704 490.666667H320a21.333333 21.333333 0 0 1 0 42.666666H192.704c10.517333 159.744 138.24 287.445333 297.962667 297.962667V704a21.333333 21.333333 0 0 1 42.666666 0v127.296c159.744-10.517333 287.445333-138.24 297.962667-297.962667zM512 554.666667a42.666667 42.666667 0 1 1 0-85.333334 42.666667 42.666667 0 0 1 0 85.333334z"
									fill="#ffffff" p-id="2787" data-spm-anchor-id="a313x.7781069.0.i0" class="selected">
								</path>
							</svg>
						</el-button>
						<el-button class="pageBtn" type="primary" size="small" title="编辑" @click="changeDataFn(scope.row) ">
							<svg t="1679996042219" class="icon" viewBox="0 0 1024 1024" version="1.1"
								xmlns="http://www.w3.org/2000/svg" p-id="3863" width="16" height="16">
								<path
									d="M862.709333 116.042667a32 32 0 1 1 45.248 45.248L455.445333 613.813333a32 32 0 1 1-45.258666-45.258666L862.709333 116.053333zM853.333333 448a32 32 0 0 1 64 0v352c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V224c0-64.8 52.533333-117.333333 117.333333-117.333333h341.333333a32 32 0 0 1 0 64H224a53.333333 53.333333 0 0 0-53.333333 53.333333v576a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V448z"
									fill="#ffffff" p-id="3864"></path>
							</svg>
						</el-button>
						<el-button class="pageBtn" type="primary" size="small" title="删除">
							<svg t="1679996082984" class="icon" viewBox="0 0 1024 1024" version="1.1"
								xmlns="http://www.w3.org/2000/svg" p-id="4935" width="16" height="16">
								<path
									d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
									fill="#ffffff" p-id="4936"></path>
							</svg>
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination class="page" background small layout="prev, pager, next" @size-change="handleSizeChange"
			@current-change="handleCurrentChange" :page-size="pagesize" :total=total />
	</div>

	<div class="message">
		<!-- <div class="message-content">
			<div style="display: flex;" v-for="(item, index) in messages" :key="index">
				<div :style="activation(0)">{{ item.street }}</div>
				<div :style="activation(1)">{{ item.num }}</div>
				&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div> -->
		<Vue3SeamlessScroll class="scroll" :list="messages" step="0.3" direction="left" limitScrollNum="1">
			<div class="message-content">
				<div class="item" v-for="(item, index) in messages" :key="index">
					<div :style="activation(0)">{{ item.street }}</div>
					<div :style="activation(1)">{{ item.num }}</div>
					&nbsp;&nbsp;&nbsp;&nbsp;
				</div>
			</div>
		</Vue3SeamlessScroll>
	</div>

	<!-- <div class="doorplate-bottom">
		<div class="doorplate-info">
			<el-card class="streetname">
				<div class="monitor-list">
					<div class="btn" @click="scrollLeft">
						<el-image :src="require('@/assets/speed/case/civil/leftarrow.png')" />
					</div>
					<div id="list-box" class="list-box">
						<div id="list" class="list">
							<el-checkbox-group v-model="checkedStreet" @change="handleCheckedCitiesChange">
								<el-checkbox class="chkLst" v-for="(item, index) in streetData" :key="index" :label="item">
								</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
					<div class="btn" @click="scrollRight">
						<el-image :src="require('@/assets/speed/case/civil/rightarrow.png')" />
					</div>
				</div>
			</el-card>

		</div>
		<div class="doorplate-street">
			<el-checkbox class="select" v-model="checkAll" :indeterminate="isIndeterminate"
				@change="handleCheckAllChange">选择全部</el-checkbox>
		</div>
	</div> -->

	<div class="community-bottom">
		<div class="community-info">
			<div class="community">
				<img :src="require('@/assets/speed/case/civil/ic_zjt.png')" style="height: 20px; margin-top: 37px" />
			</div>

			<div v-for="(item, index) in actionStreetyLst" @click="this.action = index"
				:class="this.action == index ? 'communityhover' : 'community'" :key="index" :style="{
					marginTop: (Math.abs(item.deg * 2) - 1) + 'px',
					transform: 'rotate(' + item.deg + 'deg)',
				}">
				{{ item.label }}
			</div>
			<div class="community">
				<img :src="require('@/assets/speed/case/civil/ic_yjt.png')" style="height: 20px; margin-top: 37px" />
			</div>
		</div>
		<div class="community-street">
			<el-checkbox class="select" v-model="checkAll" :indeterminate="isIndeterminate">选择全部</el-checkbox>
		</div>
	</div>

	<div id="doorplate-right" class="doorplate-right" :panelVisible="isOpen">
		<el-button id="panelBtn" :class="isOpen === false ? 'close' : 'open'" @click="panelFn()"></el-button>
		<div class="mpshtj" ref="chartMPSHTJ"></div>
		<el-tabs v-model="activeName" class="tabs-style">
			<el-tab-pane label="异常门牌记录" name="first">
				<div class="tabs-table" v-if="activeName === 'first'">
					<el-table class="undoorTable" :data="unDoorData" border style="width: 100%"
						:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
						<el-table-column prop="name" label="名称" />
						<el-table-column prop="level" label="异常级别" />
						<el-table-column prop="photo" label="现场照片">
							<template #default="scope">
								<el-image :src="scope.row.photo" max-height="50" :zoom-rate="1.2"
									:preview-src-list="doorImgLst" :initial-index="1" fit="contain"
									hide-on-click-modal="true" preview-teleported="true" />
								<span v-show="scope.row.photo === ''">{{ scope.row.text }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="remark" label="备注" />
						<el-table-column prop="qrcode" label="二维码" width="65">
							<template #default="scope">
								<el-image :src="scope.row.qrcode" max-height="50" :zoom-rate="1.2"
									:preview-src-list="imageUrls" fit="cover" hide-on-click-modal="true"
									preview-teleported="true" />
								<span v-show="scope.row.photo === ''">{{ scope.row.text }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="门牌维护记录" name="second">
				<div class="tabs-table" v-if="activeName === 'second'">
					<el-table class="undoorTable" :data="maintenanceData" border style="width: 100%"
						:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
						<el-table-column prop="name" label="维修地址" />
						<el-table-column prop="maintainer" label="维修人员" />
						<el-table-column prop="photo" label="现场照片">
							<template #default="scope">
								<el-image :src="scope.row.photo" max-height="50" :zoom-rate="1.2"
									:preview-src-list="doorImgLst" :initial-index="1" fit="contain"
									hide-on-click-modal="true" preview-teleported="true" />
								<span v-show="scope.row.photo === ''">{{ scope.row.text }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="time" label="维修时间" />
					</el-table>
				</div>

			</el-tab-pane>
		</el-tabs>
		<!-- <div class="unusualdoor">
			<el-table class="undoorTable" :data="unDoorData" border style="width: 100%"
				:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
				<el-table-column prop="name" label="名称" />
				<el-table-column prop="level" label="异常级别" />
				<el-table-column prop="photo" label="现场照片">
					<template #default="scope">
						<el-image :src="scope.row.photo" max-height="50" :zoom-rate="1.2" :preview-src-list="doorImgLst"
							:initial-index="1" fit="contain" hide-on-click-modal="true" preview-teleported="true" />
						<span v-show="scope.row.photo === ''">{{ scope.row.text }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" />
				<el-table-column prop="qrcode" label="二维码" width="65">
					<template #default="scope">
						<el-image :src="scope.row.qrcode" max-height="50" :zoom-rate="1.2" :preview-src-list="imageUrls"
							fit="cover" hide-on-click-modal="true" preview-teleported="true" />
						<span v-show="scope.row.photo === ''">{{ scope.row.text }}</span>
					</template>
				</el-table-column>


			</el-table>
		</div> -->
	</div>

	<el-dialog v-model="dialogFormVisible" title="属性信息编辑" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form label-width="120px" :inline="true">
			<el-form-item label="地名代码">
				<el-input model-value="23088110023514000001" disabled />
			</el-form-item>
			<el-form-item label="地名类别">
				<el-select placeholder="请选择" :model-value="dmType">
					<el-option label="城镇居民点" value="221" />
					<el-option label="农村居民点" value="222" />
					<el-option label="工矿点" value="2223" />
					<el-option label="县道" value="23213" />
					<el-option label="乡道" value="23214" />

				</el-select>
			</el-form-item>
			<el-form-item label="标准名称">
				<el-input model-value="渔业村XXXX" />
			</el-form-item>
			<el-form-item label="简称">
				<el-input model-value="渔业村XXXX" />
			</el-form-item>
			<el-form-item label="别名">
				<el-input model-value="渔业村XXXX" />
			</el-form-item>
			<el-form-item label="曾用名">
				<el-input model-value="渔业村XXXX" />
			</el-form-item>
			<el-form-item label="图号（年版）">
				<el-input model-value="12-53-014-A(2012)" />
			</el-form-item>
			<el-form-item label="比例尺">
				<el-select placeholder="请选择" model-value="1:50000">
					<el-option label="1:50000" value="50000" />
					<el-option label="1:10000" value="10000" />
				</el-select>
			</el-form-item>
			<el-form-item label="使用时间">
				<el-select placeholder="请选择" model-value="现今地名">
					<el-option label="现今地名" value="1" />
					<el-option label="历史地名" value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="地名的历史沿革">
				<el-input model-value="1880年建立，沿用至今。" />
			</el-form-item>
			<el-form-item label="东经">
				<el-input model-value="132°28′13.63″" />
			</el-form-item>
			<el-form-item label="至东经">
				<el-input model-value="" />
			</el-form-item>
			<el-form-item label="北纬">
				<el-input model-value="47°38′45.03″" />
			</el-form-item>
			<el-form-item label="至北纬">
				<el-input model-value="" />
			</el-form-item>
			<el-form-item label="密级">
				<el-select placeholder="请选择" model-value="秘密">
					<el-option label="绝密" value="1" />
					<el-option label="机密" value="2" />
					<el-option label="秘密" value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="登记时间">
				<el-date-picker model-value='2021-10-29' type="date" placeholder="选择日期" format="YYYY/MM/DD"
					value-format="YYYY-MM-DD" />
			</el-form-item>
			<el-form-item label="登记人">
				<el-input model-value="张三" />
			</el-form-item>
			<el-form-item label="登记单位">
				<el-input model-value="XXX民政局" />
			</el-form-item>
			<el-form-item label="审批材料">
				<div class="fujian" >
					<img :src="require('@/assets/speed/case/civil/ic_fj.png')" alt="" />
					2022年审批材料
					&nbsp;&nbsp;
					<a style="text-decoration: underline; color: #4692ff; float: right;cursor: pointer;">
						附件上传</a>
				</div>
			</el-form-item>

		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">
					保存
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script>
import doorData from "./doorData";
import roadData from "./roadData";
import { createPieChart, create3DPieChart, createMPPieChart } from '@/views/speed/case/civil/community/gridEcharts';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"


let checkAll = false
let isIndeterminate = true
export default {
	components: {
		Vue3SeamlessScroll
	},
	data() {
		return {
			dmType:"农村居民点",
			dialogFormVisible: false,
			allDoorData: [...doorData, ...roadData],
			allRoadData:roadData,
			curDoorData: doorData.slice(0, 10),
			currentPage: 1,
			pagesize: 10,
			total: doorData.length,
			imageUrls: [require("@/assets/speed/case/civil/QRcode.png")],
			search_content: "",
			streetData: ["渔业村", "卫明村", "红旗街道", "友谊街道", "云环街道", "英俊街道", "大来镇", "敖其镇"],
			actionStreetyLst: [
				{ value: 1, label: "红旗街道", deg: -8 },
				{ value: 2, label: "卫明村", deg: -2.2 },
				{ value: 3, label: "渔业村", deg: 0 },
				{ value: 3, label: "友谊街道", deg: 2.2 },
				{ value: 4, label: "云环街道", deg: 8 },
			],
			action: 2,
			numberkey: 0,
			checkedStreet: ['渔业村', "卫明村", "红旗街道"],
			isOpen: false,
			unDoorData: [
				{ id: 0, name: '中国邮政', level: 'I级', photo: require("@/assets/speed/case/civil/photo/646/f304fdc35e2d85bc25a8807bf9a5b6f.jpg"), text: "无", qrcode: require("@/assets/speed/case/civil/QRcode.png"), remark: '门牌脱落' },
				{ id: 1, name: '华伟大药店', level: 'I级', photo: require("@/assets/speed/case/civil/photo/648/8c9c05b643206b8e415886cf9c6c3c1.jpg"), text: "无", qrcode: require("@/assets/speed/case/civil/QRcode.png"), remark: '门牌脱落' },
				{ id: 2, name: '顶呱呱香嘴鸭', level: 'II级', photo: '', text: "无", qrcode: '', remark: '待采集' },
				{ id: 3, name: '二十三食品店', level: 'III级', photo: require("@/assets/speed/case/civil/photo/662/cad04897fad84a3ae7ba9f67cb57237.jpg"), text: "无", qrcode: require("@/assets/speed/case/civil/QRcode.png"), remark: '门牌脱落' },
				{ id: 4, name: '魔妃良品', level: 'II级', photo: '', text: "无", qrcode: '', remark: '待采集' },
				{ id: 5, name: '脆皮烤鸭', level: 'II级', photo: '', text: "无", qrcode: '', remark: '待采集' },
				{ id: 6, name: '图书店', level: 'II级', photo: '', text: "无", qrcode: '', remark: '待采集' },
				{ id: 7, name: '五金日杂', level: 'II级', photo: '', text: "无", qrcode: '', remark: '待采集' },
			],
			maintenanceData: [
				{ id: 0, name: '中国邮政', photo: require("@/assets/speed/case/civil/photo/646/f304fdc35e2d85bc25a8807bf9a5b6f.jpg"), maintainer: "张三", time: '2023-1-5' },
				{ id: 1, name: '华伟大药店', photo: require("@/assets/speed/case/civil/photo/648/8c9c05b643206b8e415886cf9c6c3c1.jpg"), maintainer: "李四", time: '2023-1-5' },
				{ id: 2, name: '顶呱呱香嘴鸭', photo: '', text: "无", maintainer: "张三", time: '2023-1-5' },
				{ id: 3, name: '二十三食品店', photo: require("@/assets/speed/case/civil/photo/662/cad04897fad84a3ae7ba9f67cb57237.jpg"), maintainer: "赵五", time: '2023-1-5' },
			],
			doorImgLst: [
				require("@/assets/speed/case/civil/photo/646/f304fdc35e2d85bc25a8807bf9a5b6f.jpg"),
				require("@/assets/speed/case/civil/photo/648/8c9c05b643206b8e415886cf9c6c3c1.jpg"),
				require("@/assets/speed/case/civil/photo/662/cad04897fad84a3ae7ba9f67cb57237.jpg")
			],
			messages: [],
			selectOptions: [
				{
					label: "全部",
					value: "",
				},
				{
					label: "门牌",
					value: "门牌",
				},
				{
					label: "道路",
					value: "道路",
				},
			],
			selectValue: "全部",
			activeName: 'first',

		};
	},
	mounted() {
		this.curDoorData = this.allDoorData.slice(0, 10)
		this.total = this.allDoorData.length
		this.loadDoorData(this.curDoorData);
		this.$emit("loadRoadData", this.allRoadData)
		this.createPie()
		this.totalStreet()

	},
	computed: {
		activation() {
			return (type) => {
				if (type === 0) {
					return { 'color': '#FFFFFF' }
				}
				else if (type === 1) {
					return { 'color': '#FFEA00' }
				}
			}
		}
	},
	methods: {
		totalStreet() {
			this.messages = []
			this.checkedStreet.forEach(itm => {
				let temp = doorData.filter(item => item.乡镇街道.includes(itm));
				this.messages.push({
					street: itm + "：",
					num: "门牌数-" + temp.length
				})
			});

		},
		createPie() {
			let optionData = [
				{ name: 'I级', value: 100 },
				{ name: 'II级', value: 150 },
				{ name: 'III级', value: 180 },
				{ name: 'IV级', value: 172 }
			]
			// create3DPieChart(this.$refs['chartMPSHTJ'], optionData)
			//createPieChart(optionData, this.$refs['chartMPSHTJ']);
			createMPPieChart(optionData, this.$refs['chartMPSHTJ'])
		},
		handleCheckAllChange(val) {
			this.checkedStreet = val ? this.streetData : []
			isIndeterminate = false
			this.$emit("closeDoor",false)
			this.allDoorData = []
			this.checkedStreet.forEach(itm => {
				let doorTemp = doorData.filter(item => item.乡镇街道.includes(itm))
				if (doorTemp && doorTemp.length > 0) {
					this.allDoorData.push.apply(this.allDoorData, doorTemp)
				}
			});
			this.checkedStreet.forEach(itm => {
				let roadTemp = roadData.filter(item => item.properties['乡镇街道'] && item.properties['乡镇街道'].includes(itm))
				if (roadTemp && roadTemp.length > 0) {
					this.allDoorData.push.apply(this.allDoorData, roadTemp)
				}
			});
			this.total = this.allDoorData.length
			this.handleCurrentChange(1)

			this.totalStreet()
		},
		handleCheckedCitiesChange(value) {
			const checkedCount = value.length
			checkAll = checkedCount === this.streetData.length
			isIndeterminate = checkedCount > 0 && checkedCount < this.streetData.length
			this.$emit("closeDoor",false)
			this.allDoorData = []
			value.forEach(itm => {
				let doorTemp = doorData.filter(item => item.乡镇街道.includes(itm))
				if (doorTemp && doorTemp.length > 0) {
					this.allDoorData.push.apply(this.allDoorData, doorTemp)
				}
			});
			value.forEach(itm => {
				let roadTemp = roadData.filter(item => item.properties['乡镇街道'] && item.properties['乡镇街道'].includes(itm))
				if (roadTemp && roadTemp.length > 0) {
					this.allDoorData.push.apply(this.allDoorData, roadTemp)
				}
			});
			this.total = this.allDoorData.length
			this.handleCurrentChange(1)

			this.totalStreet()

		},
		handleSizeChange(val) {
			this.pagesize = val;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.curDoorData = this.allDoorData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
			this.loadDoorData(this.curDoorData);
		},
		searchData() {
			this.$emit("closeDoor",false)
			let doorResult = doorData.filter(item => item.POI.includes(this.search_content))
			let roadResult = roadData.filter(item => item.properties.name.includes(this.search_content))
			if (this.selectValue === '门牌') {
				this.allDoorData = doorResult
			} else if (this.selectValue === '道路') {
				this.allDoorData = roadResult
			} else {
				this.allDoorData = [...doorResult, ...roadResult]
			}
			if (this.allDoorData) {
				this.total = this.allDoorData.length
				this.handleCurrentChange(1)
			}
		},

		loadDoorData(data) {
			this.$emit("doorolate", data)
		},

		zoomto(data) {
			this.$emit("zoomtoDoor", data)
		},
		changeDataFn(data){
			this.dialogFormVisible = true
			if(data.type){
				this.dmType="乡道"
			}else{
				this.dmType="农村居民点"
			}
		},

		scrollLeft() {
			const allLength = this.streetData.length * 120
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength - 360 < boxLength) {
				listEl.style.left = '0px'
			} else {
				listEl.style.left = '-' + (leftMove - 360) + 'px'
			}
		},
		scrollRight() {
			const allLength = this.streetData.length * 120
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength + 360 > allLength) {
				listEl.style.left = '-' + (allLength - boxLength) + 'px'
			} else {
				listEl.style.left = '-' + (leftMove + 360) + 'px'
			}
		},
		panelFn() {
			// const rightPanel = document.getElementById('doorplate-right')
			// const panelBtn = document.getElementById('openbtn')
			// if(this.isOpen){
			// 	panelBtn.style.backgroundImage=this.panelImg.img_sq

			// }else{
			// 	panelBtn.style.backgroundImage=this.panelImg.img_zk
			// }
			this.isOpen = !this.isOpen
		},
		nameFormatter(row, column) {
			if (row.type) {
				return row.properties.name
			} else {
				return row.POI
			}
		},
		numberFormatter(row, column) {
			if (row.type) {
				return row.properties.OBJECTID
			} else {
				return row['门牌号']
			}
		},
		selectChange() {
			this.$emit("closeDoor",false)
			this.search_content = ''
			if (this.selectValue === '门牌') {
				this.allDoorData = doorData
			} else if (this.selectValue === '道路') {
				this.allDoorData = roadData
			} else {
				this.allDoorData = [...doorData, ...roadData]
			}
			this.total = this.allDoorData.length
			this.handleCurrentChange(1)
		},

	},
};
</script>
<style scoped>
::v-deep .el-dialog {
	-el-dialog-bg-color: #070e1acc !important;
	box-shadow: 0px 0px 4px 0px #4692ff inset !important;
}

::v-deep .el-dialog__title,
.el-form-item__label {
	color: white !important;
}

.scroll {
	overflow: hidden;
	display: flex;
}

.item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 3px 0;
}

.doorplate-left {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.3%;
	text-align: center;
}

/* .search_door {
	text-indent: 10%;
	color: white;
	background: url("@/assets/speed/case/civil/search.png") no-repeat;
	background-size: 100% 100%;
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
} */

.pageBtn {
	width: 10px;
	height: 18px;
}

.door_info {
	/* position: relative;
	margin: 14px 5px; */
	height: 85%;
	width: 100%;
}


.undoorTable,
.doorTable {
	height: 100%;
	--el-table-border-color: #0099ff;
}

::v-deep .el-table,
.el-table__expanded-cell {
	background: transparent;
}

::v-deep .el-table tr {
	background: transparent
}

::v-deep .el-table__header th {
	background-color: rgba(7, 26, 54, 0.8);
	color: white;
}

::v-deep .el-table__body td,
.el-table__header th,
.el-table .cell {
	background: rgba(7, 26, 54, 0.6);
}

::v-deep .el-table .el-table__body-wrapper {
	background: #3a536200;
	color: white;
}

::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
	background-color: rgb(47 235 253 / 45%);
}

/* .undoorTable {
	--el-table-border-color: #205C91;
	--el-table-row-hover-bg-color: rgb(47 235 253 / 45%);
	height: 100%;
	--el-table-text-color: #ffffff;
	--el-table-header-text-color: #35A7FF;
	--el-table-header-bg-color: #071A36;
} */

.el-table tr {
	background-color: rgba(10, 29, 59, 0.651);
}

.el-table {
	--el-table-bg-color: #ffffff00;
}

.page {
	position: absolute;
	right: 15px;
	bottom: 2%;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
	background-color: #16489300;
	border: 1px solid #35a7ff;
	color: #ffffff;
}

.el-pagination.is-background .btn-next:disabled,
.el-pagination.is-background .btn-prev:disabled {
	color: #ffffff;
	background-color: #ffffff00;
}

.el-table .el-table__body-wrapper {
	background: #f6f8f900;
}

.doorplate-bottom {
	width: 46%;
	height: 12%;
	position: fixed;
	z-index: 5;
	bottom: 2.7%;
	left: 27%;
}

.doorplate-info {
	background: url("@/assets/speed/case/civil/community1.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 65%;
	bottom: 28%;
	position: absolute;
	display: flex;
}

.doorplate-street {
	background: url("@/assets/speed/case/civil/bu_xzqb.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 60%;
	position: absolute;
	bottom: 0.2%;
}

.select {
	position: absolute;
	left: 45%;
	top: 8%;
	font-size: 15px;
	font-weight: 700;
	width: 10%;
	letter-spacing: 2.4px;
	background-image: -webkit-linear-gradient(bottom, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	--el-checkbox-bg-color: #ffffff00;
}


.monitor-list {
	display: flex;
	justify-content: space-between;
}

.streetname {
	border: transparent;
	background-color: transparent;
	position: absolute;
	width: 50%;
	left: 25%;
	top: 3%;
	--el-card-padding: 0
}

.btn {
	width: 20px;
	height: 20px;
	line-height: 100px;
	text-align: center;
	cursor: pointer;
	margin-top: 3%;
}

.btn:hover {
	background-color: #40a0ff7a;
	color: white;
}

.list-box {
	width: calc(30vw - 30px);
	overflow: hidden;
}

.list {
	width: calc(50vw - 50px);
	display: flex;
	transform: all 2s;

	position: relative;
	left: 0;
	transition: left 1s;
}

.chkLst {
	width: 65px;
	text-align: center;
	cursor: pointer;
	margin-left: 10px;
	font-weight: 700;
	color: white;
	--el-checkbox-bg-color: #ffffff00;
}

.doorplate-right {
	width: 21%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;
	background: url("@/assets/speed/case/civil/frame_y.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	text-align: center;
	transition: all 1s;
	transform: translateX(104%);
}

.doorplate-right[panelVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

#panelBtn {
	width: 8.5%;
    height: 16.1%;
    position: absolute;
    z-index: 5;
    left: -8.5%;
	top: 42%;
	background-size: 100% 100%;
	border: none;
	-el-button-hover-text-color: none;
	--el-button-hover-bg-color: none;
	--el-button-hover-border-color: none;
}

.open {
	background: url("@/assets/speed/case/civil/bt_sq.png") no-repeat;
}

.close {
	background: url("@/assets/speed/case/civil/bt_zk.png") no-repeat;
}

.mpshtj {
	width: 100%;
	height: 37%;
	padding: 2%;
	padding-top: 7%;
}

.unusualdoor {
	height: 55%;
	margin-top: 12%;
}

.message {
	background: url("@/assets/speed/case/civil/img_xx.png") no-repeat;
	background-size: 100% 100%;
	width: 36%;
	height: 44px;
	position: fixed;
	top: 12%;
	left: 32%;
	z-index: 10;
	color: #FFFFFF;
	font-size: 14PX;
	text-align: center;
	line-height: 3;
	padding-left: 4%;
	padding-right: 1%;
	display: flex;
}

.message-content {
	display: flex;
	margin-left: 4%;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
}

.test {
	position: absolute;
	z-index: 10;
	left: 36%;
	top: 16%;
}


/* .filter {
	display: flex;
	justify-content: space-around;
	padding-top: 10px;
}

.filter-button {
  color: #2D6EFB;
  border-color: #2D6EFB;
  border: 1px solid #2D6EFB;
  background: transparent;
}
.filter-button:hover{
  color: white;
  background-color: rgba(45, 110, 251, 0.8);
  border-color: rgba(45, 110, 251, 0.8);
} */

.input-search {
	/* text-indent: 10%; */
	color: white;
	background: url("@/assets/speed/case/civil/search.png") no-repeat;
	background-size: 100% 100%;
	margin: 12px;
	height: 40px;
	border: none;
}

.search_door {
	text-indent: 10%;
	color: white;
	background: transparent;
	width: 100%;
	line-height: 40px;
	border: none;
}

.search_btn {
	width: 40px;
	height: 40px;
	background-size: 100% 100%;
	background: url("@/assets/speed/case/civil/bt_ss.png") no-repeat;

	position: absolute;
	right: -4px;
	top: 5px;
}

.line {
	background: url("@/assets/speed/case/civil/line2.png") no-repeat;
	background-size: 100% 100%;
	width: 3px;
	height: 26px;
	position: absolute;
	left: 115px;
	top: 7px;
}

::v-deep .el-input__wrapper {
	background-color: transparent;
	box-shadow: none;
}

::v-deep .el-select {
	box-shadow: 0 0 0 transparent;
}

::v-deep .el-input.is-focus {
	box-shadow: 0 0 0 transparent;
}

::v-deep .el-input__wrappers {
	box-shadow: 0 0 0 transparent;
}

::v-deep .el-tabs__item {
	color: white;
}

::v-deep .el-tabs__item.is-active {
	color: var(--el-color-primary);
}

.tabs-style {
	margin-top: 10%;
}

.tabs-table {
	height: 400px;
}

.community-bottom {
	width: 46%;
	height: 12%;
	position: fixed;
	z-index: 5;
	bottom: 2.7%;
	left: 27%;
}

.community-info {
	background: url("@/assets/speed/case/civil/img_d.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 75%;
	/* bottom: 28%; */
	/* position: absolute; */
	display: flex;
	justify-content: space-evenly;

	margin-top: 12px;
}

.community-street {
	background: url("@/assets/speed/case/civil/bottom.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 50%;
	position: absolute;
	bottom: 0px;
}

.community {
	display: flex;
	align-items: stretch;
	justify-content: center;
	font-size: 14px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 600;
	text-align: center;
	color: #ffffff;
	line-height: 35px;
	cursor: pointer;
	letter-spacing: 2.4px;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			#ffffff 63%,
			#f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	cursor: pointer;
}

.community:hover {
	color: aquamarine;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			aquamarine 63%,
			aquamarine 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.communityhover {
	display: flex;
	align-items: stretch;
	justify-content: center;
	font-size: 14px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 600;
	text-align: center;
	line-height: 35px;
	cursor: pointer;
	letter-spacing: 2.4px;
	color: aquamarine;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			aquamarine 63%,
			aquamarine 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}



::v-deep .el-popper {
	background: rgb(30 46 64 / 80%) !important;
	border: 1px solid #017ede !important;
	box-shadow: 0px 0px 15px 0px #017ddd inset !important;
}
/* .el-dropdown-menu {
	background-color: #ffffff00 !important;
	color: #fff;
}*/

.selectItem {
	color: #fff;
}

.fujian {
	/* line-height: 30px;
	font-size: 12px;
	padding: 0 10px; */
	cursor: pointer;
}

.fujian img {
	width: 15px;
	height: 15px;
	margin-bottom: -3px;
}
</style>
