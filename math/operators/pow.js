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
    let pLeft=left
    let pRight=right
    try {
      while (left.isGroup) {
        left = left.subnode
      }
      while (right.isGroup) {
        right = right.subnode
      }
    } catch (e) {
      console.log({ left, right ,pLeft,pRight}, e)
      throw e
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
    return "(" + this.left.toString() + ")^(" + this.right.toString() + ")"
  }
  toLatex() {
    return this.leftLatex + "^{" + this.right.toLatex() + "}"
  }
  expToMult() {
    let { exp } = this
    let history = new M.CalcHistory({action:"expToMult"})
    exp = history.add(exp.reduceNumbers())
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
      history.add(new M.operators.Mult({ subnodes: factors }).check())
      return history
    }
    return this
  }
  reduceNonValExps() {
    if (this.exp.isValueBlock) {
      return this
    }
    let history = new M.CalcHistory()
    let exp = history.add(this.exp.reduceNumbers())
    exp = history.add(exp.check())
    if (exp.isValueBlock) {
      history.add(new Pow({ left: this.left, right: exp }))
      return history
    }
    if (exp.isPlus) {
      let nNodes = []
      for (let i = 0; i < exp.subnodes.length; i++) {
        nNodes.push(new Pow({ left: this.base, right: exp.subnodes[i] }))
      }
      let mult = new M.operators.Mult({ subnodes: nNodes })
      history.add(mult)
      history.add(mult.check())
      return history
    }
    console.log("reducing exp to singular value has failed")
    return false
  }
  check() {
    let history = new M.CalcHistory({action:"check"})
    let obj = history.add(super.check())
    if (obj.exp.isOne) {
      history.add(obj.base)
    } else if (obj.exp.isZero) {
      history.add(M.NumberBlock.one)
    }
    return history
  }
  expandBases() {
    if (this.isValueBlock) {
      return this
    }
    let history = new M.CalcHistory({action:"expandBases"})
    let obj = history.add(this.reduceNumbers())
    obj = history.add(obj.check())
    if (obj.base.isValueBlock) {
      history.add(new Pow({ left: obj.base, right: obj.exp }))
      return history
    }
    if (obj.base.isPlus) {
      obj = history.add(obj.expToMult())
      obj = history.add(obj.reduceGroups())
      obj = history.add(obj.reduceFactors())
      obj = history.add(obj.reduceNumbers())
      return history
    }
  }
  toExpForm({ targetVar }) {
    let history = new M.CalcHistory()
    let obj = history.add(this.reduceNumbers())
    //not jet implemented:
    //!!!!!!!!!!!!!!!!
    M.getSolutionPathGenerator({
      actions: [
        obj => obj.expandBases(),
        obj => obj.reduceNonValExps()
      ]
    })
    obj = obj.expandBases()
    obj = obj.reduceNonValExps()
    return obj
  }
}
M.operators.Pow = Pow