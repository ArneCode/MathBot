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
    let rightInfo = this.right.getExpInfo(targetVar)
    if (leftInfo.isNumber && rightInfo.isNumber) {
      return leftInfo.subtract(rightInfo)
    }
    let infos=[]
    if(isArray(leftInfo)){
      infos=leftInfo
    }
    if(isArray(rightInfo)){
      
    }
  }
}
M.operators.Div = Div