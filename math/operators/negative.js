import { OneSideLeftOp } from "../calcBlock.js"
export default class Negative extends OneSideLeftOp {
  constructor({subnodes = [], subnode = null, temp = false } = {}) {
    super({ priority: 1 })
    this.temp = temp
    this.isNegative = true
    if (temp) {
      return
    }
    if(subnodes.length>0){
      if(subnodes.length!=1){
        throw new Error("look here")
      }
      subnode=subnodes[0]
    }
    while (subnode.isGroup) {
      subnode = subnode.subnode
    }
    this.subnode = subnode
    this.type = "negator"
  }
  get subnodes(){
    return [this.subnode]
  }
  toString() {
    let { subnode } = this
    if (subnode.isOperator && subnode.priority <= this.priority) {
      return "-(" + subnode.toString() + ")"
    } else {
      return "-" + subnode.toString()
    }
  }
  toLatex() {
    let { subnode } = this
    if (subnode.isOperator && subnode.priority <= this.priority) {
      return "-\\left(" + subnode.toLatex() + "\\right)"
    } else {
      return "-" + subnode.toLatex()
    }
  }
  reduceGroups(){
    if(this.subnode.subnodes){
      this.subnode=this.subnode.reduceGroups()
    }
    return this
  }
}
M.operators.Negative=Negative