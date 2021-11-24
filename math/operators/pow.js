import { TwoSideOp } from "../calcBlock.js"
export default class Pow extends TwoSideOp {
  constructor({ left, right, temp = false, checkSingles = true } = {}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    if (temp) {
      super({ sign: "^", priority: 4, left: {}, right: {}, temp })
      return
    }
    if ((!left.isSingle || !right.isSingle) && checkSingles) {
      throw new Error("Blocks on both sides of '^' must be singles")
    }
    try {
      while (left.isGroup) {
        left = left.subnode
      }
      while (right.isGroup) {
        right = right.subnode
      }
    } catch (e) {
      console.log({ left, right }, e)
    }
    super({ sign: "^", priority: 4, left, right })
  }
  get base(){
    return this.left
  }
  get exp(){
    return this.right
  }
  toString() {
    return this.leftLatex + "^{" + this.right.toString() + "}"
  }
  toLatex() {
    return this.leftLatex + "^{" + this.right.toLatex() + "}"
  }
  toSingularExp() {
    let { exp } = this
    if (exp.isNumber) {
      let factors = []
      let n
      for (n = exp.toNumber(); n >= 1; n--) {
        factors.push(this.base)
      }
      if (n > 0) {
        console.log("n:", n)
        let rationalExp = new M.singles.NumberBlock({ n })
        factors.push(new Pow({ left: this.base, right: rationalExp, checkSingles: false }))
      }
      return new M.operators.Mult({ subnodes: factors })
    }
  }
  check(){
    super.check()
    if(this.exp.toString()=="1"){
      return this.base
    }else if(this.exp.toString()=="0"){
      return M.NumberBlock.one
    }
    return this
  }
}
M.operators.Pow = Pow