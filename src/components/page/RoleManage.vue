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
    export default {
        'name' :'Advertisement',
        data() {
           return{
                select_word: '',
                cur_page: 1,
                page_size : 20,
                total : 0,
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
            async getData() {
                var backData = await this.$axios.get( '/gm/roleList', { page : this.cur_page, pageSize : this.page_size } );
                if( backData.code == 200 ) {
                    this.tableData = backData.result;
                    this.total = backData.total;
                }
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
