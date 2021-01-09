<template>
    <div id="ProductDetials">
        产品详情
        <el-button type="text" @click="()=>{this.$router.back()}">返回</el-button>
        <el-table :data="product">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="所属分类" prop="categoryId"></el-table-column>
            <el-table-column label="产品主图">
                <template v-slot="a">
                    <img :src="a.row.photo" alt="图片找不到" width="100%">
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {get} from "../../utils/axios"
export default {
    data(){
        return {
            product:[]
        }
    },
    created(){
        //通过id查询产品的详细信息
        this.findById();
    },
    methods:{
        findById(){
            get("/product/findById?id="+this.$route.params.id)
            .then((result)=>{
                // this.product[0]=result.data 错误写法
                this.product.push(result.data)
            })
        }
    }
}
</script>
<style scoped>

</style>