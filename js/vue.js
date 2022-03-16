class Vue {
  constructor(options) {
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el;
    // 把data中的数据转换成getter和setter，注入到vue实例中
    this._proxyData(this.$data);
    // 调用observer对象，监听数据变化
    new Observer(this.$data);
    // 调用complier对象，解析指令和差值表达式
    new Compiler(this);
  }
  _proxyData(data) {
    // 遍历data中所有属性
    Object.keys(data).forEach((key) => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
