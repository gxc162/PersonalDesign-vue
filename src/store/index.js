/*
 * @Author: your name
 * @Date: 2020-09-21 09:24:06
 * @LastEditTime: 2021-01-09 16:55:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \briup02\vue\huang-template\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import customer from './customer/index'
import waiters from './waiters/index'
import product from './product/index'
import order from './order/index'
import comment from './comment/index'
import category from './category/index'
import map from './map/index'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    customer,
    waiters,
    product,
    order,
    comment,
    category,
    map
  },
  getters
})

export default store
