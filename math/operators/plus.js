import { SwapOpBlock } from "../calcBlock.js"
export default class Plus extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "+", priority: 0, subnodes: [], temp })
      return
    }
        if(subnodes.some(node=>node.isHistory)){
      throw new Error("Plus doesn't accept history as an Input")
    }
    try {
      super({ sign: "+", priority: 0, subnodes })
    } catch (err) {
      console.log({ subnodes })
      throw err
    }
    if (subnodes.length == 0) {
      console.log(new Error("subnodes length 0"), this)
    }
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
      } else if (num.toString() == 1) {
        nSubNodes.push(new M.operators.Mult({ subnodes: nodeFactors, checkLength: false }))
      } else {
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
  toExpForm({ targetVar = null } = {}) {
    let history = new M.CalcHistory({ action: "toExpForm" })
    history.add(this.reduceNumbers())
    return history
  }
  getExpInfo(targetVar) {
    let result = []
    let es = {}
    for (let i = 0; i < this.subnodes.length; i++) {
      let info = this.subnodes[i].getExpInfo(targetVar)
      if (isArray(info) || !info) {
        return false
      }
      let { k, e } = info
      let eStr = e.toString()
      let pObj = es[eStr]
      if (pObj) {
        pObj.k = new M.operators.Plus({ subnodes: [pObj.k, k] })
        continue
      }
      es[eStr] = info
      result.push(info)
    }
    return result
  }
  getFactors(params = {}) {
    let {split=false}=params
    if(!split){
      return [this]
    }
    let shared = this.subnodes[0].getFactors(params)
    for (let i = 1; i < this.subnodes.length; i++) {
      let node = this.subnodes[i]
      let nFacs = node.getFactors(params)
      let nShared = []
      for (let i = 0; i < nFacs.length; i++) {
        let fac = nFacs[i]
        if (fac.isPow) {
          nShared = [...nShared, ...fac.sharedFactors(shared)]
          continue;
        }
        for (let i = 0; i < shared.length; i++) {
          let elt = shared[i]
          if (elt.isPow) {
            nShared = [...nShared, ...elt.sharedFactors([fac])]
            continue;
          }
          if (elt.isEqualTo(fac)) {
            nShared.push(fac)
          }
        }
      }
      shared = nShared
    }
    return shared
  }
  sharedFactorsW(other, ignore = []) {
    let shared = []
    let subnodes = [...this.subnodes]
    while (subnodes.length > 0) {
      if (subnodes.length == 1) {
        subnodes.push()
      }
      let elt1 = subnodes.pop()
      let elt2 = subnodes.pop()
    }
  }
  splitOut(shared) {
    let subnodes = [...this.subnodes]
    let rest = []
    for (let i_shared = 0; i_shared < shared.length; i_shared++) {
      let factor = shared[i_shared]
      let nSubNodes = []
      let i_node
      for (i_node = 0; i_node < subnodes.length; i_node++) {
        let node = subnodes[i_node]
        let result = node.splitOut([factor])
        if (result.rest.length > 0) {
          rest.push(factor)
          break
        }
        nSubNodes[i_node] = result.split
      }
      if (!i_node < subnodes.length) { //loop has not been broken out of
        subnodes = nSubNodes
      }
    }
    let plus=new Plus({ subnodes })
    return { split: plus, rest }
  }
}
Plus.prototype.isPlus = true
M.operators.Plus = Plus