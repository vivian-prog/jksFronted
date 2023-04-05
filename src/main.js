import Vue from 'vue'
// import App from './App'
import router from './router'
import iView from 'iview';
import './assets/less/index.less';
import echarts from 'echarts'
import img from './lib/img'
import utils from "./lib/utils";
import dataV from '@jiaminghi/data-view'
import App from "./App.vue";
import { Radio,Button,RadioGroup } from 'element-ui'
import VScaleScreen from 'v-scale-screen'
Vue.use(VScaleScreen);

Vue.prototype.$echarts = function (el) {
    return echarts.init(el, null, {renderer: 'svg'})
}
Vue.prototype.$images = img
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(utils)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
Vue.use(Radio);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(dataV);