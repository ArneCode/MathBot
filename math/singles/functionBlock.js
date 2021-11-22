import { TransformBlock } from "../calcBlock.js"
export default class FunctionBlock extends TransformBlock {
  constructor({subnodes,name}) {
    super()
    this.subnodes=subnodes
    this.name=name
  }
  toString(){
    return this.name+"("+this.subnodes.map(node=>node.toString()).join(",")+")"
  }
  toLatex(){
    return this.name+"("+this.subnodes.map(node=>node.toLatex()).join(",")+")"
  }
}
M.singles.FunctionBlock=FunctionBlock