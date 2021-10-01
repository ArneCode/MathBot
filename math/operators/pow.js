import { TwoSideOp } from "../calcBlock.js"
export default class Pow extends TwoSideOp {
  constructor(left={single:true}, right={single:true}) {
    if (!left.single && right.single) {
      throw new Error("Blocks on both sides of '/' must be singles")
    }
    super({ sign: "^", priority: 2, left, right })
  }
}