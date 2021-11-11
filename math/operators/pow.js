import { TwoSideOp } from "../calcBlock.js"
export default class Pow extends TwoSideOp {
  constructor(left={single:true}, right={single:true}) {
    if (!left.single && right.single) {
      throw new Error("Blocks on both sides of '^' must be singles")
    }
    while(left.constructor.name="Group"){
      left=left.subnode
    }
    while(right.constructor.name="Group"){
      right=right.subnode
    }
    super({ sign: "^", priority: 4, left, right })
  }
}