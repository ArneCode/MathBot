import {SwapOpBlock} from "../calcBlock.js"
export default class Mult extends SwapOpBlock{
  constructor(subnodes=[]){
    super({sign:"*",priority:2,subnodes})
  }
}