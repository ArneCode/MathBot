import { TwoSideOp } from "../calcBlock.js"
export default class Root extends TwoSideOp {
  constructor({ left, right, temp = false } = {}) {
    //if temp is true, then the Object is just a placeholder and doesnt hold any subnodes yet
    if (temp) {
      super({ sign: "°§root§°", priority: 4, left: {}, right: {}, temp })
      return
    }
    if (!left.isSingle || !right.isSingle) {
      throw new Error("Blocks on both sides of '^' must be singles")
    }
    while (left.isGroup) {
      left = left.subnode
    }
    while (right.isGroup) {
      right = right.subnode
    }
    super({ sign: "°§root§°", priority: 4, left, right })
  }
  get radicand(){ //the radicand is what is under the radic
    return this.right
  }
  get index(){ //index is the n in n-th root
    return this.left
  }
  get exp(){
    if(this.index.isNumber){
      return new M.NumberBlock({n:new Decimal(1).div(this.index.value)})
    }else{
      let dividend=new M.NumberBlock({n:1})
      let divBlock=new M.operators.Div({left:dividend,right:this.index})
      return divBlock
    }
  }
  get base(){
    return this.radicand
  }
  reduceGroups() {
    return this
    //only temporarily
  }
  toString() {
    if(this.index.toString()=="2"){
      return `\\sqrt{${this.radicand.toString()}}`
    }
    return `\\sqrt[${this.index.toString()}]{${this.radicand.toString()}}`
  }
  toLatex() {
    if(this.index.toString()=="2"){
      return `\\sqrt{${this.radicand.toLatex()}}`
    }
    return `\\sqrt[${this.index.toLatex()}]{${this.radicand.toLatex()}}`
  }
}
M.operators.Root = Root