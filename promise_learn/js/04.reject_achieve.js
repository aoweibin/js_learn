// ! 实现 reject 方法
(function (window) {
    function Promise(executor) {
      // * 初始状态
      this.PromiseState = "pending";
      this.PromiseResult = undefined;
      // ! callbackFn 不应该为对象，而应该为数组
      this.callbackFn = [];
  
      // ! 定义 resolve 函数
      const _resolve = (value) => {
        if (this.PromiseState !== "pending") return;
        this.PromiseState = "fulfilled";
        this.PromiseResult = value;
  
        // * 当执行器 executor 异步调用 resolve 时，需要执行 then 方法中的回调
        this.callbackFn.forEach((item) => item.onfulfilled(this.PromiseResult));
      };
  
      // ! 定义 reject 函数
      const _reject = (value) => {
        if (this.PromiseState !== "pending") return;
        this.PromiseState = "rejected";
        this.PromiseResult = value;
  
        // * 当执行器 executor 异步调用 resolve 时，需要执行 then 方法中的回调
        this.callbackFn.forEach((item) => item.onrejected(this.PromiseResult));
      };
  
      try {
        executor(_resolve, _reject);
      } catch (error) {
        _reject(typeof error === "object" ? error.message : error);
      }
    }
  
    Object.assign(Promise.prototype, {
      // ! then 方法实现
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
            this.callbackFn.push({
              onfulfilled: _common.bind(this, onfulfilled),
              onrejected: _common.bind(this, onrejected),
            });
          }
        });
      },
      // ! catch 方法实现
      catch(onrejected) {
        return this.then(undefined, onrejected);
      },
    });
  
    Promise.resolve = function (value) { 
        if (value instanceof Promise) {
            // * 如果 value 是一个 Promise，则直接返回
            return value;
        } else { 
            return new Promise(resolve => resolve(value));
        }
    };

    Promise.reject = function (value) {
        return new Promise((resolve, reject) => {
            reject(value);
        });
    };

    window.Promise = Promise;
  })(window);
  