// 在字符串中，找到字符"abcdef"

function match (string) {
  let foundA = false;
  let foundB = false;
  let foundC = false;
  let foundD = false;
  let foundE = false;
  for (let c of string) {
    if (c == 'a') {
      foundA = true;
    } else if (foundA && c == 'b') {
      foundB = true;
    } else if (foundA && c == 'c') {
      foundC = true;
    } else if (foundA && c == 'd') {
      foundD = true;
    } else if (foundA && c == 'e') {
      return true;
    } else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }
  return false;
}

console.log(match('I am groot'));


