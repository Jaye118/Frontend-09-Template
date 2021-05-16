const EOF = new Symbol('EOF'); // End of file

function data(c) {
  // 判断是否为 tag 的开始
  if(c == '<') {
    return tagOpen(c);
  } else if (c == EOF) {
    return;
  } else {
    return data; // 文本节点
  }
}

function tagOpen (c) {
  if(c == '/') {
    return endTagOpen(c);
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen (c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c == '>') {

  } else if (c == EOF) {

  } else {

  }
}

function tagName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName(c); // <html 
  } else if (c == '/') {
    return selfClosingStartTag(c); // 自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c == '>') { // 普通开始标签
    return data;
  } else {
    return tagName(c);
  }
}

function beforeAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName(c);
  } else if (c == '>') { // 结束
    return data;
  } else if (c == '=') {
    return beforeAttributeName(c);
  } else {
    return beforeAttributeName(c);
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
