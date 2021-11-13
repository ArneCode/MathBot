import { TwoSideOp } from "../calcBlock.js"
export default class Div extends TwoSideOp {
  constructor({left,right,temp=false}={}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    if (temp) {
      super({ sign: "/", priority: 3, left: {}, right: {} ,temp})
      return
    }
    console.log("not temp",left,right)
    if (!left.single || !right.single) {
      throw new Error("Blocks on both sides of '/' must be singles")
    }
    while(left.type=="group"){
      left=left.subnode
    }
    while(right.type=="group"){
      right=right.subnode
    }
    super({ sign: "/", priority: 3, left, right })
  }
}