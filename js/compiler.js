class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.complie(this.el);
  }
  // 编译模版， 处理文本和元素节点
  complie(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        this.complieText(node);
      }
      if (this.isElementNode(node)) {
        this.complieElement(node);
      }
      if (node.childNodes && node.childNodes.length) {
        this.complie(node);
      }
    });
  }
  // 编译元素节点， 处理指令
  complieElement(node) {
    const attrArr = node.attributes;
    Array.from(attrArr).forEach((attr) => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        const key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater'];
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }
  // 处理v-text
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }
  // 处理v-model
  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    });
  }
  //  编译文本节点，处理差值表达式
  complieText(node) {
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent;
    if (reg.test(value)) {
      let key = reg.exec(value)[1].trim();
      node.textContent = value.replace(reg, this.vm[key]);
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }
  // 判断元素是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
