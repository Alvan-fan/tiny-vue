class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    let dep = new Dep();
    Object.keys(data).forEach((key) => {
      this.difineReactive(data, key, data[key], dep);
    });
  }

  difineReactive(obj, key, val, dep) {
    let that = this;
    // 如果val是对象，转换val属性为响应式的
    this.walk(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() { 
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue === val) {
          return;
        }
        val = newValue;
        that.walk(newValue);
        dep.notify();
      },
    });
  }
}
