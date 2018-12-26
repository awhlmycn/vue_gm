import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode : 'history',
    routes: [
        {
            path: '/',
            redirect: '/titles'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/titles',
                    component: resolve => require(['../components/page/TitleManage.vue'], resolve),
                    meta: { title: '题库管理' }
                },
                {
                    path: '/ads',
                    component: resolve => require(['../components/page/Admanage.vue'], resolve),
                    meta: { title: '广告管理' }
                },
                {
                    path: '/roles',
                    component: resolve => require(['../components/page/RoleManage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/pkrecord',
                    component: resolve => require(['../components/page/PkManage.vue'], resolve),
                    meta: { title: 'pk管理' }
                },
                // {
                //     path: '/table',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
