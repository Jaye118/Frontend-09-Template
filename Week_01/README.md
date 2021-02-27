学习笔记  
### 1. TicTacToe
```
// 和棋情况
let pattern = [
  [0, 0, 2],
  [0, 1, 0],
  [0, 0, 0],
];
// 赢的情况
let pattern = [
  [0, 2, 0],
  [0, 1, 0],
  [0, 0, 0],
];
```
### 2. break 跳出循环，可以借助变量 outer
```
outer: for (let i = 0; i < 3; i++) { // outer: 跳出 ouuter 循环
    for (let j = 0; j < 3; j++) {
      ...
      break outer;
    }
  }
```

### 3. clone 数组方法  
  * Object.create(pattern); // pattern 生命周期短，节省内存  
  * JSON.parse(JSON.stringify(pattern))  消耗内存

### 4. JS 异步机制
* callback （setTimeout），JS 初期唯一异步方案，代码复杂，回调地狱。
* Promise then 中返回 Promise 实现链式表达
* async/await：基于 promise 机制的封装。早年用 generator + yeild 模拟
  * async + generator 可实现异步迭代器，对应 for await of 语法
