import contentmenu from 'v-contextmenu'
import "v-contextmenu/dist/themes/default.css";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import scui from './scui'
import i18n from './locales'
import router from './router'
import store from './store'
import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import vue3SeamlessScroll from "vue3-seamless-scroll"


const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.use(scui);
app.use(contentmenu)
app.use(ElementPlus);
app.use(ElementPlusIconsVue);
app.use(vue3SeamlessScroll)

import widgets from './cesiumSDK/widgets'
app.use(widgets)


app.mount('#app');
window.app = app;
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});
