<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 题库管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 添加搜索框 -->
            <div class="handle-box" style="margin-left: 65%;">
                <el-button type="primary" style="margin-right:20px;" @click="addTitle">新增</el-button>
                <el-input v-model="select_word" placeholder="筛选题目关键词" class="handle-input mr10"></el-input>
                <el-button type="primary">搜索</el-button>
            </div>
        </div>
        <div class="container">
        	<el-table :data="data" border>
			    <el-table-column prop="q_id" label="ID" min-width="5%" sortable align="center"></el-table-column>
			    <el-table-column prop="title" label="题目" min-width="30%"></el-table-column>
			    <el-table-column prop="level_id" label="等级" min-width="10%" align="center" :formatter="setLevel"></el-table-column>
			    <el-table-column prop="types" label="原型" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="fileds" label="领域" min-width="10%" align="center"></el-table-column>
			    <el-table-column prop="product_type" label="产品" min-width="10%" align="center" :formatter="setProduct"></el-table-column>
			    <el-table-column prop="is_del" label="状态" min-width="9%" align="center">
			    	<template slot-scope="scope">
            			<div :class="scope.row.is_del==0? '' :'forbid'"> {{ scope.row.is_del|setDelStatus }}</div>
					</template>
			    </el-table-column>
			    <el-table-column label="操作" min-width="16%"  align="center">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="60%" height="50%":close-on-click-modal="false" center>
			<el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="问题：">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="选项：A">
				    <el-input v-model="form.A"></el-input>
                </el-form-item>
                <el-form-item label="B">
                    <el-input v-model="form.B"></el-input>
                </el-form-item>
                <el-form-item label="C">
                    <el-input v-model="form.C"></el-input>
                </el-form-item>
                <el-form-item label="D">
                    <el-input v-model="form.D"></el-input>
                </el-form-item>
                <el-form ref="form" :inline="true" :model="form" label-width="100px">
                    <el-form-item label="答案：">
    				    <el-select v-model="form.answer">
    				      	<el-option label="A" value="A"></el-option>
    				      	<el-option label="B" value="B"></el-option>
    				      	<el-option label="C" value="C"></el-option>
    				      	<el-option label="D" value="D"></el-option>
    				    </el-select>
    			 	</el-form-item>
                    <el-form-item label="级别：">
                        <el-select v-model="form.level_id">
                            <el-option label="初级" value="1"></el-option>
                            <el-option label="中级" value="2"></el-option>
                            <el-option label="高级" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="原型：">
                        <el-select v-model="form.types">
                            <el-option label="单选题" value="单选题"></el-option>
                            <el-option label="多选题" value="多选题"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领域：">
                        <el-input v-model="form.fileds"></el-input>
                    </el-form-item>
                    <el-form-item label="产品：">
                        <el-select v-model="form.product_type">
                            <el-option label="产品" value="1"></el-option>
                            <el-option label="非产品" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select v-model="form.is_del">
                            <el-option label="开启" value="0"></el-option>
                            <el-option label="禁用" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
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
        name: 'basetable',
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
                    if( d.title.indexOf( this.select_word ) > -1 ) {
                        return d;
                    }
                })
            }
        },
        methods:{
        	getRowClass( { row, column, rowIndex, columnIndex } ){
        		if( rowIndex === 0 ) {
                	return 'font-size:bold;color:#040000;text-align:center;'
                }
                else{
                	return '';
                }
        	},
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
                var backData = await this.$axios.get( '/gm/questionList', { page : this.cur_page, pageSize : this.page_size } );
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
                if( this.form.hasOwnProperty( 'level_id' ) ) {
                	this.form.level_id = this.form.level_id.toString();
                }
                if( this.form.hasOwnProperty( 'product_type' ) ) {
                	this.form.product_type = this.form.product_type.toString();
                }
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
                    title : this.form.title,     //题目
                    A : this.form.A,         //选项A
                    B : this.form.B,         
                    C : this.form.C,
                    D : this.form.D,
                    types : this.form.types,
                    answer : this.form.answer,
                    level_id : this.form.level_id,
                    fileds : this.form.fileds,
                    product_type : this.form.product_type,
                    is_del : this.form.is_del
                };
                var backData = null;
                // 修改信息
                if( this.idx >= 0 ) {
                    alertData.q_id = this.form.q_id;
                    backData = await this.$axios.get( '/gm/modifyQuestion', alertData );
                    if( backData.code == 200 ) {
                        this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], this.form );
                    }
                }
                // 新增信息
                else{
                    backData = await this.$axios.get( '/gm/addQuestion', alertData );
                    if( backData.code == 200 && this.tableData.length < this.page_size ) {
                        this.tableData.push( backData.result );
                    }
                }
                this.alertSuccess( backData );
                this.cancelEdit();
        	},
        	// 禁用弹框
        	handleDelete( index, row ) {
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
        		this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], { is_del : is_del } );
                var result = await this.$axios.get( '/gm/modifyQuestion', { q_id : this.tableData[ this.idx ].q_id, is_del : is_del } );
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
