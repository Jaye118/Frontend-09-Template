const EOF = new Symbol('EOF'); // End of file

function data(c) {

}

module.exports.parseHTML = function parseHTML(html) {
  let state = data; // 初始化状态机 data
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF)
}

