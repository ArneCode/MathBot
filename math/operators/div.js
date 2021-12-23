import { TwoSideOp } from "../calcBlock.js"
export default class Div extends TwoSideOp {
  constructor({ left, right, subnodes = [], temp = false } = {}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    left = left || subnodes[0]
    right = right || subnodes[1]
    if (temp) {
      super({ sign: "/", priority: 3, left: {}, right: {}, temp })
      return
    }
    if (!left.isSingle || !right.isSingle) {
      throw new Error("Blocks on both sides of '/' must be singles")
    }
    while (left.isGroup) {
      left = left.subnode
    }
    while (right.isGroup) {
      right = right.subnode
    }
    super({ sign: "/", priority: 3, left, right })
  }
  toLatex() {
    return "\\frac{" + this.left.toLatex() + "}{" + this.right.toLatex() + "}"
  }
  reduceGroups() {
    return this
    //temporary
  }
  getExpInfo(targetVar) {
    let leftInfo = this.left.getExpInfo(targetVar)
    let rightInfo = this.right.getInfo(targetVar)
    if (isArray(leftInfo) || isArray(rightInfo) || !leftInfo || !rightInfo) {
      return false
    }
    let k = new Div({ left: leftInfo.k, right: rightInfo.k })
    let e
    if (leftInfo.e.isNumber && rightInfo.e.isNumber) {
      e = leftInfo.e.subtract(rightInfo.e)
    } else {
      e = new M.operators.Plus({
        subnodes: [
          leftInfo.e,
          new M.operators.Negative(rightInfo.e)
        ]
      })
    }
    return { k, e }
  }
  findPossFacs() {
    let leftFacs = this.left.findPossFacs()
    let rightFacs = this.right.findPossFacs()
    let facs = leftFacs.fact.concat(rightFacs.inver)
    let inver = leftFacs.inver.concat(rightFacs.facs)
    return { facs, inver }
  }
}
M.operators.Div = Div