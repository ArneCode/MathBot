import { TwoSideOp } from "../calcBlock.js"
export default class Pow extends TwoSideOp {
  constructor({ left, right, subnodes = [], temp = false, checkSingles = true } = {}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    left = left || subnodes[0]
    right = right || subnodes[1]
    if (temp) {
      super({ sign: "^", priority: 4, left: {}, right: {}, temp })
      return
    }
    /*if ((!left.isSingle || !right.isSingle) && checkSingles) {
      console.log({left,right})
      throw new Error("Blocks on both sides of '^' must be singles")
    }*/
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
    this.isPow = true
  }
  get base() {
    return this.left
  }
  get exp() {
    return this.right
  }
  toString() {
    return "("+this.left.toString() + ")^(" + this.right.toString() + ")"
  }
  toLatex() {
    return this.leftLatex + "^{" + this.right.toLatex() + "}"
  }
  expToMult() {
    let { exp } = this
    exp = exp.reduceNumbers()
    if (exp.isNumber) {
      let factors = []
      let n
      for (n = exp.toNumber(); n >= 1; n--) {
        factors.push(this.base)
      }
      if (n > 0) {
        let rationalExp = new M.singles.NumberBlock({ n })
        factors.push(new Pow({ left: this.base, right: rationalExp, checkSingles: false }))
      }
      return new M.operators.Mult({ subnodes: factors })
    }
    return this
  }
  reduceNonValExps() {
    if (this.exp.isValueBlock) {
      return this
    }
    let exp = this.exp.reduceNumbers().check()
    if (exp.isValueBlock) {
      return new Pow({ left: this.left, right: exp })
    }
    if (exp.isPlus) {
      let nNodes = this.exp.subnodes.map(node => new Pow({ left: this.base, right: node }))
      let mult = new M.operators.Mult({ subnodes: nNodes })
      return mult.check()
    }
    console.log("reducing exp to singular value has failed")
    return false
  }
  check() {
    let obj = super.check()
    if (obj.exp.isOne) {
      return obj.base
    } else if (obj.exp.isZero) {
      return M.NumberBlock.one
    }
    return obj
  }
  expandBases() {
    if (this.isValueBlock) {
      return this
    }
    let obj = this.reduceNumbers().check()
    if (obj.base.isValueBlock) {
      return new Pow({ left: obj.base, right: obj.exp })
    }
    if (obj.base.isPlus) {
      obj = obj.expToMult()
      obj = obj.reduceGroups()
      obj = obj.reduceFactors()
      obj = obj.reduceNumbers()
      return obj
    }
  }
  toExpForm({ targetVar }) {
    let obj = this.reduceNumbers()
    M.getSolutionPathGenerator({actions:[
      obj=>obj.expandBases(),
      obj=>obj.reduceNonValExps()
    ]})
    obj=obj.expandBases()
    obj=obj.reduceNonValExps()
    return obj
  }
}
M.operators.Pow = Pow