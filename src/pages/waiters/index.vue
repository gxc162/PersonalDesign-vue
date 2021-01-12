<template>
    <div id="waiter">
        
        <el-row>
            <!-- 按钮 -->
            <el-col :span="4">
                <div class="btns">
                    <el-button size="small" type="primary" @click="handlerToAdd">添加</el-button>
                    <el-button size="small" type="danger" @click="handlerToBatchDelete">批量删除</el-button>
                </div>
            </el-col>
            <!-- 搜索栏 -->
            <el-col :span="10">
                <el-form :inline="true">
                    <el-form-item label="姓名">
                        <el-input size="small" placeholder="按照姓名搜索" v-model="listQuery.realname"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="success" @click="handlerQuery">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="list" v-loading="loading" @selection-change="handlerSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="realname" label="姓名"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="id_card" label="身份证号"></el-table-column>
            <el-table-column prop="bank_card" label="银行卡号"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            
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
            <el-form :model="waiter" label-width="80px" :rules="rules" ref="waiterForm">
                <el-form-item label="姓名" prop="realname">
                    <el-input v-model="waiter.realname"/>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="waiter.telephone"/>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_card">
                    <el-input v-model="waiter.id_card"/>
                </el-form-item>
                <el-form-item label="银行卡号" prop="bank_card">
                    <el-input v-model="waiter.bank_card"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio v-model="waiter.status" label="启用">启用</el-radio>
                    <el-radio v-model="waiter.status" label="禁用">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handlerClose">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('waiterForm')">提交</el-button>
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
                title:'',
                waiter:{},
                //模态框输入框规则
                rules:{
                     username:[
                         {required:true,message:'请输入用户名',trigger:'blur'},
                         {min:2,max:6,message:'用户名位数应该是2-6位',trigger:'blur'}
                     ],
                     realname:[
                         {required:true,message:'请输入姓名',trigger:'blur'},
                         {min:2,max:6,message:'姓名位数应该是2-6位',trigger:'blur'}
                     ],
                     password:[
                         {required:true,message:'请输入密码',trigger:'blur'},
                         {min:6,message:'密码位数最少为6位',trigger:'blur'}
                     ],
                     telephone:[
                         {required:true,message:'手机号不能为空',trigger:'blur'},
                        //  {type:'number',message:'手机号必须为数字',trigger:'blur'}
                     ],
                 },
                ids:[]
                
             }
        },
        computed:{
            // list(){
            //     return this.$store.state.waiter.list;
            // },
            // msg(){
            //     return this.$store.state.waiter.msg;
            // }

            //使用mapState简化以上操作
            ...mapState('waiters',['list','msg','visible','loading','total','listQuery'])
        },
        methods:{
            //辅助函数mapActions
             ...mapActions('waiters',['openDialog','closeDialog','query','nameQuery']),
             ...mapActions('waiters',{
                 findAllWaiter:'findAll',
                 saveOrUpdateWaiter:'saveOrUpdate',
                 deleteByIdWaiter:'deleteById',
                 batchDeleteWaiter:'batchDelete'
                }),
            //获取批量删除的id
            handlerSelectionChange(val){
                //val为一个数组 ，数组元素为选中的行信息(对象方式)
                this.ids=val.map(item=>item.id);
            },
            //保存或者修改
            handlerSubmit(waiterForm){
                this.$refs[waiterForm].validate((valid) => {
                    if (valid) {
                        //  this.$store.dispatch('waiter/saveOrUpdate',waiter)
                        this.saveOrUpdateWaiter(this.waiter)
                        .then(()=>{
                            //表单信息置为空
                            this.waiter={};
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
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        this.deleteByIdWaiter(id)
                        .then(()=>{
                            this.$notify({
                                message:this.msg,
                                type:'success',
                                title:"成功"
                                });
                        })
                        .catch(()=>{
                            alert(2)
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
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        this.batchDeleteWaiter(this.ids)
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
            //点击修改，修改模态框
            handlerToEdit(cus){
                 this.title='修改司机信息';
                 this.waiter=cus;
                 this.openDialog();

            },
            //添加顾客模态框
            handlerToAdd(){
                 this.title='添加司机信息';
                 this.waiter={};
                // `this.openDialog()` 映射为 `this.$store.dispatch('openDialog')`
                this.openDialog();
            },
            //关闭模态框
            handlerClose(){
                this.$refs.waiterForm.resetFields();
                this.closeDialog();
            },
            //按照姓名查询
            handlerQuery(){
                this.nameQuery(this.listQuery)
            }
        },
        created(){
                //  this.$store.dispatch('waiter/findAll')
                this.query();
        },

    }
 </script>
<style scoped>
    #waiter {
        padding: 1em 1em;
    }
</style>