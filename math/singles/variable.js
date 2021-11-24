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
}
M.singles.Variable = Variable