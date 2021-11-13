import { TwoSideOp } from "../calcBlock.js"
export default class Pow extends TwoSideOp {
  constructor({left,right,temp=false}={}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    if (temp) {
      super({ sign: "^", priority: 4, left: {}, right: {} ,temp})
      return
    }
    if (!left.single || !right.single) {
      throw new Error("Blocks on both sides of '^' must be singles")
    }
    try {
      while (left.type == "group") {
        left = left.subnode
      }
      while (right.type == "group") {
        right = right.subnode
      }
    } catch (e) {
      console.log({ left, right }, e)
    }
    super({ sign: "^", priority: 4, left, right })
    this.base=left
    this.exp=right
  }
  toLatex(){
    return this.leftLatex+"^{"+this.right.toLatex()+"}"
  }
}