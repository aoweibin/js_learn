// ! then 方法实现
(function (window) {
  function Promise(executor) {
    // * 初始状态
    this.PromiseState = "pending";
    this.PromiseResult = undefined;

    // ! 定义 resolve 函数
    const _resolve = (value) => {
      if (this.PromiseState !== "pending") return;
      this.PromiseState = "fulfilled";
      this.PromiseResult = value;
    };

    // ! 定义 reject 函数
    const _reject = (value) => {
      if (this.PromiseState !== "pending") return;
      this.PromiseState = "rejected";
      this.PromiseResult = value;
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
        const _common = (callback) => {
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
          _common(onfulfilled);
        } else if (this.PromiseState === "rejected") {
          _common(onrejected);
        }
      });
    },
  });

  window.Promise = Promise;
})(window);
