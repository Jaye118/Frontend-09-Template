const net = require('net');

// 在 Request 构造器中收集必要的信息
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = this.headers || {};

    // 以下要处理 Content-Type 和 Content-Length
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key =>
        `${key}=${encodeURIComponent(this.body[key])}`
      ).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  // 把请求数据发送到服务器。异步的，promise
  send(connection) {
    return new Promise((resolve, reject) => {
      // parser：逐步接收 response，来构建 response 的对象
      const parser = new ResponseParser;
      if (connection) {
        connection.write(this.toString());
      } else {
        // 创建 TCP 连接
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }
      connection.on('data', (data) => {
        console.log(data.toString());
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      })
      connection.on('error', (err) => {
        reject(err);
        connection.end();
      })
    })
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
}

class ResponseParser {
  constructor() {
    // 状态机
    // status line
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    // header: name space value line_end
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    // block_end
    this.WAITING_HEADER_BLOCK_END = 6;
    // body
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE; // 存储当前状态
    this.statusLine= '';
    this.headers = {};
    this.headerName = '';
    this.headerVlaue = '';
    this.bodyParser = null;
  }
  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response () {
    this.statusLine.match(/THHP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(string) {
    // 状态机逐个处理
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  // receiveChar：状态机代码
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') { // 只等一个 \n
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        // header 结束
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerVlaue;
        this.headerName = '';
        this.headerVlaue = '';
      } else {
        this.headerVlaue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser {
  constructor () {
    // 长度
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    // trunk
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }
  receiveChar (char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16; // 十六进制
        this.length += parseInt(char, 16);
      }

    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      // 存 trunk
      this.content.push(char);
      this.length --;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }

    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

void async function () {
  let request = new Request({
    method: 'POST', // http协议要求
    host: '127.0.0.1', // IP协议要求
    port: '8088', // TCP协议要求
    path: '/', // http
    headers: { // http
      ['X-Foo2']: 'customed',
    },
    body: {
      name: 'Jaye',
    }
  });

  let response = await request.send();
  console.log(response);
}();
