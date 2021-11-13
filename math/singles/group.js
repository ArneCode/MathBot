import { SingleBlock } from "../calcBlock.js"
export default class Group extends SingleBlock {
  constructor(subnode = null) {
    super()
    this.subnodes = [subnode]
    this.subnode = subnode
    this.type = "group"
  }
  toString(){
    return "("+this.subnode.toString()+")"
  }
}