import { ValueBlock } from "../calcBlock.js"
export default class NumberBlock extends ValueBlock {
  constructor({ n }) {
    super()
    try {
      this.value = new Decimal(n)
    } catch (err) {
      console.log("error when creating decimal", n)
      throw err
    }
    this.type = "number"
  }
  get n() {
    return this.value
  }
  get isZero() {
    return this.value.eq(0)
  }
  get isOne() {
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
  getFactors({includeNums=false}={}) {
    if(includeNums){
      return this.value.toNumber().getFactors().reverse().map(val=>new NumberBlock({n:val}))
    }
    return []
  }
  getNumFactor() {
    return this
  }
  static mult(factors) {
    return new NumberBlock({ n: factors.reduce(
      (acc, factor) => factor.isMathBlock ? acc.mul(factor.value) : acc.mul(factor),
       new Decimal(1)
       ) })
  }
  mult(other) {
    try {
      return NumberBlock.mult([this, other])
    } catch (err) {
      console.log("error when multiplying", this, other)
      throw err
    }
  }
  static add(summands) {
    return new NumberBlock({ n: summands.reduce((acc, summand) => acc.add(summand.value), new Decimal(0)) })
  }
  add(other) {
    try {
      return NumberBlock.add([this, other])
    } catch (err) {
      console.log("error when adding", this, other)
      throw err
    }
  }
  subtract(other){
    new NumberBlock({n:this.value.sub(other.value)})
  }
  get isEven(){
    return this.value.isInt()
  }
  getExpInfo(){
    return {k:this,e:zero}
  }
  static min(...elts){
    let min
    let minN=Infinity
    for(let i=0;i<elts.length;i++){
      let elt=elts[i]
      let n=elt.value.toNumber()
      if(n<minN){
        minN=n
        min=elt
      }
    }
    return min
  }
}
const one = new NumberBlock({ n: 1 })
NumberBlock.one=one
const zero = new NumberBlock({ n: 0 })
NumberBlock.zero=zero
NumberBlock.prototype.isNumber=true
M.singles.NumberBlock = NumberBlock
M.NumberBlock = NumberBlock