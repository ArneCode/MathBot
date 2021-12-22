import { SingleBlock } from "../calcBlock.js"
export default class Group extends SingleBlock {
  constructor({subnode = null,subnodes=[]}={}) {
    super()
    this.subnode = subnode||subnodes[0]
    this.type = "group"
    this.isGroup = true
  }
  get subnodes() {
    return [this.subnode]
  }
  set subnodes(nodes) {
    this.subnode = nodes[0]
  }
  toString() {
    return "(" + this.subnode.toString() + ")"
  }
  toLatex() {
    return "\\left(" + this.subnode.toString() + "\\right)"
  }
  reduceGroups() {
    if (this.subnode.isSingle) {
      return this.subnode
    }
    return new Group({subnode:this.subnode.reduceGroups()})
  }
  getExpInfo(targetVar){
    return this.subnode.getExpInfo(targetVar)
  }
}
M.singles.Group = Group