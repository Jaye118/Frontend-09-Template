// 问题：在字符串中，找到字符“a”

function match (string) {
  for (let c of string) {
    if (c == 'a') return true;
  }
  return false;
}

match('I am groot');
