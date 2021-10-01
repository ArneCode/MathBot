import {SwapOpBlock} from "../calcBlock.js"
export default class Mult extends SwapOpBlock{
  constructor(subnodes=[]){
    super({sign:"*",priority:1})
    this.subnodes=subnodes
  }
}