<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> pk记录管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 添加导出按钮 -->
            <div class="handle-box" style="margin-left: 90%;">
                <el-button type="primary" @click="exportExcel" :loading="downloadLoading">导出excel</el-button>
            </div>
        </div>
        <div class="container">
            <el-table :data="data" border>
                <el-table-column prop="id" label="ID" min-width="10%" sortable align="center"></el-table-column>
                <el-table-column prop="title" label="类型" min-width="14%" :formatter="setType" align="center"></el-table-column>
                <el-table-column prop="created" label="创建者" min-width="14%" align="center"></el-table-column>
                <el-table-column prop="totalTitle" label="问题数量" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="num" label="参与人数" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="create_time" label="开始时间" min-width="14%" align="center" :formatter="setStartTime"></el-table-column>
                <el-table-column prop="roomEndTime" label="结束时间" min-width="14%" align="center" :formatter="setEndTime"></el-table-column>
                <el-table-column label="操作" min-width="10%"  align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
                            详情
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
        <el-dialog title="pk详情" :visible.sync="editVisible" width="50%" :close-on-click-modal="false" center>
            <el-table :data="form" border>
                <el-table-column prop="uid" label="ID" min-width="10%" sortable align="center"></el-table-column>
                <el-table-column prop="rank" label="排名" min-width="10%" sortable align="center"></el-table-column>
                <el-table-column prop="nickname" label="姓名" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="correctCount" label="正确数" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="time" label="用时" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="point" label="得到积分" min-width="10%" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'pkrecord',
        data() {
           return{
                downloadLoading : false,
                editVisible: false,
                delVisible: false,
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
                    return d;
                })
            }
        },
        methods:{
            // 设置开始时间
            setStartTime( row, type ) {
                return this.$lele.toTimeTZ( row.create_time );
            },
            setEndTime( row, type ) {
                return this.$lele.toTimeTZ( row.roomEndTime );
            },
            // 设置产品
            setType( row ) {
                return row.type == 1 ? '实时对战'  : '多人邀请赛';
            },
            // 查看详情
            handleEdit( index, row ) {
                this.editVisible = true;
                this.form = row.pkDetails;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取每页的数据
            async getData() {
                var backData = await this.$axios.get( '/gm/pkRecordList', { page : this.cur_page, pageSize : this.page_size } );
                if( backData.code == 200 ) {
                    this.tableData = backData.result;
                    this.total = backData.total;
                }
            },
            exportExcel() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['id', '创建者', '题数', '参与人数', '参加类型','创建时间', '结束时间','详情'];
                    const filterVal = ['id', 'created', 'totalTitle', 'num', 'type', 'create_time', 'roomEndTime', 'pkDetails'];
                    const data = this.formatJson( filterVal, this.tableData );
                    var myDate = new Date();
                    var filename = this.$lele.formatTime() + '-pk-record';
                    excel.export_json_to_excel({
                        header: tHeader,
                        data : data,
                        filename: filename,
                        autoWidth: true,
                        bookType: 'xlsx'
                    })
                    this.downloadLoading = false
                })
            },
            // 将data数组转为每个值
            formatJson( filterVal, jsonData ) {
                return jsonData.map( v =>
                    filterVal.map( j => {
                        if( j === 'type' ) {
                            return v[j] == 1 ? '实时pk':'多人邀请赛';
                        }
                        else if( j === 'pkDetails' ) {
                            return JSON.stringify( v[j] );
                        }
                        else {
                            return v[j]
                        }
                    })
                )
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
