import { OneSideLeftOp } from "../calcBlock.js"
export default class Negative extends OneSideLeftOp {
  constructor({ subnodes = [], subnode = null, temp = false } = {}) {
    super({ priority: 1 })
    this.temp = temp
    this.isNegative = true
    if (temp) {
      return
    }
    if (subnodes.length > 0) {
      if (subnodes.length != 1) {
        throw new Error("look here")
      }
      subnode = subnodes[0]
    }
    while (subnode.isGroup) {
      subnode = subnode.subnode
    }
    this.subnode = subnode
    this.type = "negator"
  }
  get subnodes() {
    return [this.subnode]
  }
  set subnodes(nodes) {
    this.subnode = nodes[0]
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
  reduceGroups() {
    return new Negative({ subnode: this.subnode.reduceGroups() })
  }
  getNumFactor() {
    return this.subnode.getNumFactor().mult("-1")
  }
  getFactors(params = {}) {
    let factors = this.subnode.getFactors(params)
    for (let i = 0; i < factors.length; i++) {
      if (factors[i].toString() == "-1") {
        factors.splice(i, 1)
        return factors
      }
    }
    return [...factors, negOne]
  }
  splitOut(factors) {
    for (let i = 0; i < factors.length; i++) {
      if (factors[i].toString() == "-1") {
        factors = [...factors.slice(0, i), ...factors.slice(i + 1)]
        break;
      }
    }
    let result = this.subnode.splitOut(factors)
    result = { split: new Negative({ subnode: result.split }), rest: result.rest }
    return result
  }
  getExpInfo(targetVar) {
    let info = this.subnode.getExpInfo(targetVar)
    if (!info || isArray(info)) {
      return false
    }
    let k = new Negative({ subnode: info.k }).reduceNumbers()
    return { k, e: info.exp }
  }
}
let negOne = new Negative({ subnode: M.NumberBlock.one })
Negative.negOne = negOne
M.operators.Negative = Negative