const EOF = Symbol('EOF'); // End of file

let currentToken = null;

function emit (token) {
  console.log(token)
}


function data(c) {
  // 判断是否为 tag 的开始
  if(c == '<') {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: 'EOF'
    })
    return ;
  } else {
    emit({
      type: 'text',
      content: c,
    })
    return data; // 文本节点
  }
}

function tagOpen (c) {
  if(c == '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag', // 开始标签 or 自封闭标签 -> startTag
      tagName: '',
    }
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen (c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    }
    return tagName(c);
  } else if (c == '>') {

  } else if (c == EOF) {

  } else {

  }
}

function tagName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName; // <html 
  } else if (c == '/') {
    return selfClosingStartTag; // 自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c; // 追加到当前 token 的 tagName 上
    return tagName;
  } else if (c == '>') { // 普通开始标签
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == '>') { // 结束
    return data;
  } else if (c == '=') {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag (c) {
  if (c == '>') {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c == 'EOF') {

  } else {

  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data; // 初始化状态机 data
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF)
}
