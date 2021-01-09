<!--
        <div id="allmap" style="height:600px;"></div>
 * @Author: your name
 * @Date: 2020-10-08 09:33:21
 * @LastEditTime: 2020-10-08 10:26:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \briup02\vue\huang-template\src\pages\map\index.vue
-->
<template>
    <div class="patrol_area">
        <div>
            <el-row>
                <el-col :span="6">
                    <el-form :inline="true">
                        <el-form-item label="地点">
                            <el-input size="small" placeholder="按照地点搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="success">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="patrol_area">
            <div id="allmap" style="height:600px;"></div>
        </div>
    </div>
</template>

    <script>
export default {
  name: 'Dashboard',
  data(){
    return {
    }
  },
  mounted(){
    this.createMpa()
  },
  methods:{
    createMpa(){
         // GL版命名空间为BMapGL
        // 按住鼠标右键，修改倾斜角和角度
	    //var map = new BMapGL.Map("allmap");    // 创建Map实例
	    //map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
        //map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        //自动定位
        var map = new BMapGL.Map("allmap");
        var point = new BMapGL.Point(116.331398,39.897445);
        map.centerAndZoom(point,12);

        var geolocation = new BMapGL.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMap_STATUS_SUCCESS){
                var mk = new BMapGL.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                alert('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                alert('failed'+this.getStatus());
            }        
        });
    }
  }
}
</script>