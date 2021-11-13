import { OneSideLeftOp } from "../calcBlock.js"
export default class Negative extends OneSideLeftOp {
  constructor({ subnode = null, temp = false } = {}) {
    super({ priority: 1 })
    if (temp) {
      return
    }
    this.negative = true
    while (subnode.type == "group") {
      subnode = subnode.subnode
    }
    this.subnode = subnode
    this.type = "negator"
    this.temp = temp
  }
  toString() {
    let { subnode } = this
    if (subnode.type == "operator" && subnode.priority <= this.priority) {
      return "-(" + subnode.toString() + ")"
    } else {
      return "-" + subnode.toString()
    }
  }
  toLatex() {
    let { subnode } = this
    if (subnode.type == "operator" && subnode.priority <= this.priority) {
      return "-\\left(" + subnode.toLatex() + "\\right)"
    } else {
      return "-" + subnode.toLatex()
    }
  }
}