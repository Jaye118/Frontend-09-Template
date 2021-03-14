学习笔记

# 第三周：编程与算法训练

### 一、字符串的处理
LL 算法构建 AST（抽象语法树）: 此过程叫作语法分析
> 著名语法分析算法核心思想： LL、LR
> * LL：left 缩写，从左到右扫描，从左到右规约
> * LR：

### 二、四则运算

##### 1.词法的定义
> token：有意义的输入：number、operator
* TokenNumber: 1 2 3 4 5...9 0 的组合（支持小数）
* Operator: + - * /
* Whitespace: <SP>（格式化字符）
* LineTerminator: <LF> <CR>（格式化字符）

##### 2.语法的定义
// TODO
> * 产生式:
> * <MultiplicativeExpression>：最低层级，是用 * 或 / 相链接的 Number 的序列
> * <EOF>: End of file 标识所有源代码的结束

### 三、正则表示式
* \t 制表符tab
* generator 函数用法：
```
function* fn() {
    ...
    yield token; // 返回一个序列
}
for (let token of fn(source)) {
    ...
}
```

### 四、LL语法分析
```
<AdditiveExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
```
