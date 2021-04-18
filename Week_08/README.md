## 第8周 浏览器工作原理

### 一、浏览器总论
> 显示在屏幕上一定是图片 Bitmap

#### 渲染过程
URL--Http--HTML--parse--DOM--css computing--DOM with CSS：带样式的DOM--layout布局/排版--DOM with position 位置/盒--render--Bitmap--操作系统、硬件驱动提供API
接口，最终渲染展示页面

### 二、状态机|有限状态机，处理字符串
#### 1、有限状态机：
> 重点在"机",
>
- 特点：每个状态都是一个机器（独立的、解耦的）
  - 每个机器里都可以做计算、存储、输出...（只关心本状态机，比如游戏中主角的各种状态）
  - 所有的这些机器接受的输入是一致的
  - 状态机的每个机器本身没有状态，如果我们用函来表示的话，它应该是纯函数(无副作用)
- 每个机器知道下一个状态
  - 每个机器都有确定 下一个状态（Moore）简单
  - 每个机器根据输入决定下一个状态（Mealy）实用

#### 2、JS 中的有限状态机 Mealy
```
// 每个函数是一个状态
function state(input) // 函数参数就是输入
{
  // 在函数中年，可以自由地编写代码，处理每个状态的逻辑
  return next; // 返回值作为下一个状态
}

/////// 以下是调用 //////
while(input){
  // 获取输入
  state = state(input); // 把状态机的返回值作为下一个状态
}
```

#### 2、不使用状态机处理字符串
> 见练习题

### 三、HTTP 解析
#### 1、ISO-OS 七层网络模型
1. 物理层、数据链路层 == 4G/5G/Wifi
    - 对数据点对点准确的传输
2. 网络层 == Internet
3. 传输层 == TCP (require('net'))、UDP
4. 会话、表应用 == hTTP (require('http'))

#### 2、TCP/IP
TCP：
- 流 == 包：没有明显的分隔单位，只保证前后顺序正确
- 端口 == IP地址：计算机的网卡通过端口，将数据包分配给各个应用
- require('net') == libnet/libpcap(C++底层库)：node概念
> libnet：负责构造 IP包并且发送出去
> labpcap：负责从网卡抓所有的流经网卡的 IP包

#### 2、HTTP
一一对应
- Request
- Response

##### request
> 第一步：
> 设计一个 http 请求的类：
> content type 是必要的字段，要有默认值
> body 是 KV格式
> 不同的 content-type 影响 body 的格式
```
POST /HTTP/1.1 --- method/路径/http版本
Host: 127.0.0.1 --- 这两行是 headers
Content-Type: application/x-www-form-urlencoded

field=aaa&code=x%3D1 --- body,由 Content-Type 决定
```

> 第二步：
> 在 Request 的构造器中收集必要的信息
> 设计一个 send 函数（异步的，返回Promise），把请求真实发送到服务器。

> 第三步 发送请求
> * 设计支持已有的 connection 或者自己新建 connection
> * 收到数据传给 parser
> * 根据 parser 的状态 resolve Promis

```
HTTP/1.1 200 ok （status line）
Content-Type: text/html （header）
Date:
Connection: keep-alive
Traansfer-Encoding: chunked

chunk body:
26  （十六进制）切分body
<html><body>xxx</body><html>
0  （十六进制）
```

> 第四步 ResponseParser 总结
> * Response 必须分段构造，所以要用一个 ResponseParser 来“装配”
> * ResponseParser 分段处理 ResponseText，所以用状态机来分析文本的结构

> 第五步 BodyParser 总结
> * Response 的 body 可能根据 Content-Type有不同的结构，因此会才去用子 Parser 的结构来解决问题
> * 以 TrunkedBodyParser 为例，同样用状态机来处理 body 的格式

