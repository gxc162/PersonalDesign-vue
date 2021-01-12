<template>
    <div id="address">
        <el-row>
            <!-- 按钮 -->
            <el-col :span="4" >
                <div class="btns">
                    <el-button size="small" type="primary" @click="handlerToAdd">添加</el-button>
                    <el-button size="small" type="danger" @click="handlerToBatchDelete">批量删除</el-button>
                </div>
            </el-col>
            <!-- 搜索栏 -->
            <el-col :span="10">
                <el-form :inline="true">
                    <el-form-item label="下单地址">
                        <el-input size="small" placeholder="请输入详细地址" v-model="listQuery.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="success" @click="handlerQuery">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- / 按钮 -->
        <!-- 表格 -->
        <el-table :data="list" v-loading="loading" @selection-change="handlerSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="province" label="省"></el-table-column>
            <el-table-column prop="city" label="市"></el-table-column>
            <el-table-column prop="area" label="区域"></el-table-column>
            <el-table-column prop="address" label="详细地址"></el-table-column>
            <el-table-column prop="telephone" label="下单手机号"></el-table-column>
            
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
            <el-form :model="address" label-width="100px" :rules="rules" ref="addressForm">
                <el-form-item label="省" prop="province">
                    <el-input v-model="address.province"/>
                </el-form-item>
                <el-form-item label="市" prop="city">
                    <el-input v-model="address.city"/>
                </el-form-item>
                <el-form-item label="区域" prop="area">
                    <el-input v-model="address.area"/>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="address.address"/>
                </el-form-item>
                <el-form-item label="下单手机号" prop="telephone">
                    <el-input v-model="address.telephone"/>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handlerClose">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('addressForm')">提交</el-button>
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
                address:{},
                //模态框输入框规则
                rules:{
                     address:[
                         {required:true,message:'请输入详细地址',trigger:'blur'},
                         {min:2,max:20,message:'详细地址应该是2-20位',trigger:'blur'}
                     ],
                     telephone:[
                         {required:true,message:'请输入下单手机号',trigger:'blur'},
                         {min:3,max:11,message:'姓名位数应该是3-11位',trigger:'blur'}
                     ],
                 },
                ids:[],
             }
        },
        computed:{
            // list(){
            //     return this.$store.state.address.list;
            // },
            // msg(){
            //     return this.$store.state.address.msg;
            // }

            //使用mapState简化以上操作
            ...mapState('category',['list','msg','visible','loading','total','listQuery'])
        },
        methods:{
            //辅助函数mapActions
             ...mapActions('category',['openDialog','closeDialog','query','nameQuery']),
             ...mapActions('category',{
                 findAlladdress:'findAll',
                 saveOrUpdateaddress:'saveOrUpdate',
                 deleteByIdaddress:'deleteById',
                 batchDeleteaddress:'batchDelete'
                }),
            //获取批量删除的id
            handlerSelectionChange(val){
                //val为一个数组 ，数组元素为选中的行信息(对象方式)
                this.ids=val.map(item=>item.id);
            },
            //保存或者修改
            handlerSubmit(addressForm){
                this.$refs[addressForm].validate((valid) => {
                    if (valid) {
                        //  this.$store.dispatch('address/saveOrUpdate',address)
                        this.saveOrUpdateaddress(this.address)
                        .then(()=>{
                            //表单信息置为空
                            this.address={};
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
                this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        this.deleteByIdaddress(id)
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
                this.batchDeleteaddress(this.ids)
            },
            //点击修改，修改模态框
            handlerToEdit(cus){
                 this.title='修改地址信息';
                 this.address=cus;
                 this.openDialog();

            },
            //添加地址模态框
            handlerToAdd(){
                 this.title='添加地址信息';
                 this.address={};
                // `this.openDialog()` 映射为 `this.$store.dispatch('openDialog')`
                this.openDialog();
            },
            //关闭模态框
            handlerClose(){
                this.$refs.addressForm.resetFields();
                this.closeDialog();
            },
            //按照姓名查询
            handlerQuery(){
                this.nameQuery(this.listQuery)
            }

        },
        created(){
                //  this.$store.dispatch('address/findAll')
                this.query();
        },

    }
 </script>
<style scoped>
    #address {
        padding: 1em 1em;
    }
</style>