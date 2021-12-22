import { SwapOpBlock } from "../calcBlock.js"
export default class Plus extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "+", priority: 0, subnodes: [], temp })
      return
    }
    try{
    super({ sign: "+", priority: 0, subnodes })
    }catch(err){
      console.log({subnodes})
      throw err
    }
    if (subnodes.length == 0) {
      console.log(new Error("subnodes length 0"), this)
    }
    this.isPlus = true
  }
  check() {
    let history = new M.CalcHistory({ action: "check" })
    history.add(this)
    let obj = history.add(super.check())
    let subnodes = obj.subnodes.filter(node => node.toString() != "0")
    if (subnodes.length == 1) {
      history.add(this.subnodes[0])
    }
    else if (subnodes.length == 0) {
      history.add(M.NumberBlock.zero)
    } else {
      history.add(new Plus({ subnodes }))
    }
    return history
  }
  reduceNumbers() {
    let history = new M.CalcHistory({ action: "plus", description: "adding summands together" })
    let obj = history.add(super.reduceNumbers())
    let nSubNodes = []
    let subnodes = [...obj.subnodes]
    for (let idx_node = 0; idx_node < subnodes.length; idx_node++) {
      let node = subnodes[idx_node]
      let nodeFactors = node.getFactors()
      let nodeNums = node.getNumFactor()
      let nums = [node.getNumFactor()]
      for (let idx_other = idx_node + 1; idx_other < subnodes.length; idx_other++) {
        let other = subnodes[idx_other]
        let otherFactors = other.getFactors()
        if (M.ArrsEqual([nodeFactors, otherFactors])) {
          nums.push(other.getNumFactor())
          subnodes.splice(idx_other, 1)
          idx_other--
        }
      }
      let num = M.NumberBlock.add(nums)
      if (nodeFactors.length == 0) {
        nSubNodes.push(num)
      } else if(num.toString()==1){
        nSubNodes.push(new M.operators.Mult({subnodes:nodeFactors,checkLength:false}))
      }else {
        nSubNodes.push(new M.operators.Mult({ subnodes: [num, ...nodeFactors] }))
      }
    }
    let sum
    if (subnodes.length > 1) {
      sum = new Plus({ subnodes: nSubNodes })
    } else {
      sum = nSubNodes[0]
    }
    history.add(sum.check())
    return history
  }
  toExpForm({targetVar=null}={}){
    let history=new M.CalcHistory({action:"toExpForm"})
    history.add(this.reduceNumbers())
    return history
  }
  getExpInfo(targetVar){
    let result=[]
    let es={}
    for(let i=0;i<this.subnodes.length;i++){
      let info=this.subnodes[i].getExpInfo(targetVar)
      if(isArray(info)||!info){
        return false
      }
      let {k,e}=info
      let eStr=e.toString()
      let pObj=es[eStr]
      if(pObj){
        pObj.k=new M.operators.Plus({subnodes:[pObj.k,k]})
        continue
      }
      es[eStr]=info
      result.push(info)
    }
    return result
  }
}
M.operators.Plus = Plus