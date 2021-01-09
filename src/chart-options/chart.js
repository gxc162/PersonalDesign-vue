/*
 * @Author: your name
 * @Date: 2020-10-07 19:57:06
 * @LastEditTime: 2020-10-08 09:20:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \briup02\vue\huang-template\src\chart-options\chart.js
 */
module.exports = {
    bar: {
    chart: {
    type:'column'//指定图表的类型，默认是折线图（line）
    },
    credits: {
    enabled:false
    },//去掉地址
    title: {
    text: '叮叮打车当日订单情况' //指定图表标题
    },
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
     '#24CBE5' ],
    xAxis: {
     categories: ['北京', '上海', '杭州','广州','苏州'] //指定x轴分组
    },
    yAxis: {
     title: {
     text: '10.8订单总量', //指定y轴的标题
    },
    },
    plotOptions: {
     column: {
     colorByPoint:true
     },
     },
    series: [{ //指定数据列
     name: '叮叮打车10.8订单总量',
     data: [{
     y:1000,
     color:"red"}, 5000, 4000,5000,2000] //数据
    }]
    }
   }