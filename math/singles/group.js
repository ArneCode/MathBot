import { SingleBlock } from "../calcBlock.js"
export default class Group extends SingleBlock {
  constructor(subnode = null) {
    super()
    this.subnode = subnode
    this.type = "group"
    this.isGroup = true
  }
  get subnodes() {
    return [this.subnode]
  }
  toString() {
    return "(" + this.subnode.toString() + ")"
  }
  toLatex() {
    return "\\left(" + this.subnode.toString() + "\\right)"
  }
  reduceGroups() {
    if (this.subnode.subnodes) {
      this.subnode = this.subnode.reduceGroups()
    }
    if(this.subnode.isSingle){
      return this.subnode
    }
    return this
  }
}
M.singles.Group = Group