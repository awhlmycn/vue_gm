<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 广告列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 添加搜索框 -->
            <div class="handle-box" style="margin-left: 75%;">
                <el-input v-model="select_word" placeholder="筛选标题关键词" class="handle-input mr10"></el-input>
                <el-button type="primary">搜索</el-button>
            </div>
        </div>
        <div class="container">
        	<el-table :data="data" border >
			    <el-table-column prop="ad_id" label="ID" min-width="5%" sortable align="center"></el-table-column>
			    <el-table-column prop="ad_title" label="标题" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="ad_context" label="内容" min-width="20%"></el-table-column>
			    <el-table-column prop="is_del" label="状态" min-width="10%" align="center">
			    	<template slot-scope="scope">
            			<div :class="scope.row.is_del==0? '' :'forbid'"> {{ scope.row.is_del|setDelStatus }}</div>
					</template>
			    </el-table-column>
			    <el-table-column label="操作" min-width="15%"  align="center">
                    <template slot-scope="scope">
                    	<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">
                    		编辑
                    	</el-button>
                    	<el-button size="mini" :type="scope.row.is_del==0?'danger' : 'success' " @click="handleDelete( scope.$index, scope.row )">
                    		{{ scope.row.is_del == 0 ? '删除': '启用' }}
                    	</el-button>
                    </template>
                </el-table-column>
			 </el-table>
			 <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="page_size" background>
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="false" center>
			<el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题：">
                    <el-input v-model="form.ad_title"></el-input>
                </el-form-item>
                <el-form-item label="内容：">
                	<el-input type="textarea" v-model="form.ad_context"></el-input>
                </el-form-item>
            </el-form>
			<span slot="footer" class="dialog-footer">
			   	<el-button type="primary" @click="saveEdit">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
		</el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">{{ curIndexIsDel == 0 ? '是否删除此题？': '是否启用此题？'}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deleteRow">确 定</el-button>
                <el-button @click="delVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
	var tmpData = [{
		          		"ad_id":1,
						"ad_title":"提示1",
						"ad_context":"快速强化 安心达标",
						"create_time":1544424840,
						"is_del" : 0
	        		},
	        		{
		          		"ad_id":2,
						"ad_title":"提示1",
						"ad_context":"快速强化 安心达标",
						"create_time":1544424840,
						"is_del" : 0
	        		}];
    export default {
        'name' :'Advertisement',
        data() {
           return{
           		editVisible: false,
                delVisible: false,
                select_word: '',
                cur_page: 1,
                page_size : 20,
                total : 100,
                form: {},
                idx: -1,
                curIndexIsDel : 0,
	           	tableData: []
           	}
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter(( d ) => {
                    if( d.ad_title.indexOf( this.select_word ) > -1 ) {
                        return d;
                    }
                })
            }
        },
        methods:{
        	// 设置等级
        	setLevel( row ) {
        		var levels = { 1 : '低级', 2 : '中级', 3 : '高级' };
        		return levels[ row.level_id ];
        	},
        	// 设置产品
        	setProduct( row ) {
        		return row.product_type == 1 ? '产品'  : '非产品';
        	},
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
        	//修改、弹出编辑框
        	handleEdit( index, row ) {
        		this.editVisible = true;
        		this.idx = index;
                this.form = Object.assign( {}, row );
        	},
        	// 保存数据，并且发送给服务器
        	saveEdit() {
        		this.editVisible = false;
        		this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], this.form );
        	},
        	// 禁用弹框
        	handleDelete( index, row ) {
        		this.delVisible = true;
        		this.idx = index;
        		this.curIndexIsDel = this.tableData[ index ].is_del;
        	},
        	// 确认禁用
        	deleteRow() {
        		this.delVisible = false;
        		var is_del = 0;
        		if( this.tableData[ this.idx ].is_del == 0 ) {
        			is_del = 1;
        		}
        		this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], { is_del : is_del } );
        	}
        },
        filters : {
        	setDelStatus( value ) {
        		return value == 1 ? '已删除'  : '正常';
        	}
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
	.forbid {
		font-weight: bold;
		color: red;
	}
</style>
