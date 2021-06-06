

class Carousel {
  constructor() {
    this.root = document.createElement('div')
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

let d = [
  "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&hs=2&pn=1&spn=0&di=108790&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=4178505437%2C1450515343&os=3932658108%2C1372464802&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2Fwww.7v6.net%2Fuploads%2Fallimg%2F200417%2F141-20041F93144926.jpg%26refer%3Dhttp%3A%2F%2Fwww.7v6.net%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1625553600%26t%3Dc2ddb532a19e0758653dd70f8f7d2111&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3B0em_z%26e3BgjpAzdH3Ffi7p7AzdH3Fda999_z%26e3Bip4s&gsm=2&islist=&querylist=",
  "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&hs=2&pn=5&spn=0&di=149050&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=1407407789%2C1337754080&os=170667745%2C2268321010&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20200218%2F3cf857122d024ef5acef1076fd60ec74.jpeg%26refer%3Dhttp%3A%2F%2F5b0988e595225.cdn.sohucs.com%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1625553600%26t%3D7944d5a470b762ad504ffea351e668e8&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bf5i7_z%26e3Bv54AzdH3FwAzdH3Fn09a8la0l_8dan9a8b9&gsm=2&islist=&querylist=",
  "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&hs=2&pn=7&spn=0&di=132220&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=3821697285%2C1522267493&os=3270109382%2C4138496242&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2Fp0.itc.cn%2Fimages01%2F20200720%2F55ab0d30270043099516dd149de24119.jpeg%26refer%3Dhttp%3A%2F%2Fp0.itc.cn%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1625553600%26t%3D1d186d911cf109948531d6f9e7dec9a8&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bf5i7_z%26e3Bv54AzdH3FwAzdH3F9abm0d8mb_8da9dcb0m%3F_p6wgf_%3Daaaa89_k1ff_1h4ozwv3Pnr_z2C%24qCP%3D&gsm=2&islist=&querylist=",
  "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&hs=2&pn=9&spn=0&di=8580&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=200430787%2C1110976734&os=1869197787%2C3326998536&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E5%9B%BE%E7%89%872021%E6%96%B0%E5%9B%BE%E7%89%87&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2Fp7.itc.cn%2Fimages01%2F20200714%2F16e90690398049ee9b8d31fbf25b3d00.jpeg%26refer%3Dhttp%3A%2F%2Fp7.itc.cn%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1625553600%26t%3Dcd816087b9bc3c3db529964ee3dde27c&fromurl=ippr_z2C%24qAzdH3FAzdH3Fpn_z%26e3B4_z%26e3Bf5i7_z%26e3Bv54AzdH3FwAzdH3F9a0c009ab_8dam98blm%3Ffv4%3D8aad_z%26e3Bkaaak_z%26e3B8caa8un_z%26e3BARTICLE_REC%26fr4%3Df4or_z%26e3Bv5gpjgp_z%26e3Bu1-1_z%26e3B8m_z%26e3B8clcnl0n0d9mcipQjF3b&gsm=2&islist=&querylist=",
]

// document.body.appendChild(a);

a.mountTo(document.body);

