// ! then 方法实现之处理 pending 状态
(function (window) {
  function Promise(executor) {
    // * 初始状态
    this.PromiseState = "pending";
    this.PromiseResult = undefined;
    // * 用于处理 then 的回调
    this.callbackFn = {};

    // ! 定义 resolve 函数
    const _resolve = (value) => {
      if (this.PromiseState !== "pending") return;
      this.PromiseState = "fulfilled";
      this.PromiseResult = value;

      // * 当执行器 executor 异步调用 resolve 时，需要执行 then 方法中的回调
      if (this.callbackFn.onfulfilled)
        this.callbackFn.onfulfilled();
    };

    // ! 定义 reject 函数
    const _reject = (value) => {
      if (this.PromiseState !== "pending") return;
      this.PromiseState = "rejected";
      this.PromiseResult = value;

      // * 当执行器 executor 异步调用 resolve 时，需要执行 then 方法中的回调
      if (this.callbackFn.onfulfilled)
        this.callbackFn.onfulfilled();
    };

    try {
      executor(_resolve, _reject);
    } catch (error) {
      _reject(typeof error === "object" ? error.message : error);
    }
  }

  Object.assign(Promise.prototype, {
    then(onfulfilled, onrejected) {
      if (!(onfulfilled instanceof Function)) {
        onfulfilled = (value) => value;
      }
      if (!(onrejected instanceof Function)) {
        onrejected = (reason) => {
          throw reason;
        };
      }

      return new Promise((resolve, reject) => {
        // ! 由箭头函数改为匿名函数，使得后面处理更加明确
        const _common = function (callback) {
          setTimeout(() => {
            try {
              const value = callback(this.PromiseResult);
              if (value instanceof Promise) {
                value.then(resolve, reject);
              } else {
                resolve(value);
              }
            } catch (error) {
              reject(error);
            }
          }, 0);
        };

        if (this.PromiseState === "fulfilled") {
          _common.call(this, onfulfilled);
        } else if (this.PromiseState === "rejected") {
          _common.call(this, onrejected);
        } else {
          // ! 处理 pending 状态，将 then 方法的回调放置到 promise 的 callbackFn 中
          this.callbackFn = {
            onfulfilled: _common.bind(this, onfulfilled),
            onrejected: _common.bind(this, onrejected),
          };
        }
      });
    },
  });

  window.Promise = Promise;
})(window);
