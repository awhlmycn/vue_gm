<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 消息中心 -->
                <div class="btn-choice">
                    <span class="explain">当前服务器：</span>
                    <el-select v-model="value">
                        <el-option
                          v-for="( item, key ) in serverList"
                          :key="key"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                     </el-select>
                </div>
                <div class="btn-loginout">欢迎您，{{username}}
                    <a href="#" @click="loginout()">【退出】</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                name: 'kilmy',
                serverList : [
                    {
                        name : '明越服务器',
                        value : 'http://127.0.0.1'
                    },
                    {
                        name : 'qa测试服',
                        value : 'http://127.0.0.2'
                    },
                    {
                        name : '正式服',
                        value : 'http://127.0.0.3'
                    }
                ],
                value: ''
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            loginout() {
                this.$router.push('/login');
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
        },
        mounted(){
            this.value = this.serverList[0].value;
            // if(document.body.clientWidth < 500 ) {
            //     this.collapseChage();
            // }
        }
    }
</script>
<style scoped>
    /*文件开头*/
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    /*折叠按钮*/
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    /*标题*/
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    /*右边的整体*/
    .header-right{
        float: right;
        padding-right: 10px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-choice .explain{
        font-size: 16px;
    }
    .btn-choice .el-select{
        width: 120px;
    }
    .el-select-dropdown__item{
        font-size: 16px;
    }
    .btn-loginout{
        margin-left: 10px;
        font-size: 12px;
    }
    .btn-loginout a{
        cursor: pointer;
        color: #fff;
        text-decoration:underline;
    }
    
</style>
