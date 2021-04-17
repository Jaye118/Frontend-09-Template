// 在字符串中，找到字符"ab"

function match (string) {
  let foundA = false;
  for (let c of string) {
    if (c == 'a') {
      foundA = true;
    } else if (foundA && c == 'b') {
      return true;
    } else {
      return true;
    }
  }
  return false;
}

console.log(match('I am groot'));


