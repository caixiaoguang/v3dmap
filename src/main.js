import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCesium from 'vue-cesium'
import ElementPlus from 'element-plus';

import 'normalize.css'
import 'element-plus/lib/theme-chalk/index.css'
import "vue-cesium/lib/theme-default/index.css";
import './styles/main.scss'
import './styles/element-variables.scss'


const app = createApp(App).use(router);
app.use(VueCesium);
app.use(ElementPlus);
app.mount('#app');