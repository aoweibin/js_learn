// ! Promise 实现
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

  window.Promise = Promise;
})(window);
