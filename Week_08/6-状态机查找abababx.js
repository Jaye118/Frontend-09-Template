function match (string) {
  let state = start; // start 状态函数
  for(let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if(c === 'a') {
    return foundB;
  }
  return start
}

function end (c){ // trap 陷阱
  return end;
}

function foundB (c) {
  if (c === 'b') {
    return foundA2
  }
  return start(c)
}

function foundA2 (c) {
  if (c === 'a') {
    return foundB2
  }
  return start(c)
}

function foundB2 (c) {
  if (c === 'b') {
    return foundA3
  }
  return start(c)
}

function foundA3 (c) {
  if (c === 'a') {
    return foundB3
  }
  return start(c)
}

function foundB3 (c) {
  if (c === 'b') {
    return foundX
  }
  return start(c)
}

function foundX (c) {
  if (c === 'x') {
    return end;
  }
   return foundA3(c);
}

console.log(match('abababx'));
