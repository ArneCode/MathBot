import { TwoSideOp } from "../calcBlock.js"
export default class Div extends TwoSideOp {
  constructor(left={single:true}, right={single:true}) {
    if (!left.single && right.single) {
      throw new Error("Blocks on both sides of '/' must be singles")
    }
    super({ sign: "/", priority: 3, left, right })
  }
}