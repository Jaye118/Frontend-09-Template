const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    // body.push(chunk.toString());
    // 因为在此时收到的数据已经是 Buffer 对象
    body.push(chunk);
  }).on('end', () => {
    // 或者这里改写为 body.join('')
    // 因为 Buffer.concat 只能接收一个元素均为 Buffer 类型的数组
    body = Buffer.concat(body).toString(); // 将数组内容拼接为字符串
    console.log('body', body)
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('Hello World\n')
  })
}).listen(8088);

console.log('server started')
