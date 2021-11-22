import { TwoSideOp } from "../calcBlock.js"
export default class Root extends TwoSideOp {
  constructor({ left, right, temp = false } = {}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    if (temp) {
      super({ sign: "°§root§°", priority: 4, left: {}, right: {}, temp })
      return
    }
    if (!left.isSingle || !right.isSingle) {
      throw new Error("Blocks on both sides of '^' must be singles")
    }
    while (left.isGroup) {
      left = left.subnode
    }
    while (right.isGroup) {
      right = right.subnode
    }
    super({ sign: "°§root§°", priority: 4, left, right })
    this.radicand = right //the radicand is what is under the radic
    this.index = left //index is the n in n-th root
  }
  reduceGroups() {
    return this
    //only temporarily
  }
  toString() {
    if(this.index.toString()=="2"){
      return `\\sqrt{${this.radicand.toString()}}`
    }
    return `\\sqrt[${this.index.toString()}]{${this.radicand.toString()}}`
  }
  toLatex() {
    if(this.index.toString()=="2"){
      return `\\sqrt{${this.radicand.toLatex()}}`
    }
    return `\\sqrt[${this.index.toLatex()}]{${this.radicand.toLatex()}}`
  }
}
M.operators.Root = Root