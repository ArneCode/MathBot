import {SingleBlock} from "../calcBlock.js"
export default class NumberBlock extends SingleBlock{
  constructor({n}){
    super()
    this.value=BigNumber(n)
    this.type="number"
  }
  toString(){
    return this.value.toString()
  }
  toLatex(){
    return this.toString()
  }
}