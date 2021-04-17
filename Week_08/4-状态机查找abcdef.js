function match (string) {
  let state = start; // start 状态函数
  for(let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if(c === 'a') {
    return foundA;
  }
  return start
}

function end (c){ // trap 陷阱
  return end;
}

function foundA (c) {
  if (c === 'b') {
    return foundB
  }
  return start(c)
}

function foundB (c) {
  if (c === 'c') {
    return foundC
  }
  return start(c)
}

function foundC (c) {
  if (c === 'd') {
    return foundD
  }
  return start(c)
}

function foundD (c) {
  if (c === 'e') {
    return foundE
  }
  return start(c)
}

function foundE (c) {
  if (c === 'f') {
    return end;
  }
   return start(c);
}

console.log(match('ababcdef'));


