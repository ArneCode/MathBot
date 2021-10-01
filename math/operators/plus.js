import {SwapOpBlock} from "../calcBlock.js"
export default class Plus extends SwapOpBlock{
  constructor(subnodes=[]){
    super({sign:"+",priority:0,subnodes})
  }
}