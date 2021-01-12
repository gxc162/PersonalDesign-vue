import {get,post,post_array} from '../../utils/axios'
export default{
    namespaced:true,
    state:{
        name:'orders',
        list:[],
        msg:'',
        visible:false,
        loading:false,
        total:0,
        listQuery:{
            page:1,
            limit:7,
        }
        
    },
    getters:{

    },
    mutations:{
        // 重置list
        resetList(state,list){
            state.list=list;
        },
        //重置msg
        resetMsg(state,msg){
            state.msg=msg;
        },
        //重置visible
        resetVisible(state,b){
            state.visible=b;
        },
        //重置loading
        resetLoading(state,loading){
            state.loading=loading;
        }

    },
    actions:{
        openDialog(context){
            context.commit('resetVisible',true)
        },
        closeDialog(context){
            context.commit('resetVisible',false)
        },
        //分页查询
        query(context){
            context.commit('resetLoading',true)
            post('/order/pageQuery',{
                page:context.state.listQuery.page-1,
                pageSize:context.state.listQuery.limit,
            })
            .then((result)=>{
                context.state.total = 40;
                context.commit('resetList',result.data);
            })
            .finally(()=>{
                //取消加载
                context.commit('resetLoading',false)
            })
        },
        //查找所有
        findAll(context){
            //设置加载
            context.commit('resetLoading',true)

            get('/order/findAll')
            .then((result)=>{
                //将查询到的数据通过mutations设置到state中
                context.commit('resetList',result.data);
            })
            .finally(()=>{
                //取消加载
                context.commit('resetLoading',false)
            })
        },
        // 根据状态检索
        findByOrderStatus(context,status) {
            //设置加载
            context.commit('resetLoading',true)
            if(status == '所有订单'){
                context.dispatch('query')
                //取消加载
                context.commit('resetLoading',false)
            } else {
                get('order/findByOrderStatus',{status})
                .then(result => {
                    //将查询到的数据通过mutations设置到state中
                    context.commit('resetList',result.data);
                    //取消加载
                    context.commit('resetLoading',false)
                })
            }
            
        },
        //添加或修改
        saveOrUpdate(context,order){
            
            return post('/order/saveOrUpdate',order)
            .then((result)=>{
                //实现提示消息在状态机中
                // this._vm.$message({
                //     message: result.statusText,
                //     type: 'success'
                //     });
                context.commit('resetMsg',result.statusText);
                context.dispatch('query')
            });
        },
        //单个删除
        deleteById(context,id){
            return get('/order/deleteById',{id})
                .then((result)=>{
                    context.commit('resetMsg',result.statusText);
                    context.dispatch('query');
                })
        },
        //批量删除
        batchDelete({commit,dispatch},ids){
            post_array('/order/batchDelete',{ids})
            .then((result)=>{
                //注意与上边的区别
                //此处使用{commit,dispatch}直接从contect解构出这两个方法
                //直接使用方法即可，不需要context.commit
                commit('resetMsg',result.statusText);
                dispatch('query')
            })
        }
    }
}