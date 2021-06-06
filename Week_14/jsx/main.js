import { Component, createElement } from '/framework.js'

class Carousel extends Component{
  constructor() {
    super();
    this.attribute = Object.create(null)
  }
  setAttribute(name, value) {
    this.attribute[name] = value;
  }
  render() {
    // console.log(this.attribute.src)
    this.root = document.createElement('div');
    this.root.classList.add("carousel")
    for (let record of this.attribute.src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    let position = 0;

    this.root.addEventListener("mousedown", event => {
      let children = this.root.children;
      let startX = event.clientX;

      let move = event => {
        let x = event.clientX - startX;

        let current = position - ((x - x % 500) / 500);

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length; // 负数取余
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
        }
      }

      let up = event => {
        let x = event.clientX - startX;
        position = position - Math.round(x / 500); // 拖够一半则移动，不够则为 0
        
        // ???
        for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length; // 负数取余
          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
        }

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);

    })

    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length; // 取余

    //   let current = children[currentIndex]; // 当前图片
    //   let next = children[nextIndex]; // 下一张图片

    //   next.style.transition = 'none'; // 下一张移动时不需要动画
    //   // next 位置：当前位置（next 原本就有的偏移，需要减去，也就是100 -） + 100%，
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`

    //   setTimeout(() => {
    //     next.style.transition = '';
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${0 - nextIndex * 100}%)`;
      
    //     currentIndex = nextIndex;
    //   }, 16)
    // }, 2000)
    return this.root
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}

let d = [
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.7v6.net%2Fuploads%2Fallimg%2F200417%2F141-20041F93144926.jpg&refer=http%3A%2F%2Fwww.7v6.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625568836&t=1dfcf607b00caecf5598cbb2bf747875",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20200218%2F3cf857122d024ef5acef1076fd60ec74.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625568889&t=6f2ddd8f886e0330c46a49ac8c9fb5ce",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp8.itc.cn%2Fimages01%2F20200611%2F21955adff5d4435f9ab4c3d8344d0ae8.jpeg&refer=http%3A%2F%2Fp8.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625568889&t=6ebc5a2384ed907d2b3fa677332b9bf3",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20200131%2F978d71c373af413e9b33709cc9a26335.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625568889&t=1c416ef8fd7287cbed28e3544efcab49",
]

// document.body.appendChild(a);
let a = <Carousel src={d}/>
a.mountTo(document.body);

