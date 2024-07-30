<template>
	<div class="tourism-left">
		<div class="xfyl" :class="xfyl.checked ? 'xfyl_Active' : ''" @click="xfylFn()">
		</div>
		<div class="content-left">

			<div class="tourism-legend">
				<div class="tourism-legend-name"></div>
			</div>
			<div class="tourism-left-buttons">
				<div class="tourism-button" v-for="item in tourismButtons" :key="item.id"
					:class="{ 'button-padding0': item.padding0, 'button-padding1': item.padding1 }">
					<img class="button-image" :src="item.checked ? item.checkedImage : item.uncheckedImage"
						@click="checkFn(item)">
					<p class="button-name">{{ item.name }}</p>
				</div>
			</div>
		</div>
	</div>
	<div class="tourism-bottom">
		<div class="tourism-info">
			<el-card>
				<div class="monitor-list">
					<!-- 左边按钮 -->
					<div class="btn" @click="scrollLeft">
						<el-image :src="imgList.alive" />
					</div>
					<!-- 中间列表 -->
					<div id="list-box" class="list-box">
						<div id="list" class="list">
							<div class="list-item" v-for="(item, index) in scenicSpots" :key="index"
								:style="item.status == 1 ? 'color: #05E8FE' : 'color: #ffffff'" @click="clickFn(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
					<!-- 右边按钮 -->
					<div class="btn" @click="scrollRight">
						<el-image :src="imgList.down" />
					</div>
				</div>
			</el-card>
		</div>
		<div class="tourism-item">
			景区
		</div>
	</div>
	<div class="tourism-right" :panelVisible="isOpen">
		<el-button id="panelBtn" :class="isOpen === false ? 'close' : 'open'" @click="panelFn()"></el-button>
		<div class="jqjj">
			<div class="jqjj_back">
				<el-carousel arrow="never">
					<el-carousel-item v-for="(item, index) in travels" :key="index">
						<el-image class="jqjj_img" :src=item.pic fit="fill" />
						<div class="jqjj_content">
							{{ item.content }}
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
			<div class="jqjj_title"></div>
		</div>
		<div class="klcz">
			<div class="klcz_back">
				<div class="kl_echart" ref="chartKLCZ"></div>
				<div class="kl_content">
					<div class="rkll">
						<div class="rkll_title">日客流量</div>
						<div class="rkll_num">
							<div class="rkll_font">2000</div>
							<div class="rkll_title">人</div>
						</div>
					</div>
					<div class="maxkll">
						<div class="rkll_title">最大承载 客流量</div>
						<div class="maxkll_num">
							<div class="maxkll_font">10000</div>
							<div class="rkll_title">人</div>
						</div>
					</div>
					<div class="gfsj">
						<div class="gfsj_title">预测高峰时间：</div>
						<div class="gfsj_date">13:00</div>
					</div>
				</div>
			</div>
			<div class="klcz_title"></div>
		</div>
		<div class="mp">
			<div class="mp_back">
				<div class="mpjg">
					<div>门票价格</div>
					<div>
						<span class="jqmp-content-num">60</span>
						元
					</div>
				</div>

				<div class="jqqj">
					<el-button type="text" class="jqqj-btn" @click="showPanorama"></el-button>
				</div>
			</div>
			<div class="mp_title"></div>
		</div>

	</div>
	<div class="speciality-List" :panelVisible="isShow_tscp">
		<div class="speciality-content">
			<el-scrollbar>
				<div class="speciality_item" v-for="(item, index) in tscpInfo" :key="index">
					<el-image class="speciality-img" :src=item.img fit="fill" @click="zoomToShop(item.shopid)"/>
					<div class="speciality-intr">
						<div class="speciality-title">{{ item.title }}</div>
						<div class="speciality-text">{{ item.text }}</div>
						<div class="shop-tel">
							<img :src="require('@/assets/speed/case/civil/ic_dh.png')" alt="" />
							{{ item.tel.trim() }}
						</div>
						<div class="shop-address" @click="zoomToShop(item.shopid)">
							<img :src="require('@/assets/speed/case/civil/ic_dz.png')" alt="" />
							{{ item.address.trim() }}
						</div>
						<div class="shop-name">{{ item.storeName }}
							<img class="store-img" :src="require('@/assets/speed/case/civil/shopping.png')" alt="" title="跳转到网店"
							v-if="item.store!=undefined" @click="openShop(item.store)"/>
						</div>
					</div>
				</div>
			</el-scrollbar>

		</div>
		<div class="tj_video" @click="openVideo">
			同江市文旅门户网站
		</div>
		<el-pagination class="page" background small layout="prev, pager, next" @size-change="handleSizeChange"
			@current-change="handleCurrentChange" :page-size="pagesize" :total="total" />
	</div>

	<div class="tourism-popup" id="customPopup">
		<div class="popuptitle">
			<div class="popupname">{{ customPopupData.storeName }}</div>
			<span class="close-button" @click="closePopup">×</span>
		</div>
		<div class="popup-item" v-for="(item, index) in customPopupData.data" :key="index">
			<el-image class="popup-img" :src=item.img fit="fill" />
			<div class="popup-content">
				<div class="popup-title">{{ item.title }}</div>
				<div class="popup-text">{{ item.text }}</div>
			</div>
		</div>
		<div class="store-info" v-if="customPopupData.data.length > 0">
			<div class="store-item">
				<!-- <div>名称：{{ customPopupData.storeName }}</div> -->
				<div v-if="customPopupData.address">地址：{{ customPopupData.address }}</div>
				<div v-else>地址：XXX街道XXX路XXX号</div>
			</div>
			<div class="store-item">
				<div v-if="customPopupData.phone">电话：{{ customPopupData.phone }}</div>
				<div v-else>电话：0454-XXXXXXX</div>
				<div>网店地址：
					<a class="a-style" href="about:blank" target="_blank">{{ customPopupData.storeName }}</a>
				</div>
			</div>
		</div>
	</div>

	<div class="hotel-popup" id="hotelPopup">
		<div class="popuptitle">
			<div class="popupname">{{ customPopupData.storeName }}</div>
			<span class="close-button" @click="closePopup">×</span>
		</div>
		<div class="popup-item1" v-for="(item, index) in customPopupData.data" :key="index">
			<el-image class="popup-img1" :src=item.img fit="fill" />
			<div class="popupContent" v-if="customPopupData.data.length > 0">
				<div v-if="customPopupData.phone">电话：{{ customPopupData.phone }}</div>
				<div v-else>电话：0454-XXXXXXX</div>
				<div v-if="customPopupData.address">地址：{{ customPopupData.address }}</div>
				<div v-else>地址：XXX街道XXX路XXX号</div>
				<div>预定入口：
					<a class="a-style" href="about:blank" target="_blank">{{ customPopupData.storeName }}</a>
				</div>
			</div>
		</div>
	</div>

	<div id="travelPopup" class="travelPopup">
		<div class="popuptitle">
			<div class="popupname">旅游景点</div>
			<span class="close-button" @click="closTravelPopup">×</span>
		</div>
		<div class="travel_item">名称：<span class="travel_content">{{ travelPopupData.name }}</span></div>
		<div class="travel_item travel_intr">简介：<div class="travel_content">{{ travelPopupData.intr }}</div>
		</div>
		<div class="travel_item">营业时间：<span class="travel_content">{{ travelPopupData.yysj }}</span></div>
		<div class="travel_item">联系电话：<span class="travel_content">{{ travelPopupData.tel }}</span></div>
		<div class="travel_item">地址：<span class="travel_content">{{ travelPopupData.address }}</span></div>
		<div class="travelPic">
			<el-image class="travel-pic" :src="require('@/assets/speed/case/civil/pic/1.jpg')" fit="fill"
				hide-on-click-modal="true" />
			<el-image class="travel-pic" :src="require('@/assets/speed/case/civil/pic/2.jpg')" fit="fill"
				hide-on-click-modal="true" />
			<el-image class="travel-pic" :src="require('@/assets/speed/case/civil/pic/3.jpg')" fit="fill"
				hide-on-click-modal="true" />

		</div>
	</div>
</template>

<script>
import * as Speed from "@/cesiumSDK/index"
import pathRoam from "@/cesiumSDK/core/roam/pathRoam"
import ModelInfo from '@/utils/modelInfo'
import * as uuid from "uuid"
import * as echarts from "echarts";


// let manModelPath = 'http://36.152.66.51:8088/3dtiles/gltf/walkman/scene.gltf'
let manModelPath = 'http://36.152.66.51:8088/3dtiles/gltf/walk.gltf'
// let carModelPath = 'models/CesiumMilkTruck/CesiumMilkTruck.glb'
let carModelPath = 'http://36.152.66.51:8088/3dtiles/gltf/FireTruck.glb'

export default {
	name: "tourism",
	data() {
		return {
			isShow_tscp: false,
			isOpen: true,
			travels: [
				{
					id: 'travel-1',
					position: [132.837667, 47.936381, 55.6],
					name: "街津口赫哲乡XXX公园",
					intr: "街津口位于黑龙江下游的同江县境内，距离同江市区东北45公里处，正如一位赫哲族诗人所描写的“街津口，街津山，峰环三面水一湾，应是地灵人杰处，不亚塞北小江南”。这里是赫哲族的聚居地，游客可深入当地人家，领略赫哲族以捕鱼为生的特有风俗。",
					yysj: "周一至周日 07:00-22:00",
					tel: "135XXXXXXXX",
					address: "同江市渔业村外环路",
					img: require("@/assets/speed/case/civil/POI/dm/lydjq.png"),

					pic: require('@/assets/speed/case/civil/jqtp_3.png'),
					content: '街津山国家森林公园位于同江市区东北45公里，街津口赫哲族乡境内。街津山属完达山余脉低山区，有着良好的植被覆盖，轮廓线条优美，有江水相伴，远望秀丽多姿，黑龙江水年年月月冲涮沿岸的岩石，雕塑成众多景观资源，形成悬崖峭壁水深流急，形成的浅滩鱼虾游嬉。森林公园范围内主要有黑龙江、莲花河、得日乞河、头道河、二道河等，素有"三水绕街津"的美称。'
				},
				{
					id: 'travel-2',
					position: [132.838043, 47.933059, 63.9],
					name: "赫哲族历史博物馆",
					intr: "赫哲族博物馆始建于2000年10月份，于2002年10月份正式向游人开放。博物馆占地面积10000平方米，建筑面积1470平方米，平均每年接待中外游客3万多人次。赫哲族博物馆是全国唯一的一座藏品较丰富，风格独特，能较为全面展示和介绍赫哲族政治、经济、文化、历史、渔猎生产生活、宗教信仰和风俗习惯的民族博物馆，2006年被国家民委批准为“全国民族团结进步教育基地”。2018年9月，经过博物馆自评申报，省级博物馆行业组织评定，全国博物馆评估委员会组织专家复核，并报请国家文物局备案，中国博物馆协会决定同意同江市赫哲族博物馆为第三批国家三级博物馆。",
					yysj: "周一至周日 08:00-17:00",
					tel: "13512637111",
					address: "同江市外环路街津口边防派出所西侧约170米",
					img: require("@/assets/speed/case/civil/POI/dm/lydjq.png"),

					pic: require('@/assets/speed/case/civil/jqtp_4.png'),
					content: "这里植物种类繁多，高等植物有59种，属于23个科、34个属。林地主要生长着天然次生林，以柞、桦、杨为主，伴生椴、槐、黄菠萝、水曲柳、核桃楸等几十种阔叶树及人工栽植的落叶松、樟子松、云杉等针叶树，生长着榛子、胡枝子等十种小灌木，盛产红豆果、山葡萄、山荆子等十几种野果，各种花草和五味子、防风、党参等一百多种药用植物，还生长着丰富的黄花菜、蕨菜、薇菜以及山珍猴头、木耳、蘑菇等。"
				},
				{
					id: 'travel-3',
					position: [132.842493, 47.938145, 60.1],
					name: "赫哲族旅游度假区",
					intr: "国家AAA级旅游区街津口赫哲族旅游度假区位于同江市街津口赫哲族乡，景区依山傍水，风景秀丽，而世代以渔猎为生的赫哲有的风土人情又赋予这里丰富的文化内涵。风景名胜街津口旅游度假区主体景区赫哲民族风情园，是以赫哲人特人的民族文化为底蕴，以自然风光为依托，集观赏、考察、餐饮、游乐为一体的旅游区。",
					yysj: "周一至周日 08:00~18:00",
					tel: "135XXXXXXXX",
					address: "同江市东北45公里处",
					img: require("@/assets/speed/case/civil/POI/dm/lydjq.png"),

					pic: require('@/assets/speed/case/civil/elsfqy.png'),
					content: "森林公园内植被繁茂，野生动物资源也十分丰富。远近闻名，风姿秀美，景色迷人。夏季阳光明媚，山青水绿，景雅境幽，气候爽人，是疗养避暑的佳境。冬季冰封雪罩，银装素裹，北国风光，得天独厚，是溜冰赏雪的好地方。令人神往的名胜古迹和自然风光，有仙人洞、老人石、原始林、寒葱沟、奇石坡、怪树林等景点，实为游客必赏之处。"
				}

			],

			xfyl: {
				checked: false,
				uncheckedImage: require("@/assets/speed/case/civil/bt_xfyl_nor.png"),
				checkedImage: require("@/assets/speed/case/civil/bt_xfyl_sel.png"),
			},
			tourismButtons: [
				{
					id: "gglx",
					name: "观光路线",
					uncheckedImage: require("@/assets/speed/case/civil/ic_gglx_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_gglx_sel.png"),
					checked: false,
					image: require("@/assets/speed/case/civil/img_gglx.png"),
					positions: [[
						132.835735,
						47.936751,
						56.9
					],
					[
						132.835777,
						47.936607,
						56.5
					],
					[
						132.83568,
						47.936417,
						56.3
					],
					[
						132.835304,
						47.936049,
						56.5
					],
					[
						132.835471,
						47.935849,
						56.5
					],
					[
						132.836499,
						47.935052,
						55.7
					],
					[
						132.836969,
						47.935277,
						55.6
					],
					[
						132.837984,
						47.935392,
						55.7
					],
					[
						132.838694,
						47.936307,
						55.7
					],
					[
						132.839031,
						47.936713,
						55.8
					],
					[
						132.838419,
						47.937542,
						57.5
					]]
				},
				{
					id: "tstd",
					name: "逃生通道",
					uncheckedImage: require("@/assets/speed/case/civil/ic_tstd_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_tstd_sel.png"),
					checked: false,
					padding0: true,
					image: require("@/assets/speed/case/civil/img_tstd.png"),
					// positions: [132.846072, 47.931273, 132.845878, 47.931247, 132.845543, 47.930952, 132.845092, 47.930698 , 132.844092, 47.930402]
					//positions: [132.846072, 47.931273, 132.845878, 47.931247, 132.84521, 47.931058, 132.844979, 47.93123, 132.844652, 47.931606, 132.843252, 47.931110]
					positions: [132.836561, 47.936107, 132.836473, 47.936217, 132.836266, 47.936112, 132.836029, 47.936184, 132.835831, 47.936191,
						132.83564, 47.936092, 132.835378, 47.935836, 132.834854, 47.935751, 132.834479, 47.935514]
				},
				{
					id: "xfsb",
					name: "消防设备",
					uncheckedImage: require("@/assets/speed/case/civil/ic_xfsb_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_xfsb_sel.png"),
					checked: false,
					padding1: true,
					image: require("@/assets/speed/case/civil/xfss.png")
				},
				{
					id: "ms",
					name: "美食",
					uncheckedImage: require("@/assets/speed/case/civil/ic_ms_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_ms_sel.png"),
					checked: false,
					padding1: true,
					image: require("@/assets/speed/case/civil/ms.png")
				},
				{
					id: "zs",
					name: "住宿",
					uncheckedImage: require("@/assets/speed/case/civil/ic_zs_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_zs_sel.png"),
					checked: false,
					padding0: true,
					image: require("@/assets/speed/case/civil/zs.png")
				},
				{
					id: "tscp",
					name: "特色产品",
					uncheckedImage: require("@/assets/speed/case/civil/ic_tscp_nor.png"),
					checkedImage: require("@/assets/speed/case/civil/ic_tscp_sel.png"),
					checked: false,
					image: require("@/assets/speed/case/civil/tc.png")
				},
			],
			scenicSpots: [
				{ id: 1, name: '天赐湖', status: 0 },
				{ id: 2, name: '钓鱼台景区', status: 0 },
				{
					id: 3,
					name: '湿地公园',
					status: 0,
					checked: false,
					//positions: [132.842755, 47.931824, 70, 132.847703, 47.933464, 75, 132.848335, 47.931366, 90, 132.844783, 47.929905, 75, 132.843468, 47.930808, 70, 132.842755, 47.931824, 70],
					//minimumHeights: [65, 70, 85, 70, 65, 65]
					positions: [132.834036, 47.935852, 70.5, 132.834579, 47.936109, 68.7, 132.834716, 47.936272, 68.5, 132.835611, 47.936788, 68.8,
						132.838842, 47.93777, 69.9, 132.839602, 47.936538, 69.8, 132.839392, 47.936379, 70, 132.838877, 47.936146, 69.7,
						132.838338, 47.935309, 69.9, 132.838195, 47.935206, 68.7, 132.837501, 47.935061, 68.3, 132.836991, 47.935102, 68.2,
						132.836381, 47.934828, 68.3, 132.835796, 47.934521, 68.6, 132.835231, 47.934995, 70.6, 132.834036, 47.935852, 70.5],
					minimumHeights: [59.5, 57.7, 57.5, 57.8, 58.9, 58.8, 59, 58.7, 58.9, 57.7, 57.3, 57.2, 57.3, 59.6, 59.6, 59.5]
				},
				{ id: 4, name: '胜利公园', status: 0 },
				{ id: 5, name: '俄罗斯风情园', status: 0 },
				{ id: 6, name: '沿江公园', status: 0 },
				{ id: 7, name: '哈鱼岛桥头', status: 0 },
				{ id: 8, name: '勤得利山', status: 0 },
				{ id: 9, name: '勤得利岛', status: 0 },
				{ id: 10, name: '八岔岛', status: 0 },
				{ id: 11, name: '额图山', status: 0 },
				{ id: 12, name: '三江口旅游区', status: 0 },

			],
			imgList: {
				alive: require('@/assets/speed/case/civil/leftarrow.png'),
				down: require('@/assets/speed/case/civil/rightarrow.png')
			},
			pointData: {
				gglx: [
				],
				tstd: [
				],
				xfsb: [
					{
						id: 'xfsb-1',
						position: [132.835758, 47.937264, 57.4],
						data: []
					},
					{
						id: 'xfsb-2',
						position: [132.836371, 47.93611, 57.5],
						data: []
					}
				],
				ms: [
					{
						id: 'ms-1',
						position: [132.840321, 47.935916, 65.3],
						storeName: '赫哲全鱼村',
						phone: '15845193131',
						address: '同江市乌日贡大街与外环路交叉口东南140米',
						data: [
							{
								img: require('@/assets/speed/case/civil/qyy.jpg'),
								title: "赫哲全鱼宴",
								text: "由鱼为主食材制作而成，是最具地方民族特色的传统美食，包含了食鱼文化的精髓，体现了赫哲族饮食文化的独特和源远流长。"
							},
						]
					},
					{
						id: 'ms-2',
						position: [132.836649, 47.937434, 67.6],
						storeName: '旺江鸿鱼村',
						phone: '15845193131',
						address: '同江市街津口赫哲族乡',
						data: [
							{
								img: require('@/assets/speed/case/civil/dbnjc.jpg'),
								title: "东北农家菜",
								text: "以炖、酱、烤为主要特点，粗线条的东北菜，不拘泥于细节，颇像粗狂的东北人。猪肉炖粉条、小鸡炖蘑菇、大鹅炖酸菜，量大份足，若佐以醇厚的高粱烧酒，便由几分豪气从胃中升腾，充满了塞外的气息。"
							},
						]
					},

				],
				zs: [
					{
						id: 'zs-1',
						position: [132.841628, 47.933213, 70.1],
						storeName: '同江赫乡民族饭庄',
						phone: '(0454)2985558',
						address: '同江市乌日贡大街乡政府旁',
						data: [
							{
								img: require('@/assets/speed/case/civil/shjgjjd.jpg'),
								title: "同江赫乡民族饭庄",
								text: ""
							},
						]
					},
					{
						id: 'zs-2',
						position: [132.841161, 47.933936, 65.2],
						storeName: '赫哲渔家酒店',
						phone: '18645438237',
						address: '赫哲族乡人民政府北侧约190米',
						data: [
							{
								img: require('@/assets/speed/case/civil/bjgjwqjd.jpg'),
								title: "赫哲渔家酒店",
								text: ""
							},
						]
					}
				],
				tscp: [
					{
						id: 'tscp-1',
						position: [132.840892, 47.93492, 67],
						storeName: '特色农产品旗舰店',
						tel: "138XXXXXXXX",
						address: "同江市赫哲族乡乌日贡大街XX号",
						data: [
							{
								img: require('@/assets/speed/case/civil/tjdd.jpg'),
								title: "同江大豆",
								text: "同江大豆为地理标志证明商标。大豆原产中国，中国各地均有栽培，亦广泛栽培于世界各地。大豆是中国重要粮食作物之一，已有五千年栽培历史，古称菽，中国东北为主产区，是一种其种子含有丰富植物蛋白质的作物。"
							},
						]
					},
					{
						id: 'tscp-2',
						position: [132.842533, 47.93242, 66.7],
						storeName: '街津口乡特色产品旗舰店',
						tel: "159XXXXXXXX",
						address: "同江市赫哲族乡乌日贡大街XX号",
						data: [
							{
								img: require('@/assets/speed/case/civil/tjyz.jpg'),
								title: "鱼籽",
								text: "鱼籽，是鱼卵腌制或干制品的统称。用大麻哈鱼卵加工制成的称为红鱼籽；用鲟鳇鱼卵制成的为墨鱼籽。还有鲐鱼籽、大黄鱼籽等。鱼籽的蛋白质含量高，脂肪多。食用时加配料和适量的水搅成糊状后蒸、炒，也可做凉拌菜。"
							},
							{
								img: require('@/assets/speed/case/civil/ys.jpg'),
								title: "鱼毛",
								text: "鱼毛是营养健康食品。鱼毛含有人体所需的多种必需氨基酸和维生素B1、维生素B2、尼克酸以及钙、磷、铁等无机盐，可溶性蛋白多，脂肪熔点低。鱼毛制品易被人体消化吸收，对儿童和病人的营养摄取很有帮助。"
							}
						]
					},
					{
						id: 'tscp-3',
						position: [132.841522, 47.933945, 65.24],
						storeName: '赫哲族工艺品旗舰店',
						tel: "134XXXXXXXX",
						address: "同江市赫哲族乡乌日贡大街XX号",
						data: [
							{
								img: require('@/assets/speed/case/civil/ypgyp.jpg'),
								title: "鱼皮工艺品",
								text: "赫哲族“鱼皮艺术”是由鱼皮服饰工艺发展而来的，逐渐衍变出雕镂、拼贴、缝制等艺术形式。精美的鳞纹，神奇的造型，苍朴的韵味，神秘的内涵，这一独具魅力的艺术不失为“艺术珍品，民间瑰宝”。"
							},
							{
								img: require('@/assets/speed/case/civil/yggyp.jpg'),
								title: "鱼骨工艺品",
								text: "赫哲族鱼骨工艺，是赫哲族老渔民孙有财在赫哲族传统的桦皮、木雕工艺基础上开掘而成的，堪称赫哲族文化园林里的一株奇葩。被国家文化部认定为“中华一绝”。"
							}
						]
					},
				]
			},
			billbordList: {},
			labelList: {},
			lineList: {},
			showInfo: false,
			tscpInfo: [
				{
					shopid: 'tscp-1',
					position: [132.840892, 47.93492, 67],
					storeName: '特色农产品旗舰店',
					tel: "138XXXXXXXX",
					address: "同江市赫哲族乡乌日贡大街XX号",
					img: require('@/assets/speed/case/civil/tjdd.jpg'),
					title: "同江大豆",
					text: "同江大豆为地理标志证明商标。大豆原产中国，中国各地均有栽培，亦广泛栽培于世界各地。大豆是中国重要粮食作物之一，已有五千年栽培历史，古称菽，中国东北为主产区，是一种其种子含有丰富植物蛋白质的作物。"
				},
				{
					shopid: 'tscp-2',
					position: [132.842533, 47.93242, 66.7],
					storeName: '街津口乡特色产品旗舰店',
					tel: "159XXXXXXXX",
					address: "同江市赫哲族乡乌日贡大街XX号",
					img: require('@/assets/speed/case/civil/tjyz.jpg'),
					title: "同江鱼籽",
					text: "鱼籽，是鱼卵腌制或干制品的统称。用大麻哈鱼卵加工制成的称为红鱼籽；用鲟鳇鱼卵制成的为墨鱼籽。还有鲐鱼籽、大黄鱼籽等。鱼籽的蛋白质含量高，脂肪多。食用时加配料和适量的水搅成糊状后蒸、炒，也可做凉拌菜。"
				},
				{
					shopid: 'tscp-2',
					position: [132.842533, 47.93242, 66.7],
					storeName: '街津口乡特色产品旗舰店',
					tel: "159XXXXXXXX",
					address: "同江市赫哲族乡乌日贡大街XX号",
					img: require('@/assets/speed/case/civil/ys.jpg'),
					title: "鱼毛",
					text: "鱼毛是营养健康食品。鱼毛含有人体所需的多种必需氨基酸和维生素B1、维生素B2、尼克酸以及钙、磷、铁等无机盐，可溶性蛋白多，脂肪熔点低。鱼毛制品易被人体消化吸收，对儿童和病人的营养摄取很有帮助。"
				},
				{
					shopid: 'tscp-3',
					position: [132.841522, 47.933945, 65.24],
					storeName: '赫哲族工艺品旗舰店',
					tel: "134XXXXXXXX",
					address: "同江市赫哲族乡乌日贡大街XX号",
					img: require('@/assets/speed/case/civil/ypgyp.jpg'),
					title: "鱼皮工艺品",
					text: "赫哲族“鱼皮艺术”是由鱼皮服饰工艺发展而来的，逐渐衍变出雕镂、拼贴、缝制等艺术形式。精美的鳞纹，神奇的造型，苍朴的韵味，神秘的内涵，这一独具魅力的艺术不失为“艺术珍品，民间瑰宝”。",
					store:"https://shop60660708.taobao.com/category-1230751024.htm?spm=a1z10.3-c.w4010-724311928.7.11c1153cs0R2Cl&search=y&catName=%BA%D5%D5%DC%D7%E5%D3%E3%C6%A4%B9%A4%D2%D5%C6%B7#bd"

				},
				{
					shopid: 'tscp-3',
					position: [132.841522, 47.933945, 65.24],
					storeName: '赫哲族工艺品旗舰店',
					tel: "134XXXXXXXX",
					address: "同江市赫哲族乡乌日贡大街XX号",
					img: require('@/assets/speed/case/civil/yggyp.jpg'),
					title: "鱼骨工艺品",
					text: "赫哲族鱼骨工艺，是赫哲族老渔民孙有财在赫哲族传统的桦皮、木雕工艺基础上开掘而成的，堪称赫哲族文化园林里的一株奇葩。被国家文化部认定为“中华一绝”。"
				}
			],
			customPopupData: {
				data: []
			},
			travelPopupData: {}
		}
	},
	created() {
	},
	mounted() {
		this.initBillbordList()
		this.path = new pathRoam(this.$map._viewer)
		this.$emit(
			"loadYYCModel",
			{
				name: "渔业村",
				modelUrl: ModelInfo.yuyecun,
				alt: -15.00,
			}
		);
		this.clickFn(this.scenicSpots[2])

		this.loadTravelPoint()

		this.createPieChart(this.$refs["chartKLCZ"])
	},
	methods: {
		zoomToShop(shopid) {
			this.closePopup()
			this.closTravelPopup()
			let shopInfo = this.pointData.tscp.filter((i) => i.id == shopid)[0];
			if (!shopInfo) return
			this.customPopupData = shopInfo
			let lng = Number(shopInfo.position[0])
			let lat = Number(shopInfo.position[1])
			let height = Number(shopInfo.position[2])
			this.$map.flyto({
				destination: Speed.Cesium.Cartesian3.fromDegrees(lng, lat - 0.006, 500),
				orientation: {
					heading: Cesium.Math.toRadians(0),
					pitch: Cesium.Math.toRadians(-30),
					roll: Cesium.Math.toRadians(0)
				},
				duration: 1,
			})
			let that = this;
			let popupHtml = document.getElementById("customPopup");
			popupHtml.style.display = "block";

			this.$map._viewer.scene.preRender.addEventListener(function () {
				let position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
				let canvasPosition = that.$map._viewer.scene.cartesianToCanvasCoordinates(
					position
				);
				if (Cesium.defined(canvasPosition)) {
					popupHtml.style.position = "fixed";
					popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight - 80 + "px";
					popupHtml.style.left = canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
				}

			});

		},
		panelFn() {
			this.isOpen = !this.isOpen
			if (this.isShow_tscp) {
				this.isShow_tscp = false
			}
		},
		loadTravelPoint() {
			let points = []
			if (!this.travelList) {
				this.travelList = new Speed.Cesium.BillboardCollection({
					scene: this.$map._viewer.scene,
				})
				this.$map._viewer.scene.primitives.add(this.travelList);
				this.travelLabelList = new Speed.Cesium.LabelCollection({
					scene: this.$map._viewer.scene,
				});
				this.$map._viewer.scene.primitives.add(this.travelLabelList);
			}
			this.travels.forEach((travel) => {
				let position = travel.position
				let point = Speed.Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
				points.push(point)
				this.travelList.add({
					id: travel.id,
					position: point,
					scale: 0.3,
					image: travel.img,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),

				})
				this.travelLabelList.add({
					id: travel.id,
					position: point,
					text: travel.name,
					font: "14px sans-serif bold",
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					pixelOffset: new Cesium.Cartesian2(0, -70),
					//disableDepthTestDistance: Number.POSITIVE_INFINITY,
					fillColor: Cesium.Color.WHITE,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
				});
			})

			if (points.length > 0) {
				this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(points))
			}
			this.bindPopup()
		},
		bindPopup() {
			if (!this.popupevent) {
				this.popupevent = new Speed.Cesium.ScreenSpaceEventHandler(
					this.$map._viewer.scene.canvas
				);
				this.popupevent.setInputAction((movement) => {
					let pickedObject = this.$map._viewer.scene.pick(
						movement.position
					)
					if (pickedObject && pickedObject.id && pickedObject.primitive) {
						let selectData
						for (let i = 0; i < this.travels.length; i++) {
							if (this.travels[i].id === pickedObject.id) {
								selectData = this.travels[i]
								break
							}
						}
						if (selectData) {
							this.travelPopupData = selectData
							this.addtravelPopup(selectData.position, { top: 20, left: 30 })
						} else {
							this.closTravelPopup()
						}
					} else {
						this.closTravelPopup()
					}



				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK)
			}
		},
		addtravelPopup(point, offset) {
			let popup = document.getElementById("travelPopup")
			popup.style.display = "block"

			let result = new Speed.Cesium.Cartesian2()
			this.$map._viewer.scene.preRender.addEventListener(() => {
				let position = Speed.Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2])
				let canvasPosition = this.$map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Speed.Cesium.defined(canvasPosition)) {
					popup.style.position = "fixed"
					popup.style.top = canvasPosition.y - popup.offsetHeight + offset.top + "px"
					popup.style.left = canvasPosition.x + offset.left + "px"
				}
			})
		},
		closTravelPopup() {
			let popup2 = document.getElementById("travelPopup")
			popup2.style.display = "none"
		},

		xfylFn() {
			this.xfyl.checked = !this.xfyl.checked
			if (this.xfyl.checked) {
				this.path.quit()
				let firePosition = [132.83484, 47.935952, 62.5]
				this.createFireParticle(firePosition)
				this.$map._viewer.camera.flyTo({
					destination: Speed.Cesium.Cartesian3.fromDegrees(132.83484, 47.933802, 450),
					orientation: {
						heading: Speed.Cesium.Math.toRadians(0),
						pitch: Speed.Cesium.Math.toRadians(-60),
						roll: 0.0
					},
					complete: this.fireDrill
				})

			} else {
				this.$map._viewer.trackedEntity = undefined
				this.path.quit()
				this.intervalA && clearInterval(this.intervalA)
				this.intervalB && clearInterval(this.intervalB)
				this.removeCallback && this.removeCallback()
				this.intervalA = undefined
				this.intervalB = undefined
				this.removeCallback = undefined
				this.removeFireParticle()
				this.removeWaterParticle()
			}
		},
		checkFn(item) {
			this.closePopup()
			this.closTravelPopup()
			item.checked = !item.checked
			if (item.checked) {
				this.closeOtherItem(item)
			}
			this.setItemVisible(item)
		},
		setItemVisible(item) {

			if (item.id === 'gglx') {
				if (item.checked) {
					let manGoTime = [
						"2023-04-01T14:05:00Z",
						"2023-04-01T14:10:00Z",
						"2023-04-01T14:15:00Z",
						"2023-04-01T14:20:00Z",
						"2023-04-01T14:25:00Z",
						"2023-04-01T14:30:00Z",
						"2023-04-01T14:35:00Z",
						"2023-04-01T14:40:00Z",
						"2023-04-01T14:45:00Z",
						"2023-04-01T14:50:00Z",
						"2023-04-01T14:55:00Z",
					]
					let manRoamParam = {
						modelPath: manModelPath,
						modelGoTime: manGoTime,
						modelGoPoints: item.positions,
						// 模型显示的最大像素值
						maxSize: 80,
						// 模型显示的最小像素值
						minSize: 40,
						smooth: 30,
						// scale: 12000,
						scale: 0.1,
						lineWidth: 30,
					}
					let promise = this.path.start(manRoamParam)
					let points = []
					item.positions.forEach((position) => {
						let point = Speed.Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
						points.push(point)
					})
					if (points.length > 0 && promise) {
						promise.then(() => {
							this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(points))
						})
					}
				} else {
					this.path.quit()
				}

			}
			// else if (item.id === 'xfsb') {
			// 	if (item.checked) {
			// 		let firePosition = [132.845036, 47.931608, 70.24]
			// 		this.createFireParticle(firePosition)
			// 		this.$map._viewer.camera.flyTo({
			// 			destination: Speed.Cesium.Cartesian3.fromDegrees(132.844963, 47.9305, 250),
			// 			orientation: {
			// 				heading: Speed.Cesium.Math.toRadians(0),
			// 				pitch: Speed.Cesium.Math.toRadians(-60),
			// 				roll: 0.0
			// 			},
			// 			complete: this.fireDrill
			// 		})

			// 	} else {
			// 		this.$map._viewer.trackedEntity = undefined
			// 		this.path.quit()
			// 		this.intervalA && clearInterval(this.intervalA)
			// 		this.intervalB && clearInterval(this.intervalB)
			// 		this.removeCallback && this.removeCallback()
			// 		this.intervalA = undefined
			// 		this.intervalB = undefined
			// 		this.removeCallback = undefined
			// 		this.removeFireParticle()
			// 		this.removeWaterParticle()
			// 	}
			// }
			else {
				this.setBillbordVisble(item)
				this.setLineVisible(item)
			}
		},
		closeOtherItem(currentItem) {
			this.tourismButtons.forEach((item) => {
				if (item.id !== currentItem.id) {
					item.checked = false
					this.setItemVisible(item)
				}
			})
		},
		clickFn(item) {
			item.checked = !item.checked
			if (item.id === 3) {
				item.status = item.checked ? 1 : 0
				this.showInfo = item.checked
				if (item.checked) {
					this.locationScenicSpot(item)
				} else {
					this.removeLocationEntity()
				}
			}
		},
		// 左滑动逻辑
		scrollLeft() {
			const allLength = this.scenicSpots.length * 85
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength - 340 < boxLength) {
				listEl.style.left = '0px'
			} else {
				listEl.style.left = '-' + (leftMove - 340) + 'px'
			}
		},
		// 右滑动逻辑
		scrollRight() {
			const allLength = this.scenicSpots.length * 85
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength + 340 > allLength) {
				listEl.style.left = '-' + (allLength - boxLength) + 'px'
			} else {
				listEl.style.left = '-' + (leftMove + 340) + 'px'
			}
		},
		initBillbordList() {
			this.tourismButtons.forEach((item) => {
				if (!this.billbordList[item.id]) {
					this.billbordList[item.id] = new Speed.Cesium.BillboardCollection({
						scene: this.$map._viewer.scene,
					})
					this.$map._viewer.scene.primitives.add(this.billbordList[item.id]);
				}
				if (item.id == "ms" || item.id == "zs" || item.id == "tscp") {
					if (!this.labelList[item.id]) {
						this.labelList[item.id] = new Speed.Cesium.LabelCollection({
							scene: this.$map._viewer.scene,
						})
						this.$map._viewer.scene.primitives.add(this.labelList[item.id]);
					}
				}
				this.setBillbordVisble(item)
			})
		},
		setBillbordVisble(item) {
			if (item.checked) {
				if (item.id === 'tscp') {
					this.isShow_tscp = true
					this.isOpen = false
				}
				let points = []
				this.ids = []
				this.pointData[item.id].forEach((child) => {
					let position = child.position
					let point = Speed.Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
					points.push(point)
					this.billbordList[item.id].add({
						id: child.id,
						position: point,
						scale: 0.3,
						image: item.image,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
						scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
					})
					if (item.id == "ms" || item.id == "zs" || item.id == "tscp") {
						this.labelList[item.id].add({
							id: child.id,
							position: point,
							text: child.storeName,
							font: "14px sans-serif bold",
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
							pixelOffset: new Cesium.Cartesian2(0, -65),
							// disableDepthTestDistance: Number.POSITIVE_INFINITY,
							fillColor: Cesium.Color.WHITE,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
							scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
						});
					}

					let id = uuid.v4()
					this.ids.push(id)
					if (item.id == "xfsb") {
						this.createCircle(position[0], position[1], id)
					}
				})

				if (points.length > 0) {
					this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(points))
				}
				this.bindEvent()

				// this.pointData[item.id].forEach((position) => {
				// 	let point = Speed.Cesium.Cartesian3.fromDegrees(position[0], position[1])
				// 	points.push(point)
				// })
				// let promise = this.$map._viewer.scene.clampToHeightMostDetailed(points)
				// promise.then((positions) => {
				// 	positions.forEach((position) => {
				// 		this.billbordList[item.id].add({
				// 			position: position,
				// 			image: item.image,
				// 			// verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				// 		})
				// 	})
				// 	this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(positions))
				// })
			} else {
				if (item.id === 'tscp') {
					this.isShow_tscp = false
					this.isOpen = true
				}
				this.billbordList[item.id].removeAll()
				if (item.id == "ms" || item.id == "zs" || item.id == "tscp") {
					this.labelList[item.id].removeAll()
				}
				if (this.waveCircle && this.waveCircle.entity) {
					this.waveCircle.show = false;
					this.waveCircle.removeAllWaveCircle(this.ids)
				}
			}
		},
		createCircle(longitude, latitude, id) {
			const position = Cesium.Cartesian3.fromDegrees(Number(longitude), Number(latitude));
			this.waveCircle = new Speed.WaveCircle(this.$map._viewer, id, {
				position: position,
				height: 7.5,
				count: 2,
				speed: 6,
				radius: 25,
				color: "#30EBFD",
			});
			this.waveCircle.createWaveCircle();
		},
		locationScenicSpot(item) {
			if (item.positions) {
				this.removeLocationEntity()
				this.locationEntity = this.$map._viewer.entities.add({
					wall: {
						positions: Speed.Cesium.Cartesian3.fromDegreesArrayHeights(item.positions),
						minimumHeights: item.minimumHeights,
						material: new Speed.LineFlowMaterialProperty({
							image: require('@/assets/speed/case/civil/fence.png'),
							axisY: false,
							color: new Speed.Cesium.Color.fromCssColorString('#bdf700'),
							// repeat: new Speed.Cesium.Cartesian2(5, 1),
							speed: 10 // 速度，建议取值范围1-100
						}),
					},
				})
				// this.locationEntity = this.$map._viewer.entities.add({
				// 	polyline: {
				// 		positions: Speed.Cesium.Cartesian3.fromDegreesArray(item.positions),
				// 		width: 3,
				// 		material: new Speed.Cesium.PolylineDashMaterialProperty({
				// 		color: Speed.Cesium.Color.RED,
				// 		}),
				// 		clampToGround: true
				// 	},
				// })
				this.$map._viewer.flyTo(this.locationEntity, {
					duration: 2.0,
				})
			}
		},
		setLineVisible(item) {
			if (item.positions) {
				if (!this.lineList[item.id] && item.checked) {
					// this.lineList[item.id] = new Speed.LineAnimation(this.$map, {
					// 	positions: item.positions,
					// 	totalTime: 5000,
					// 	fillColor: "rgba(255,255,0,1.0)",
					// 	width: 30
					// })
					this.lineList[item.id] = this.$map._viewer.entities.add({
						polyline: {
							positions: Speed.Cesium.Cartesian3.fromDegreesArray(item.positions),
							width: 20,
							material: new Speed.LineFlowMaterialProperty({
								image: require('@/assets/speed/case/civil/arrow.png'),
								axisY: false,
								color: new Speed.Cesium.Color.fromCssColorString('#00ff00'),
								repeat: new Speed.Cesium.Cartesian2(30, 1),
								speed: 50
							}),
							clampToGround: true
						},
					})
					// this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(Speed.Cesium.Cartesian3.fromDegreesArray(item.positions)))
					this.$map.flyto({
						destination: Speed.Cesium.Cartesian3.fromDegrees(132.835831, 47.936191, 500),
						duration: 1,
					})

				} else {
					if (item.checked) {
						this.$map._viewer.entities.add(this.lineList[item.id])
						// this.$map.flyto({
						// 	destination: Speed.Cesium.Cartesian3.fromDegrees(132.845387, 47.930976, 500)
						// })
						this.$map.flyto(this.lineList[item.id])

						// this.lineList[item.id] && this.lineList[item.id].activate()
						// this.$map._viewer.camera.flyToBoundingSphere(Speed.Cesium.BoundingSphere.fromPoints(Speed.Cesium.Cartesian3.fromDegreesArray(item.positions)))
					} else {
						this.$map._viewer.entities.remove(this.lineList[item.id])
						// this.lineList[item.id] && this.lineList[item.id].inactivate()
					}
					// this.lineList[item.id] && this.lineList[item.id].setEntityVisible(item.checked)
				}
			}
		},
		bindEvent() {
			if (!this.event) {
				this.event = new Speed.Cesium.ScreenSpaceEventHandler(
					this.$map._viewer.scene.canvas
				);
				this.event.setInputAction((movement) => {
					let pickedObject = this.$map._viewer.scene.pick(
						movement.position
					)
					if (pickedObject && pickedObject.primitive) {
						let selectData
						let type = undefined
						for (let key in this.pointData) {
							for (let i = 0; i < this.pointData[key].length; i++) {
								if (this.pointData[key][i].id === pickedObject.id) {
									selectData = this.pointData[key][i]
									type = key
									break
								}
							}
						}
						if (selectData && selectData.data.length) {
							this.customPopupData = selectData
							// console.log("11",selectData)
							this.addPopup(type, selectData.position, { top: 20, left: 30 })
						} else {
							this.closePopup()
						}
					} else {
						this.closePopup()
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK)
			}
		},
		removeLocationEntity() {
			if (this.locationEntity) {
				this.$map._viewer.entities.remove(this.locationEntity)
				this.locationEntity = null
			}
		},
		loadTileset() {
			if (this.tileset) {
				this.$map.removeLayer(this.tiles3dModel)
				this.tileset = null
			}
			this.tilesetLayer = new Speed.TilesetLayer()
			const tileset = this.tilesetLayer.loadTilesetLayer({
				url: ModelInfo.yuyecun,
			})
			this.tileset = tileset._tileset
			this.$map.addLayer(this.tileset)
			this.$map.flyto(this.tileset)
		},
		showPanorama() {
			window.open("https://www.720yuntu.com/720v2/player/265030")
		},
		openVideo() {
			window.open("https://www.douyin.com/search/%E5%90%8C%E6%B1%9F%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F")
		},
		openShop(data){
			window.open(data)
		},
		addPopup(type, point, offset) {
			let popup = document.getElementById("customPopup")
			if (type == "zs") {
				popup = document.getElementById("hotelPopup")
			}
			popup.style.display = "block"

			let result = new Speed.Cesium.Cartesian2()
			this.$map._viewer.scene.preRender.addEventListener(() => {
				let position = Speed.Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2])
				let canvasPosition = this.$map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Speed.Cesium.defined(canvasPosition)) {
					popup.style.position = "fixed"
					popup.style.top = canvasPosition.y - popup.offsetHeight + offset.top + "px"
					popup.style.left = canvasPosition.x + offset.left + "px"
				}
			})
		},
		closePopup() {
			let popup = document.getElementById("customPopup")
			popup.style.display = "none"
			//
			let popup1 = document.getElementById("hotelPopup")
			popup1.style.display = "none"


		},

		createFireParticle(position) {
			this.fire = new Speed.FireEffect(this.$map._viewer, {
				position: position,
				particleParams: {
					minimumSpeed: 12,
					maximumSpeed: 13,
				}
			})
		},
		removeFireParticle() {
			this.fire && this.fire.remove()
			this.fire = null
		},
		createWaterParticle(position, heading, pitch) {
			this.water = new Speed.WaterEffect(this.$map._viewer, {
				position: position,
				particleParams: {
					heading: heading,
					pitch: pitch,
				}
			})
		},
		removeWaterParticle() {
			this.water && this.water.remove()
			this.water = null
		},
		createCarEntity() {
			let positions = [[132.841126, 47.932665, 60.2], [132.839128, 47.932034, 60], [132.838033, 47.932721, 60], [132.83711, 47.933238, 60], [132.835788, 47.934507, 60],
			[132.834021, 47.935852, 60], [132.834476, 47.936072, 58]]
			let manRoamParam = {
				modelPath: carModelPath,
				modelGoTime: [
					"2023-04-01T14:00:00Z",
					"2023-04-01T14:00:02Z",
					"2023-04-01T14:00:04Z",
					"2023-04-01T14:00:06Z",
					"2023-04-01T14:00:08Z",
					"2023-04-01T14:00:10Z",
					"2023-04-01T14:00:12Z",
				],
				modelGoPoints: positions,
				// 模型显示的最大像素值
				maxSize: 64,
				// 模型显示的最小像素值
				minSize: 30,
				smooth: 2,
				showTrack: false,
				clockRange: Speed.Cesium.ClockRange.UNBOUNDED,
				multiplier: 1
			}
			let promise = this.path.start(manRoamParam)
			return promise
		},
		getHeading(pointA, pointB) {
			//建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
			const transform = Speed.Cesium.Transforms.eastNorthUpToFixedFrame(pointA)
			//向量AB
			const positionvector = Speed.Cesium.Cartesian3.subtract(pointB, pointA, new Speed.Cesium.Cartesian3())
			//因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
			//AB为世界坐标中的向量
			//因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
			const vector = Speed.Cesium.Matrix4.multiplyByPointAsVector(Speed.Cesium.Matrix4.inverse(transform, new Speed.Cesium.Matrix4()), positionvector, new Speed.Cesium.Cartesian3())
			//归一化
			const direction = Speed.Cesium.Cartesian3.normalize(vector, new Speed.Cesium.Cartesian3())
			//heading
			const heading = Math.atan2(direction.y, direction.x) - Speed.Cesium.Math.PI_OVER_TWO
			return Speed.Cesium.Math.TWO_PI - Speed.Cesium.Math.zeroToTwoPi(heading) + Speed.Cesium.Math.PI_OVER_TWO
		},
		getPitch(pointA, pointB) {
			let transfrom = Speed.Cesium.Transforms.eastNorthUpToFixedFrame(pointA)
			const vector = Speed.Cesium.Cartesian3.subtract(pointB, pointA, new Speed.Cesium.Cartesian3())
			let direction = Speed.Cesium.Matrix4.multiplyByPointAsVector(Speed.Cesium.Matrix4.inverse(transfrom, transfrom), vector, vector)
			Speed.Cesium.Cartesian3.normalize(direction, direction)
			//因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
			return Speed.Cesium.Math.PI_OVER_TWO - Speed.Cesium.Math.acosClamped(direction.z)
		},
		playAnimation() {
			this.intervalA = setInterval(() => {
				let temp = this.fire.particleSystem.emissionRate
				// let minimumSpeed = this.fire.particleSystem.minimumSpeed
				// let maximumSpeed = this.fire.particleSystem.maximumSpeed
				temp -= 1
				// maximumSpeed -= 0.05
				// minimumSpeed -= 0.05
				if (temp <= 0) {
					this.fire.particleSystem.emissionRate = 0
					clearInterval(this.intervalA)
					this.intervalA = undefined
					this.removeFireParticle()
					this.intervalB = setInterval(() => {
						let temp = this.water.particleSystem.emissionRate
						temp -= 10
						if (temp <= 0) {
							this.water.particleSystem.emissionRate = 0
							clearInterval(this.intervalB)
							this.intervalB = undefined
							this.removeWaterParticle()
							this.path.quit()
							this.removeCallback && this.removeCallback()
							this.removeCallback = undefined
						} else {
							this.water.particleSystem.emissionRate = temp
						}
					}, 100)
				} else {
					this.fire.particleSystem.emissionRate = temp
					// if (maximumSpeed <= 0) {
					// 	this.fire.particleSystem.maximumSpeed = 0
					// } else {
					// 	this.fire.particleSystem.maximumSpeed = maximumSpeed
					// }
					// if (minimumSpeed <= 0) {
					// 	this.fire.particleSystem.minimumSpeed = 0
					// } else {
					// 	this.fire.particleSystem.minimumSpeed = minimumSpeed
					// }
				}

			}, 100)
		},
		fireDrill() {
			let waterPosition = [132.834476, 47.936072, 62]
			let firePosition = [132.834795, 47.935965, 63.5]
			let pointA = Speed.Cesium.Cartesian3.fromDegrees(...waterPosition)
			let pointB = Speed.Cesium.Cartesian3.fromDegrees(...firePosition)
			let promise = this.createCarEntity()
			let flag = false
			promise.then(() => {
				this.$map._viewer.trackedEntity = this.path.getEntity()
				this.removeCallback = this.$map._viewer.clock.onTick.addEventListener((colck) => {
					let currentTime = Speed.Cesium.JulianDate.clone(colck._currentTime)
					if (!flag && Speed.Cesium.JulianDate.greaterThan(currentTime, colck.stopTime)) {
						flag = true
						this.$map._viewer.trackedEntity = undefined
						this.path.cancelAnimation(true)
						let heading = this.getHeading(pointA, pointB)
						let pitch = this.getPitch(pointA, pointB)

						this.createWaterParticle(waterPosition, Speed.Cesium.Math.toDegrees(heading), 35)
						this.playAnimation()
					}
				})
			})
		},
		createPieChart(dom) {
			let kllechart = echarts.init(dom);
			let option = {
				title: [{
					text: '234\n实时客流量',
					x: 'center',
					top: '41%',
					textStyle: {
						fontSize: '12',
						color: '#fff',
						fontFamily: 'Source Han Sans CN',
						foontWeight: '500',
					},
				}],
				// backgroundColor: '#0E2E68',
				polar: {
					radius: ['65%', '80%'],
					center: ['50%', '50%'],
				},
				angleAxis: {
					max: 100,
					show: false,
				},
				radiusAxis: {
					type: 'category',
					show: true,
					axisLabel: {
						show: false,
					},
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
				},
				series: [{
					// 渐变圈
					name: '',
					type: 'bar',
					roundCap: true,
					barWidth: 90,
					showBackground: true,
					backgroundStyle: {
						color: '#324D93',
					},
					data: [56],
					coordinateSystem: 'polar',

					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
								offset: 0,
								color: '#fbc292',
							},
							{
								offset: 1,
								color: '#06fbfe',
							},
							]),
						},
					},
				}, {
					// 亮线
					name: '',
					z: 5,
					type: 'pie',
					cursor: 'default',
					radius: ['45%', '45%'],
					hoverAnimation: false,
					legendHoverLink: false,
					labelLine: {
						normal: {
							show: false,
						},
					},
					data: [
						{
							value: 1,
							itemStyle: {
								normal: {
									borderWidth: 2,
									borderColor: {
										type: 'linear',
										x: 0,
										y: 0,
										x2: 0,
										y2: 1,
										colorStops: [{
											offset: 0, color: '#E6FCFF'
										}, {
											offset: 0.6, color: 'rgba(2,144,214,0)'
										}],
										globalCoord: false
									}
								},
							},
						},
					],
				}, { //内圆
					type: 'pie',
					radius: '50%',
					center: ['50%', '50%'],
					z: 1,
					itemStyle: {
						normal: {
							color: new echarts.graphic.RadialGradient(.5, .5, .8, [{
								offset: 0,
								color: '#85fff800'
							},
							// {
							//     offset: .5,
							//     color: '#85fff8'
							// },
							{
								offset: 1,
								color: '#00D2C6'
							}
							], false),
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						},
					},
					hoverAnimation: false,
					label: {
						show: false,
					},
					tooltip: {
						show: false
					},
					data: [100],
				}],
			};

			kllechart.setOption(option);
		},
	},
	unmounted() {
		for (let key in this.billbordList) {
			this.billbordList[key].removeAll()
		}
		for (let key in this.labelList) {
			this.labelList[key].removeAll()
		}
		for (let key in this.lineList) {
			// this.lineList[key].destroy()
			this.$map._viewer.entities.remove(this.lineList[key])
		}
		this.billbordList = {}
		this.labelList = {}
		this.lineList = {}
		this.removeLocationEntity()
		this.path.quit()
		if (this.tileset) {
			this.$map.removeLayer(this.tileset)
			this.tileset = undefined
		}
		if (this.event) {
			this.event.removeInputAction(Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK)
			this.event = undefined
		}
		this.removeFireParticle()
		this.removeWaterParticle()
		this.intervalA && clearInterval(this.intervalA)
		this.intervalB && clearInterval(this.intervalB)
		this.removeCallback && this.removeCallback()
		this.intervalA = undefined
		this.intervalB = undefined
		this.removeCallback = undefined
		this.$map._viewer.trackedEntity = undefined

		this.travelList.removeAll()
		this.travelLabelList.removeAll()

	},

};
</script>

<style scoped>
.tourism-left {
	/* width: 3.6%;
	height: 45.5%;
	position: absolute;
	z-index: 5;
	top: 27.5%;
	left: 1px; */


	width: 10%;
	height: 100%;
	z-index: 5;
	position: absolute;
	top: 0%;
	padding: 0.1%;
	padding-top: 4%;
	padding-bottom: 2%;
	padding-left: 0.2%;
	background-image: linear-gradient(to right,
			rgba(1, 9, 19, 0.9),
			rgba(4, 17, 35, 0));
}

.content-left {
	width: 40%;
	height: 45%;
	position: absolute;
	top: 27.5%;
	left: 1px;
}

.xfyl {
	width: 81.5%;
	height: 8%;
	position: absolute;
	cursor: pointer;
	background: url("@/assets/speed/case/civil/bt_xfyl_nor.png") no-repeat;
	background-size: 100% 100%;
	bottom: 8%;
}

.xfyl_Active {
	background: url("@/assets/speed/case/civil/bt_xfyl_sel.png") no-repeat;
	background-size: 100% 100%;
}

.tourism-legend {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	position: absolute;
	background: url('@/assets/speed/case/civil/legend-background.png') no-repeat;
	background-size: 100% 100%;
}

.tourism-legend-name {
	width: 46px;
	height: 57px;
	background: url('@/assets/speed/case/civil/legend-name.png') no-repeat;
	background-size: 100% 100%;
}

.tourism-left-buttons {
	position: absolute;
	top: -53px;
	bottom: -65px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* background-color: #072e4c4d; */
	padding-left: 25px;
}

.tourism-button {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.button-image {
	cursor: pointer;
	z-index: 2;
}

.button-name {
	color: white;
	font-size: 14px;
	font-weight: 550;
	white-space: nowrap;
}

.button-padding0 {
	padding-left: 50px;
}

.button-padding1 {
	padding-left: 70px;
}

.monitor-list {
	display: flex;
	justify-content: space-between;
}

.el-card {
	border: transparent;
	background-color: transparent;
	color: #ffffff;
	position: absolute;
	width: 44%;
	left: 28%;
	top: 12%;
	--el-card-padding: 0
}

.btn {
	width: 50px;
	height: 20px;
	line-height: 100px;
	text-align: center;
	cursor: pointer;
	margin-top: 1%;
}

.btn:hover {
	background-color: #40a0ff7a;
	color: white;
}

.list-box {
	width: 100%;
	/* width: calc(30vw - 30px); */
	overflow: hidden;
}

.list {
	width: calc(50vw + 60px);
	display: flex;
	transform: all 2s;
	position: relative;
	left: 0;
	transition: left 1s;
}

.list-item {
	width: 80px;
	text-align: center;
	cursor: pointer;
	margin-left: 5px;
	font-weight: 700;
}

.tourism-bottom {
	width: 50%;
	height: 12%;
	position: fixed;
	z-index: 5;
	bottom: 2.7%;
	left: 25%;
}

.tourism-info {
	background: url("@/assets/speed/case/civil/community1.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 65%;
	bottom: 28%;
	position: absolute;
	display: flex;
}

.tourism-item {
	background: url("@/assets/speed/case/civil/bottom.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 60%;
	position: absolute;
	bottom: 0.2%;
	text-align: center;
	color: white;
	font-size: 18px;
	font-weight: 600;
	padding-top: 10px;
}

.tourism-right {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;
	/* background: url("@/assets/speed/case/civil/right.png") no-repeat;
	background-size: 100% 120%; */
	transition: all 1s;
	transform: translateX(104%);
}

.tourism-right[panelVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

.speciality-List {
	width: 20%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 1.8%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	transition: all 1s;
	transform: translateX(110%);
}

.speciality-List[panelVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

.speciality-content {
	height: 90%;
	margin: 4%;
	overflow: hidden;
}


.speciality_item {
	width: 100%;
	height: 23%;
	margin-bottom: 4%;
	box-shadow: 0px 0px 14px 0px #4692ff inset;
	background-color: rgb(7 26 54 / 65%);
	color: #ffffff;
	padding: 3%;
	display: flex;
	align-items: center;
}

.speciality-img {
	width: 35%;
	cursor: pointer;
}

.speciality-intr {
	width: 70%;
	height: 100%;
	padding-left: 3%;
	display: grid;
	grid-template-rows: 13% 51% 12% 12% 12%;
}

.speciality-title {
	font-size: 16px;
	font-weight: 700;
	background-image: -webkit-linear-gradient(bottom, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	line-height: 15px;
}

.speciality-text {
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 400;
	color: #f0f0f0;
	overflow: hidden;
	text-overflow: ellipsis;
}

.shop-address,
.shop-tel {
	background: linear-gradient(0deg, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 700;
	text-align: left;
	color: #ffffff;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	line-height: 20px;
	display: flex;
	align-items: center;

}
.shop-address{
	cursor: pointer;

}


.shop-name {
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Bold;
	font-weight: 700;
	color: #30ebfd;
	line-height: 20px;
}
.store-img{
	float: right;
    width: 10%;
	cursor: pointer;

}

.tj_video {
	text-align: center;
	background: linear-gradient(0deg, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	font-size: 18px;
	font-weight: 700;
	color: #ffffff;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.tj_video:hover {
	color: #30ebfd;
	cursor: pointer;
}



.jqjj {
	width: 100%;
	height: 45%;
}

.jqjj_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/jj.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.jqjj_back {
	background: url("@/assets/speed/case/civil/xcjx_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 12%;
	position: absolute;
	width: 100%;
	height: 45%;
}

.el-carousel {
	position: absolute;
	width: 91%;
	height: 82%;
}

::v-deep .el-carousel__container {
	position: relative;
	height: 100%;
}

::v-deep .el-carousel__item {
	height: 90%;
}

.jqjj_img {
	position: absolute;
	width: 100%;
	height: 48%;
}

.jqjj_content {
	position: absolute;
	width: 100%;
	height: 50%;
	font-size: 12px;
	font-weight: 500;
	text-align: left;
	color: #ffffff;
	line-height: 20px;
	letter-spacing: 0.24px;
	overflow: hidden;
	text-overflow: ellipsis;
	bottom: 0%;
	padding-left: 1%;
	padding-right: 1%;
	text-indent: 24px;
}

.klcz {
	width: 100%;
	height: 30%;
}

.klcz_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/kl.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.klcz_back {
	background: url("@/assets/speed/case/civil/ssjk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 2%;
	padding-top: 10%;
	position: absolute;
	width: 100%;
	height: 30%;
}

.kl_content,
.kl_echart {
	width: 48%;
	height: 100%;
	float: left;
	padding: 3% 1%;
}


.maxkll,
.rkll {
	width: 98%;
	height: 32%;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 5%;
}

.maxkll_num,
.rkll_num {
	display: flex;
}

.rkll_title {
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 500;
	text-align: center;
	color: #f0f0f0;
	line-height: 14px;
	letter-spacing: 0.24px;
	width: 40%;
	word-break: keep-all;

}

.rkll_font {

	font-size: 18px;
	font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
	font-weight: 700;
	text-align: left;
	color: #0dffff;
	line-height: 14px;
	letter-spacing: 0.36px;
}

.maxkll_font {
	width: 66px;
	height: 15px;
	font-size: 18px;
	font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
	font-weight: 700;
	text-align: left;
	color: #ffc016;
	line-height: 14px;
	letter-spacing: 0.36px;
}

.gfsj {
	background: url("@/assets/speed/case/civil/ykgf.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 17%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 9%;
	margin-left: 5%;
}

.gfsj_title {

	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 500;
	text-align: left;
	color: #a0d6fc;
	line-height: 14px;
	letter-spacing: 0.84px;
}

.gfsj_date {

	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 500;
	text-align: left;
	color: #a0d6fc;
	line-height: 14px;
	letter-spacing: 0.84px;
}

.mp {
	width: 100%;
	height: 24%;
}

.mp_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/mp_titile.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.mp_back {
	background: url("@/assets/speed/case/civil/ggss_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 12%;
	position: absolute;
	width: 100%;
	height: 24%;
}

.mpjg {
	background: url("@/assets/speed/case/civil/mpjg.png") no-repeat;
	background-size: 100% 100%;
	width: 98%;
	height: 40%;
	color: white;
	font-size: 18px;
	font-weight: 700;
	padding-left: 22%;
	padding-right: 8%;
	line-height: 3.2;
	display: flex;
	align-items: center;
	/* flex-wrap: wrap; */
	justify-content: space-between;
	margin-top: 3%;
}

.jqmp {
	top: 9%;
	position: relative;
	padding: 8% 5%;
}

.jqmp-content {
	color: white;
	font-size: 14px;
	background: url("@/assets/speed/case/civil/ic_jdmp.png") no-repeat;
	background-size: 100% 100%;
	width: 197px;
	height: 78px;
	padding-left: 13%;
	font-size: 15px;
	font-weight: 600;
	text-align: center;
}

.jqmp-content-num {
	font-size: 20px;
	color: aqua;
}

.hotel-popup {
	display: none;
	width: 20%;
	height: 20%;
	padding: 10px;
	z-index: 5;
	background: rgba(7, 26, 54, 0.6);
}

.travelPopup {
	z-index: 100;
	width: 410px;
	height: 380px;
	background: rgba(7, 26, 54, 0.6);
	display: none;
}

.travel_item {
	height: 20px;
	color: rgba(36, 201, 255);
	/* display: flex; */
	margin-top: 2%;
	margin-left: 6%;
	margin-right: 6%;
	background: linear-gradient(to right, rgba(36, 201, 255, 0) 0%, rgba(36, 201, 255, .2) 50%, rgba(36, 201, 255, 0) 100%);
}

.travel_content {
	color: white;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 80%;

}

.travel_intr {
	height: 100px;
}

.travelPic {
	display: flex;
	height: 100px;
	margin-top: 2%;
	margin-left: 5%;
	margin-right: 5%;
}

.travel-pic {
	width: 30%;
	margin-left: 2%;
}

.tourism-popup {
	display: none;
	width: 25%;
	max-height: 48.5%;
	position: absolute;
	padding: 10px;
	z-index: 5;
	top: 12%;
	right: 23%;
	background: rgba(7, 26, 54, 0.6);

}

.popuptitle {
	width: 100%;
	height: 35px;
	background-image: url("@/assets/speed/case/civil/title.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	padding: 1px 0 0;
}

.close-button {
	color: rgb(34 255 254);
	position: absolute;
	top: 0;
	right: 0;
	padding: 4px 4px 0 0;
	text-align: center;
	width: 20px;
	height: 20px;
	font: 16px/14px Tahoma, Verdana, sans-serif;
	text-decoration: none;
	font-weight: 700;
	background: transparent;
	z-index: 20170825;
	cursor: pointer;
}

.popupname {
	margin: 1px 0 0 16px;
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
	line-height: 27px;
	letter-spacing: .06em;
	background: linear-gradient(180deg, #fff 0%, #22fffe 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.popup-item {
	display: flex;
	height: 30%;
	padding: 5px;
}

.popup-item1 {
	display: flex;
	height: 84%;
	padding: 5px;
}

.popup-img {
	width: 30%;

}

.popup-img1 {
	width: 32%;
	height: 85%;
	margin-top: 2%;
}

.popup-content {
	width: 70%;
	padding: 10px 0px 10px 10px;
	color: white;
}

.popupContent {
	width: 70%;
	padding: 10px;
	color: white;
	font-size: 15px;
	padding: 5px 0px 5px 10px;
	display: grid;
}

.popup-title {
	font-size: 16px;
	font-weight: 700;
}

.popup-text {
	font-size: 14px;
	padding-top: 10px;
}

.store-info {
	color: white;
	font-size: 14px;
	padding: 5px;
}

.store-item {
	display: flex;
	justify-content: space-between;
	padding-top: 5px;
}

a {
	color: #29d;
}

a:hover {
	color: yellow;
}

.jqqj {
	background: url("@/assets/speed/case/civil/jqqj.png") no-repeat;
	background-size: 100% 100%;
	width: 42.9%;
	height: 17.8%;
	left: 28%;
	bottom: 12%;
	position: absolute;

}

.jqqj-btn {
	width: 100%;
	height: 100%;
}

::v-deep .el-button--text:not(.is-disabled):hover {
	color: yellow;
}

#panelBtn {
	width: 10%;
	height: 16.1%;
	position: absolute;
	z-index: 5;
	left: -9.9%;
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
}</style>
