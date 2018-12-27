<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> common表管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="data" border>
                <el-table-column prop="id" label="ID" min-width="5%" sortable align="center"></el-table-column>
                <el-table-column prop="dis" label="标题" min-width="20%" ></el-table-column>
                <el-table-column prop="route" label="类型" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="data" label="数据" min-width="20%" align="center"></el-table-column>
                <el-table-column label="操作" min-width="5%" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
             </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" width="40%" :close-on-click-modal="false" center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="data数据:">
                    <el-input type="textarea" v-model="form.data" :rows="7" :style="{'font-size':'20px'}"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveEdit" type="primary">确定</el-button>
                <el-button @click="editVisible = false" type="primary">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ch_common',
        data() {
           return{
                editVisible: false,
                form: {},
                idx: -1,
                tableData: []
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter(( d ) => {
                    return d;
                })
            }
        },
        methods:{
            // 查看详情
            handleEdit( index, row ) {
                this.editVisible = true;
                this.idx = index;
                this.form = Object.assign( {}, row );
            },
            // 保存修改
            async saveEdit() {
                this.editVisible = false;
                var alertData = {
                    id : this.form.id,
                    data : this.form.data
                }
                var backData = await this.$axios.get( '/gm/modifyCommonData', alertData );
                if( backData.code == 200 ) {
                    this.tableData[ this.idx ] = Object.assign( this.tableData[ this.idx ], this.form );
                }
                this.alertSuccess();
            },
            // 获取每页的数据
            async getData() {
                var backData = await this.$axios.get( '/gm/getCommonData', {});
                if( backData.code == 200 ) {
                    this.tableData = backData.result;
                }
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
</style>
