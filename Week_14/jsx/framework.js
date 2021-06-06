export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type
  }

  for (let name in attributes) { // 遍历属性用 for in
    element.setAttribute(name, attributes[name])
  }
  for (let child of children) { // 遍历数组 for of
    if (typeof child === 'string') {
      child = new TextWrapper(child)
    }
    element.appendChild(child)
  }
  return element;
}

class Component {
  constructor(type) {
    this.root = this.render()
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    this.root = document.createElement(type)
  }
  
}

class TextWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  
}
