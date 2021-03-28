学习笔记
### proxy 与双向数据绑定
```
* 不建议在业务中大量使用
* 特性：强大且危险。使用 proxy 代码预期性变差；是专门为底层库设计的
```
##### 一、基本用法
```
let object = {
    a: 1,
    b: 2,
}

// 仅在 po 对象里的行为才可以被重新制定
let po = new Proxy(object, {
    set(obj, prop, val) { // 钩子
      console.log(obj, prop, val)
    }
})
 ```

##### 二、模仿 reactive 实现原理
* reactivity : 半成品的双向绑定，负责从数据到 DOM 元素的事件监听。

##### 二、使用 Range 实现拖拽
```
<div id="dragable" style="width: 100px; height: 100px; background-color: pink;"></div>

<script>
  let dragable = document.getElementById('dragable');
  let baseX = 0, baseY = 0;

  dragable.addEventListener('mousedown', function(event) {
    let startX = event.clientX, startY = event.clientY;

    let up = event => {
      baseX = baseX + event.clientX - startX;
      baseY = baseY + event.clientY - startY;
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    };
    let move = event => {
      dragable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`;
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  })

</script>
```
