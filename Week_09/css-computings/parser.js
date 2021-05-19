const CSS = require('css');

const EOF = Symbol('EOF'); // End of file

let currentToken = null;
let currentAttribute = null;

let stack = [{type: 'document', children: []}];
let currentTextNode = null;

// 加入一个新的函数，addCSSRules，把 CSS 规则暂存到一个数组里
let rules = [];
function addCSSRules (text) {
  let ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "   "))
  rules.push(...ast.stylesheet.rules);
}

// 假设此处 selector 都是简单选择器
// div tagName 选择器 默认
// .a
// #a
function match(element, selector) {
  if (!selector || !element.attributes) { // !element.attributes 是否为文本节点
    return false
  }
  if (selector.charAt(0) == '#') { // charAt() 返回指定位置的字符
    var attr = element.attrabutes.filter(attr => attr.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if (selector.charAt(0) == '.') {
    var attr = element.attrabutes.filter(attr => attr.name === 'class')[0];
    if (attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function computeCSS (element) {
  // console.log(rules);
  // console.log('compute CSS for Element', element);

  // 在用栈来构建整个 DOM 树的过程中，stack 中存储了所有当前元素的父元素
  // 因为栈是不断变化的，后续的解析可能会污染 stack，所有用 slice() 复制整个数组
  // reverse()：因为标签匹配是从当前元素开始逐级往外匹配，
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {}; // 保存由 css 设置的属性
  }

  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse();

    // 当前元素 与 selectors[0] 进行匹配
    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;
    
    var j = 1; // j 当前选择器的位置; i 当前元素的位置
    for (var i = 0; i< element.length; i++) {
      if (match(element[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) { // 所以选择都被匹配到
      matched = true; // 匹配成功
    }

    if (matched) { // 匹配到
      var computedStyle = element.computedStyle;
      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
          computedStyle[declaration.property].value = declaration.value;
        }
      }
    }
  }
}

function emit (token) {
  let top = stack[stack.length -1]; // 栈顶
  if (token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;

    for (let p in token) {
      if (p != 'type' && p != 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    computeCSS(element)

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) { // 不是自封闭标签
      stack.push(element);
    }

    currentTextNode = null;

  } else if (token.type == 'endTag') {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!")
    } else {
      //++++++++ 遇到 style 标签时，执行添加 css 规则操作 ++++//
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      top.children.content += token.content;
    }
    currentTextNode.content += token.content;
  }
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


// <html maaa=a
function beforeAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == '/' || c == '>' || c == EOF) { // 结束
    return afterAttributeName(c);
  } else if (c == '=') {
    // 属性里不可能有 = 开头，所以报错
  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c);
  }
}

// <div class="abc" ></div>
function attributeName (c) {
  if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c);
  } else if (c == '=') { // value
    return beforeAttributeValue;
  } else if (c == '\u0000') {

  } else if (c == '\"' || c == "'" || c == '<') {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '\"') {
    return doubleQuotedAttributeValue;
  } else if (c == '\'') {
    return singleQuotedAttributeValue;
  } else if (c == '>') {
    return data;
  } else {
    return UnquotedAttributeValue(c);
  }
}

function singleQuotedAttributeValue (c) {
  if (c == '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue (c) {
  if (c == '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/)) { // 结束
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == '\u0000') {

  } else if (c == '\"' || c == "'" || c == '<' || c == '=' || c == '`') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
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

function afterAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == '/') {
    return selfClosingStartTag;
  } else if (c == '=') {
    return beforeAttributeValue;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c);
  }
}

function afterQuotedAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == '/') {
    return selfClosingStartTag;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data; // 初始化状态机 data
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF)
  console.log(stack[0])
}
