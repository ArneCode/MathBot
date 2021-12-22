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
}
M.singles.Variable = Variable