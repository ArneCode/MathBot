import { SingleBlock } from "../calcBlock.js"
export default class Variable extends SingleBlock {
  constructor({name}){
    super()
    this.name=name
  }
  toString(){
    return this.name
  }
  toLatex(){
    return this.name
  }
}