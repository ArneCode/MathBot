import {OneSideLeftOp} from "../calcBlock.js"
export default class Negative extends OneSideLeftOp{
  constructor(subnode=null){
    super({priority:1})
  }
}