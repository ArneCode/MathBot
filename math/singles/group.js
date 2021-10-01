import { SingleBlock } from "../calcBlock.js"
export default class Group extends SingleBlock {
  constructor(subnodes=null) {
    super()
    this.subnodes = subnodes
    this.type = "group"
  }
}