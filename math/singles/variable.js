import { ValueBlock } from "../calcBlock.js"
export default class Variable extends ValueBlock {
  constructor({ name }) {
    super()
    this.name = name
  }
  toString() {
    return this.name
  }
  toLatex() {
    return this.name
  }
  getExpInfo(targetVar) {
    if (targetVar == this.name) {
      let one = M.NumberBlock.one
      return { k: one, e: one }
    }
    return { k: this, e: M.NumberBlock.zero }
  }
  splitOut(shared) {
    for (let i = 0; i < shared.length; i++) {
      let factor = shared[i]
      if (factor.isVar) {
        if (factor.name == this.name) {
          return { split: M.NumberBlock.one, rest: [...shared.slice(0, i), ...shared.slice(i + 1)] }
        }
      } else if (factor.isPow) {
        let result = factor.splitOut([this])
        if (result.rest.length == 0) {
          return { split: M.NumberBlock.one, rest: [result.split] }
        }
      }
    }
    return { split: this, rest: shared }
  }
  includes(name){
    return this.name==name
  }
}
Variable.prototype.isVar = true
M.singles.Variable = Variable