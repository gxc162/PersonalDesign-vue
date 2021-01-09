<template>
    <div id="comment">
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
                    <el-form-item label="评论内容">
                        <el-input size="small" placeholder="按照评论内容关键字搜索" v-model="listQuery.content"></el-input>
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
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="comment_time" label="评论时间"></el-table-column>
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
            <el-form :model="comment" label-width="80px" :rules="rules" ref="commentForm">
                <el-form-item label="评论内容" prop="content">
                    <el-input v-model="comment.content"/>
                </el-form-item>
                <el-form-item label="评论时间" prop="comment_time">
                    <el-input v-model="comment.comment_time"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio v-model="comment.status" label="审核通过">审核通过</el-radio>
                    <el-radio v-model="comment.status" label="审核不通过">审核不通过</el-radio>
                    <el-radio v-model="comment.status" label="未审核">未审核</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handlerClose">取消</el-button>
                <el-button size="small" type="primary" @click="handlerSubmit('commentForm')">提交</el-button>
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
                comment:{},
                //模态框输入框规则
                rules:{
                     content:[
                         {required:true,message:'请输入评论内容',trigger:'blur'},
                         {min:2,max:20,message:'字数控制在20字之内',trigger:'blur'}
                     ],
                 },
                ids:[],
             }
        },
        computed:{
            // list(){
            //     return this.$store.state.comment.list;
            // },
            // msg(){
            //     return this.$store.state.comment.msg;
            // }

            //使用mapState简化以上操作
            ...mapState('comment',['list','msg','visible','loading','total','listQuery'])
        },
        methods:{
            //辅助函数mapActions
             ...mapActions('comment',['openDialog','closeDialog','query','nameQuery']),
             ...mapActions('comment',{
                 findAllcomment:'findAll',
                 saveOrUpdatecomment:'saveOrUpdate',
                 deleteByIdcomment:'deleteById',
                 batchDeletecomment:'batchDelete'
                }),
            //获取批量删除的id
            handlerSelectionChange(val){
                //val为一个数组 ，数组元素为选中的行信息(对象方式)
                this.ids=val.map(item=>item.id);
            },
            //保存或者修改
            handlerSubmit(commentForm){
                this.$refs[commentForm].validate((valid) => {
                    if (valid) {
                        //  this.$store.dispatch('comment/saveOrUpdate',comment)
                        this.saveOrUpdatecomment(this.comment)
                        .then(()=>{
                            //表单信息置为空
                            this.comment={};
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
                        this.deleteByIdcomment(id)
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
                this.batchDeletecomment(this.ids)
            },
            //点击修改，修改模态框
            handlerToEdit(cus){
                 this.title='修改评论信息';
                 this.comment=cus;
                 this.openDialog();

            },
            //添加顾客模态框
            handlerToAdd(){
                 this.title='添加评论信息';
                 this.comment={};
                // `this.openDialog()` 映射为 `this.$store.dispatch('openDialog')`
                this.openDialog();
            },
            //关闭模态框
            handlerClose(){
                this.$refs.commentForm.resetFields();
                this.closeDialog();
            },
            //按照姓名查询
            handlerQuery(){
                this.nameQuery(this.listQuery)
            }

        },
        created(){
                //  this.$store.dispatch('comment/findAll')
                // this.findAllcomment();
                this.query();
        },


    }
 </script>
<style scoped>
    #comment {
        padding: 1em 1em;
    }
</style>