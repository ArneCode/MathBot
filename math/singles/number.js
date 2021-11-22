import { SingleBlock } from "../calcBlock.js"
export default class NumberBlock extends SingleBlock {
  constructor({ n }) {
    super()
    this.value = new Decimal(n)
    this.type = "number"
    this.isNumber = true
  }
  toNumber(){
    return this.value.toNumber()
  }
  toString() {
    return this.value.toString()
  }
  toLatex() {
    return this.toString()
  }
}
M.singles.NumberBlock = NumberBlock