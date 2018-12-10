import Resource from './lib/Resource';
export default {
    install:function (Vue, config) {
        // 1、设置http拦截器,config中必须把axios设置为handler
        if(config.hasOwnProperty('interceptor')){
            var interceptor = config.interceptor;
            if(interceptor.hasOwnProperty('request')){
                var request = interceptor.request;
                config.handler.interceptors.request.use(request.success,request.error);
            }
            if(interceptor.hasOwnProperty('response')){
                var response = interceptor.response;
                config.handler.interceptors.response.use(response.success,response.error);
            }
        }
        // 2、将baseOption设置到protoType
        Resource.prototype.baseOption = config.baseOption || {};

        // 3、将url设置到protoType
        Resource.prototype.baseUrl = config.baseUrl || '';

        // 4、将axios设置为处理函数
        Resource.prototype.handle = config.handler || function () {
            console.log("请将axios作为handler");
        };
        Vue.Resource = Resource;
    }
};
