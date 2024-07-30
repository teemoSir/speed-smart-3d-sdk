
import toolbar from './toolbar.vue'

toolbar.install = function (Vue) {
  Vue.component(toolbar.name, toolbar)
}

// // 定义插件对象
// const toolbar = {};
// // vue的install方法，用于定义vue插件
// toolbar.install = function(Vue, options) {
//   console.log(options)
//   const toolbarInstance = Vue.extend(toolbarvue);
//   let currentMsg;
//   const initInstance = () => {
//     // 实例化vue实例
//     currentMsg = new toolbarInstance();
//     let msgBoxEl = currentMsg.$mount().$el;
//     document.body.appendChild(msgBoxEl);
//   };
//   // 在Vue的原型上添加实例方法，以全局调用
//   Vue.prototype.$msgTip = {
//     showTip(options) {
//       if (!currentMsg) {
//         initInstance();
//       }
//       if (typeof options === 'string') {
//         currentMsg.content = options;
//       } else if (typeof options === 'object') {
//         Object.assign(currentMsg, options);
//       }
//       return currentMsg; // 为了链式调用
//     }
//   };
// };

export default toolbar
