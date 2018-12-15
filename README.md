# vue-axios-resource

### 一、Introdution

vue项目目前官方推荐使用axios来处理后端接口。写法如下：
```javascript
axios.get('/api/demo')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
一个vue项目会有很多个业务组件，如上面的接口"/api/demo"可能会在多个组件中用到，如果后端改了接口地址，那么前端就需要在所有使用过该接口的地方
都改一遍，这样不仅会增加工作量，更重要的是会对项目产生一定的修改风险。<br>

### 二、vue-axios-resource插件做了什么

#### 1、与后端接口进行对接
一个实例对应一个后端的controller。如下代码，实例化的demoApi对象对应后端的DemoController。
```javascript
const demoApi = new Vue.Resource({
    url: 'demo',
    actions: []
});
```
#### 2、四个公共方法
每个初始化后的实例都有四个与生俱来的方法：save（增）、delete（删）、update（改）、query（查）。

#### 3、扩展方法
一个后端的控制器除了curd之外，可能还会有其他额外的action。vue-axios-resource插件也支持方法的扩展，只需要在actions数组中添加即可。
```javascript
const authApi = new Vue.Resource({
    url: 'auth',
    actions: [
        {
            name:'login',
            method:'POST',
            url:'login'
        },
        {
            name:'logout',
            method:'POST',
            url:'logout'
        },
    ]
});
```
### 三、Usage

1、下载安装

```javascript
npm install vue-axios-resource --save
```

2、在main.js中引入

```javascript
import Vue from 'vue';
import axios from 'axios';
import vueAxiosResource from 'vue-axios-resource';
//interceptor的写法跟axios的一样
// import interceptor from 'config/interceptor'
Vue.use(vueAxiosResource,{
    handler:axios,
    baseUrl:'/api/',    //controller名之前除了域名的路径部分
    // interceptor:interceptor //非必传
});
```

3、在api/authApi.js文件中定义

```javascript
import Vue from 'vue';
const authApi = new Vue.Resource({
    // url对应的是后端的controller名
    // actions里面的url对应controller下面的action
    url: 'auth',
    actions: [
        {
            name:'login',
            method:'POST',
            url:'login'
        },
        {
            name:'logout',
            method:'POST',
            url:'logout'
        },
    ]
});
export default authApi;
```

4、 在组件中使用authApi
```javascript
    import authApi from 'api/authApi';
    export default {
        data(){
            
        },
        methods:{
            login(){
                // 在业务层，只需要关注登陆是用authApi的login方法，而后端的接口地址是不可见的
                // 如果有一天后端接口地址改了，业务组件部分是不需要改任何东西的，我们只需要改api/authApi.js中的url即可
               authApi.login({
                   data:{
                       name:'lvyulong',
                       password:'xxxxx'
                   }
               }).then(function(res) {
                    //回调逻辑
                    console.log(res);
                    ...
               })
            }
        }
    }
```

### 解释一下baseUrl

![解释一下baseUrl](https://github.com/lvyulong/vue-axios-resource/raw/master/image/api.jpg)
