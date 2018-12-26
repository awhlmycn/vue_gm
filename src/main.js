import Vue from 'vue';
import App from './App';
import router from './router';
// import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import world from '../static/js/world.js';
import lele from '../static/js/lele.js';
import apiReq from '../static/js/api.js';

Vue.use( ElementUI, { size: 'small' });

Vue.prototype.$axios = apiReq;
Vue.prototype.$world = world;
Vue.prototype.$lele = lele;

//使用钩子函数对路由进行权限跳转
router.beforeEach( ( to, from, next ) => {
    const role = localStorage.getItem('ms_username');
    if( !role && to.path !== '/login' ) {
        next('/login');
    }
    else{
        next();
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');