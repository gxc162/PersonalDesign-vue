<template>
    <div id="order">
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="所有订单" name="first"></el-tab-pane>
            <el-tab-pane label="待支付" name="second"></el-tab-pane>
            <el-tab-pane label="待派单" name="third"></el-tab-pane>
            <el-tab-pane label="待接单" name="fourth"></el-tab-pane>
            <el-tab-pane label="待服务" name="fifth"></el-tab-pane>
            <el-tab-pane label="待确认" name="sixth"></el-tab-pane>
            <el-tab-pane label="已完成" name="seventh"></el-tab-pane>
        </el-tabs>
        <!-- 表格 -->
        <el-table :data="list" v-loading="loading" @selection-change="handlerSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="订单编号"></el-table-column>
            <el-table-column prop="order_time" label="下单时间"></el-table-column>
            <el-table-column prop="total" label="总价"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="customer_id" label="顾客ID"></el-table-column>
            
            <el-table-column label="操作">
                <template v-slot="a">
                    <el-button
                    size="mini"
                    @click="handlerToEdit(a.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handlerToDel(a.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- / 表格 -->
        <!-- 分页 -->
        <pagination 
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="query">
        </pagination>
        <!-- / 分页 -->
        <!-- 模态框 -->
        <el-dialog :title="title" :visible="visible" @close="handlerClose">
            <el-form :model="order" label-width="80px" :rules="rules" ref="orderForm">
                <el-form-item label="总价" prop="total">
                    <el-input v-model="order.total"/>
                </el-form-item>
                <el-form-item label="顾客id" prop="customer_id">
                    <el-input v-model="order.customer_id"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio v-model="order.status" label="已完成">已完成</el-radio>
                    <el-radio v-model="order.status" label="待接单">待接单</el-radio>
                    <el-radio v-model="order.status" label="待服务">待服务</el-radio>
                    <el-radio v-model="order.status" label="待派单">待派单</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handlerClose">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('orderForm')">提交</el-button>
            </div>
        </el-dialog>
        <!-- / 模态框 -->
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
     import {mapState,mapActions} from 'vuex'
     export default{
         components:{Pagination},
         data(){
             return {
                activeName: 'first',
                title:'',
                order:{},
                //模态框输入框规则
                rules:{
                     total:[
                         {required:true,message:'请输入总价',trigger:'blur'},
                         {min:2,max:6,message:'价格应该是2-6位',trigger:'blur'}
                     ]
                 },
                ids:[],
             }
        },
        computed:{
            // list(){
            //     return this.$store.state.order.list;
            // },
            // msg(){
            //     return this.$store.state.order.msg;
            // }

            //使用mapState简化以上操作
            ...mapState('order',['list','msg','visible','loading','total','listQuery'])
        },
        methods:{
            handleClick(){

            },
            //辅助函数mapActions
             ...mapActions('order',['openDialog','closeDialog','query']),
             ...mapActions('order',{
                 findAllOrder:'findAll',
                 saveOrUpdateOrder:'saveOrUpdate',
                 deleteByIdOrder:'deleteById',
                 batchDeleteOrder:'batchDelete'
                }),
            //获取批量删除的id
            handlerSelectionChange(val){
                //val为一个数组 ，数组元素为选中的行信息(对象方式)
                this.ids=val.map(item=>item.id);
            },
            //保存或者修改
            handlerSubmit(orderForm){
                this.$refs[orderForm].validate((valid) => {
                    if (valid) {
                        //  this.$store.dispatch('order/saveOrUpdate',order)
                        this.saveOrUpdateOrder(this.order)
                        .then(()=>{
                            //表单信息置为空
                            this.order={};
                            //关闭模态框
                            this.closeDialog(),
                            //提示响应信息
                            this.$notify({
                                message:this.msg,
                                type:'success',
                                title:"成功"
                                });
                        })
                    } else {
                        return false;
                    }
                 });
             },
            //删除
            handlerToDel(id){
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        this.deleteByIdOrder(id)
                        .then(()=>{
                            this.$notify({
                                message:this.msg,
                                type:'success',
                                title:"成功"
                                });
                        })
                    })
                    .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                    });
            },
            //批量删除
            handlerToBatchDelete(){
                this.batchDeleteOrder(this.ids)
            },
            //点击修改，修改模态框
            handlerToEdit(cus){
                 this.title='修改订单信息';
                 this.order=cus;
                 this.openDialog();

            },
            //添加订单模态框
            handlerToAdd(){
                 this.title='添加订单信息';
                 this.order={};
                // `this.openDialog()` 映射为 `this.$store.dispatch('openDialog')`
                this.openDialog();
            },
            //关闭模态框
            handlerClose(){
                this.$refs.orderForm.resetFields();
                this.closeDialog();
            },
            //按照姓名查询
            handlerQuery(){
                this.nameQuery(this.listQuery)
            }

        },
        created(){
                //  this.$store.dispatch('order/findAll')
                this.query();
        },

    }
 </script>
<style scoped>
    #order {
        padding: 1em 1em;
    }
</style>