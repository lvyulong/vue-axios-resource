/*
usage:
Resource类中所有的方法，都只接受一个option对象；
option对象中的可配置项：body、params、headers等
*/

function Resource(config) {
    this.config = config;
    // 如果有actions，生成这些额外的方法，
    //这些方法是实例的方法，并不是公有方法（原型链上的方法,也就是说每个实例的这些方法可能都不一样）
    if (config.actions && config.actions.length > 0) {
        for(var i=0;i<config.actions.length;i++){
            var v = config.actions[i];
            // 如果有形如/:id的参数
            if(v.url.indexOf('/:')!=-1){
                var names = v.url.split('/:');
                var actionName = names[0];
                var actionParam = names[1];
                this[v.name] = function (option) {

                    if(!option.params){
                        option.params = {};
                    }
                    if(!option.params[actionParam]){
                        option.params[actionParam] = ''
                    }
                    var selfOption = {
                        url: this.baseUrl + config.url + '/' + actionName + '/' + option.params[actionParam],
                        method: v.method
                    };
                    option = Object.assign({}, this.baseOption, selfOption, option);
                    return this.handle(option)
                }
            } else {
                this[v.name] = function (option) {
                    var selfOption = {
                        url: this.baseUrl + config.url + '/' + v.url,
                        method: v.method
                    };
                    option = Object.assign({}, this.baseOption, selfOption, option);
                    return this.handle(option);
                }
            }
        }
    }
};
// 公有方法：query、get、save、delete、update
// index方法，注意传参顺序
Resource.prototype.query = function (option) {
    var selfOption = {
        url: this.baseUrl + this.config.url,
        method: 'GET'
    };
    option = Object.assign({}, this.baseOption, selfOption, option);
    return this.handle(option);
};
// view
Resource.prototype.get = function (option) {
    var selfOption = {
        url: this.baseUrl + this.config.url + '/' + option.params.id,
        method: 'GET'
    };
    option = Object.assign({}, this.baseOption, selfOption, option);
    return this.handle(option);
};

// create
Resource.prototype.save = function (option) {
    var selfOption = {
        url: this.baseUrl + this.config.url,
        method: 'POST'
    };
    option = Object.assign({}, this.baseOption, selfOption, option);
    return this.handle(option);
};

// update
Resource.prototype.update = function (option) {
    var id = (option.params&&option.params.id) || (option.data&&option.data.id);
    var selfOption = {
        url: this.baseUrl + this.config.url + '/' +  id,
        method: 'PUT'
    };
    option = Object.assign({}, this.baseOption, selfOption, option);
    return this.handle(option);
};

// delete
Resource.prototype.delete = function (option) {
    var id = (option.params&&option.params.id) || (option.data&&option.data.id);
    var selfOption = {
        url: this.baseUrl + this.config.url + '/' + id,
        method: 'DELETE'
    };
    option = Object.assign({}, this.baseOption, selfOption, option);
    return this.handle(option);
};

export default Resource;