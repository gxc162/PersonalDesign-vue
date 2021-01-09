<template>
    <div id="product">
        <el-row>
            <!-- 按钮 -->
            <el-col :span="4" >
                <div class="btns">
                    <el-button size="small" type="primary" @click="handlerToAdd">添加</el-button>
                    <el-button size="small" type="danger" @click="handlerToBatchDelete">批量删除</el-button>
                </div>
            </el-col>
            <!-- 搜索栏 -->
            <el-col :span="6">
                <el-form :inline="true">
                    <el-form-item label="所属栏目">
                        <el-input size="small" placeholder="请输入" v-model="listQuery.name"></el-input>
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
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="categoryId" label="所属栏目"></el-table-column>
            <!-- 操作区 -->
            <el-table-column label="操作" width="150px" align="center">
                <template v-slot="a">
                    <a href="" @click.prevent="handlerToDel(a.row.id)" style="color:red">删除</a>&nbsp;
                    <a href="" @click.prevent="handlerToEdit(a.row)" style="color:#409eff">修改</a>&nbsp;
                    <a href="" @click.prevent="toDetailsHandler(a.row.id)" style="color:#409eff">详情</a>&nbsp;
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
            <el-form :model="product" label-width="80px" :rules="rules" ref="productForm">
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="product.name"/>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="product.description"/>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="product.price"/>
                </el-form-item>
                <el-form-item label="所属栏目" prop="categoryId">
                    <el-radio v-model="product.status" label="启用">启用</el-radio>
                    <el-radio v-model="product.status" label="禁用">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handlerClose">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('productForm')">提交</el-button>
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
                product:{},
                //模态框输入框规则
                rules:{
                     realname:[
                         {required:true,message:'请输入姓名',trigger:'blur'},
                         {min:2,max:6,message:'姓名位数应该是2-6位',trigger:'blur'}
                     ],
                     telephone:[
                         {required:true,message:'请输入手机号',trigger:'blur'},
                         {min:3,max:11,message:'姓名位数应该是3-11位',trigger:'blur'}
                     ],
                 },
                ids:[],
             }
        },
        computed:{
            // list(){
            //     return this.$store.state.product.list;
            // },
            // msg(){
            //     return this.$store.state.product.msg;
            // }

            //使用mapState简化以上操作
            ...mapState('product',['list','msg','visible','loading','total','listQuery'])
        },
        methods:{
            //辅助函数mapActions
             ...mapActions('product',['openDialog','closeDialog','query','nameQuery']),
             ...mapActions('product',{
                 findAllProduct:'findAll',
                 saveOrUpdateProduct:'saveOrUpdate',
                 deleteByIdProduct:'deleteById',
                 batchDeleteProduct:'batchDelete'
                }),
            //获取批量删除的id
            handlerSelectionChange(val){
                //val为一个数组 ，数组元素为选中的行信息(对象方式)
                this.ids=val.map(item=>item.id);
            },
            //保存或者修改
            handlerSubmit(productForm){
                this.$refs[productForm].validate((valid) => {
                    if (valid) {
                        //  this.$store.dispatch('product/saveOrUpdate',product)
                        this.saveOrUpdateProduct(this.product)
                        .then(()=>{
                            //表单信息置为空
                            this.product={};
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
                        this.deleteByIdProduct(id)
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
                this.batchDeleteProduct(this.ids)
            },
            //跳转到详情页
            toDetailsHandler(id){
            this.$router.push("/productDetials/"+id)
            },
            //点击修改，修改模态框
            handlerToEdit(cus){
                 this.title='修改产品信息';
                 this.product=cus;
                 this.openDialog();

            },
            //添加顾客模态框
            handlerToAdd(){
                 this.title='添加产品信息';
                 this.product={};
                // `this.openDialog()` 映射为 `this.$store.dispatch('openDialog')`
                this.openDialog();
            },
            //关闭模态框
            handlerClose(){
                this.$refs.productForm.resetFields();
                this.closeDialog();
            },
            //按照姓名查询
            handlerQuery(){
                this.nameQuery(this.listQuery)
            }

        },
        created(){
                //  this.$store.dispatch('product/findAll')
                this.query();
        },

    }
 </script>
<style scoped>
    #product {
        padding: 1em 1em;
    }
</style>