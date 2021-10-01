import { MathBlock } from "../calcBlock.js"
export default class Group extends MathBlock {
  constructor(subnodes=null) {
    super()
    this.subnodes = subnodes
    this.type = "group"
  }
}