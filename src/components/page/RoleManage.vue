<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 添加搜索框 -->
            <div class="handle-box" style="margin-left: 75%;">
                <el-input v-model="select_word" placeholder="筛选姓名关键词" class="handle-input mr10"></el-input>
                <el-button type="primary">搜索</el-button>
            </div>
        </div>
        <div class="container">
        	<el-table :data="data" border >
			    <el-table-column prop="uid" label="UID" min-width="10%" sortable align="center"></el-table-column>
			    <el-table-column prop="nickname" label="姓名" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="headImgUrl" label="头像" min-width="10%" align="center">
			    	<template   slot-scope="scope">            
                    	<img :src="scope.row.headImgUrl"  min-width="30" height="30" />
                 	</template> 
			    </el-table-column>
			    <el-table-column prop="point" label="总积分" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="weekPoint" label="周积分" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="monthPoint" label="月积分" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="pk" label="pk场次" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="pkWin" label="pk胜场" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="totalRank" label="总排名" min-width="10%" align="center" sortable ></el-table-column>
			    <el-table-column prop="weekRank" label="周排名" min-width="10%" align="center" sortable></el-table-column>
				<el-table-column prop="monthRank" label="月排名" min-width="10%" align="center" sortable></el-table-column>
			 </el-table>
			 <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="page_size" background>
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
	var tmpData = [{
		          		"uid":10000001,
						"nickname":"kilmy",		//玩家名字
						"headImgUrl":"https://pkgame.lillyadmin.cn/Images/default.png",		//玩家头像
						"point":139,			//玩家总积分
						"weekPoint":0,			//玩家周积分
						"monthPoint":52,		//玩家月积分
						"pk":26,				//玩家pk场次
						"pkWin":4,				//玩家pk胜场
						"winRate":15,			//胜率
						"totalRank":1,			//总排名
						"weekRank":4,			//周排名
						"monthRank":1			//月排名
	        		},
	        		{
		          		"uid":10000002,
						"nickname":"lmy",		//玩家名字
						"headImgUrl":"https://pkgame.lillyadmin.cn/Images/default.png",		//玩家头像
						"point":139,			//玩家总积分
						"weekPoint":0,			//玩家周积分
						"monthPoint":52,		//玩家月积分
						"pk":26,				//玩家pk场次
						"pkWin":4,				//玩家pk胜场
						"winRate":15,			//胜率
						"totalRank":1,			//总排名
						"weekRank":4,			//周排名
						"monthRank":1			//月排名
	        		}];
    export default {
        'name' :'Advertisement',
        data() {
           return{
                select_word: '',
                cur_page: 1,
                page_size : 20,
                total : 100,
	           	tableData: []
           	}
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter(( d ) => {
                    if( d.nickname.indexOf( this.select_word ) > -1 ) {
                        return d;
                    }
                })
            }
        },
        methods:{
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取每页的数据
            getData() {
            	var len = Math.floor( Math.random() * 2 );
               	this.tableData = tmpData;
                // this.$axios.post(this.url, {
                //     page: this.cur_page
                // }).then((res) => {
                //     this.tableData = res.data.list;
                // })
            },
        }
    }

</script>

<style scoped>
	.crumbs{
		margin-bottom: 10px;
	}
    .handle-box {
        margin-bottom: 10px;
    }
</style>
