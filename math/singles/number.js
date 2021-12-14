import { ValueBlock } from "../calcBlock.js"
export default class NumberBlock extends ValueBlock {
  constructor({ n }) {
    super()
    this.value = new Decimal(n)
    this.type = "number"
    this.isNumber = true
  }
  get n(){
    return this.value
  }
  get isZero(){
    return this.value.eq(0)
  }
  get isOne(){
    return this.value.eq(1)
  }
  toNumber() {
    return this.value.toNumber()
  }
  toString() {
    return this.value.toString()
  }
  toLatex() {
    return this.toString()
  }
  getFactors(){
    return []
  }
  getNumFactor(){
    return this
  }
  static mult(factors) {
    return new NumberBlock({n:factors.reduce((acc, factor) => acc.mul(factor.value), new Decimal(1))})
  }
  mult(other){
    return NumberBlock.mult([this,other])
  }
  static add(summands){
    return new NumberBlock({n:summands.reduce((acc, summand) => acc.add(summand.value), new Decimal(0))})
  }
  add(other){
    return NumberBlock.add([this,other])
  }
  static get one() {
    return one
  }
  static get zero() {
    return zero
  }
}
const one = new NumberBlock({ n: 1 })
const zero = new NumberBlock({ n: 0 })
M.singles.NumberBlock = NumberBlock
M.NumberBlock = NumberBlock