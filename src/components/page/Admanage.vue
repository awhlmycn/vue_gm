<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 广告列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 添加搜索框 -->
            <div class="handle-box" style="margin-left: 65%;">
                <el-button type="primary" style="margin-right:20px;" @click="addTitle">新增</el-button>
                <el-input v-model="select_word" placeholder="筛选标题关键词" class="handle-input mr10"></el-input>
                <el-button type="primary">搜索</el-button>
            </div>
        </div>
        <div class="container">
        	<el-table :data="data" border >
			    <el-table-column prop="ad_id" label="ID" min-width="5%" sortable align="center"></el-table-column>
			    <el-table-column prop="ad_title" label="标题" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="ad_content" label="内容" min-width="20%"></el-table-column>
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
                	<el-input type="textarea" v-model="form.ad_content"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="form.is_del">
                        <el-option label="开启" value="0"></el-option>
                        <el-option label="禁用" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
			<span slot="footer" class="dialog-footer">
			   	<el-button type="primary" @click="saveEdit">确 定</el-button>
                <el-button @click="cancelEdit">取 消</el-button>
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
    export default {
        'name' :'Advertisement',
        data() {
           return{
           		editVisible: false,
                delVisible: false,
                select_word: '',
                cur_page: 1,
                page_size : 20,
                total : 0,
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
            async getData() {
                var backData = await this.$axios.get( '/gm/adList', { page : this.cur_page, pageSize : this.page_size } );
                if( backData.code == 200 ) {
                    this.tableData = backData.result;
                    this.total = backData.total;
                }
            },
        	//修改、弹出编辑框
        	handleEdit( index, row ) {
        		this.editVisible = true;
        		this.idx = index;
                this.form = Object.assign( {}, row );
                if( this.form.hasOwnProperty( 'is_del' ) ) {
                    this.form.is_del = this.form.is_del.toString();
                }
        	},
            // 新增加题目
            addTitle() {
                this.editVisible = true;
            },
            // 取消修改
            cancelEdit() {
                this.editVisible = false;
                this.idx = -1;
                this.form = {};
            },
        	// 保存数据，并且发送给服务器
        	async saveEdit() {
        		if( this.$lele.empty( this.form ) ) {
                    this.$message.error({ message : '没有要修改的数据'});
                    return;
                }
                var alertData = {
                    ad_title : this.form.ad_title,     //题目
                    ad_content : this.form.ad_content,         //选项A
                    is_del : this.form.is_del
                };
                var backData = null;
                // 修改信息
                if( this.idx >= 0 ) {
                    alertData.ad_id = this.form.ad_id;
                    backData = await this.$axios.get( '/gm/modifyAd', alertData );
                    if( backData.code == 200 ) {
                        this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], this.form );
                    }
                }
                // 新增信息
                else{
                    backData = await this.$axios.get( '/gm/addAd', alertData );
                    if( backData.code == 200 && this.tableData.length < this.page_size ) {
                        this.tableData.push( backData.result );
                    }
                }
                this.alertSuccess( backData );
                this.cancelEdit();
        	},
        	// 禁用弹框
        	async handleDelete( index, row ) {
        		this.delVisible = true;
        		this.idx = index;
        		this.curIndexIsDel = this.tableData[ index ].is_del;
        	},
        	// 确认禁用
        	async deleteRow() {
        		this.delVisible = false;
                var is_del = 0;
                if( this.tableData[ this.idx ].is_del == 0 ) {
                    is_del = 1;
                }
                var result = await this.$axios.get( '/gm/modifyAd', { ad_id : this.tableData[ this.idx ].ad_id, is_del : is_del } );
                if( result.code == 200 ) {
                    this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], { is_del : is_del } );
                }
                this.alertSuccess( result );
                this.cancelEdit();
        	},
            // 添加成功弹框
            alertSuccess( data ) {
                if( data.code == 200 ) {
                    this.$message.success({
                        message : '成功'
                    });
                }
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
