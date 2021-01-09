<!--
 * @Author: your name
 * @Date: 2020-09-21 09:24:06
 * @LastEditTime: 2021-01-09 17:07:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \briup02\vue\huang-template\src\views\dashboard\index.vue
-->
<template>
 <div id="app">
 <x-chart :id="id" :option="option"></x-chart>
 </div>
</template>
<script>
// 导入chart组件
import XChart from '../../components/Chart/index'
// 导入chart组件模拟数据
import options from '../../chart-options/chart'
export default {
 name: 'app',
 data() {
 let option = options.bar
 return {
 id: 'test',
 option: option
 }
 },
 components: {
 XChart
 }
}
</script>
<style>
#test {
 width: 100%;
 height: 100%;
 margin: 40px auto;
}
</style>