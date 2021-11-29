import { SwapOpBlock } from "../calcBlock.js"
export default class Plus extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "+", priority: 0, subnodes: [], temp })
      return
    }
    super({ sign: "+", priority: 0, subnodes })
  }
  check() {
    let subnodes = this.subnodes.filter(node => node.toString() != "0")
    if (subnodes.length == 1) {
      return this.subnodes[0]
    }
    if (subnodes.length == 0) {
      return M.NumberBlock.zero
    }
    return new Plus({subnodes})
  }
  reduceNumbers() {
    let obj=super.reduceNumbers()
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
          subnodes.splice(idx_other,1)
          idx_other--
        }
      }
      let num = M.NumberBlock.add(nums)
      if (nodeFactors.length == 0) {
        nSubNodes.push(num)
      } else {
        nSubNodes.push(new M.operators.Mult({ subnodes: [num, ...nodeFactors] }).check().reduceNumbers())
      }
    }
    if (subnodes.length > 1) {
      return new Plus({ subnodes: nSubNodes }).check()
    } else {
      return nSubNodes[0].check()
    }
  }
}
M.operators.Plus = Plus