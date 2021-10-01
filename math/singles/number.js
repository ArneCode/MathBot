import {MathBlock} from "../calcBlock.js"
export default class NumberBlock extends MathBlock{
  constructor(n){
    super()
    this.value=BigNumber(n)
    this.type="number"
  }
}