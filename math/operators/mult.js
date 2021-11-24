import { SwapOpBlock } from "../calcBlock.js"
export default class Mult extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "*", priority: 2, subnodes: [], temp })
      return
    }
    if (subnodes.length < 2) {
      throw new SyntaxError("there need to be at least two elements in a multiplication chain")
    }
    super({ sign: "*", priority: 2, subnodes, laSign: "\\cdot " })
  }
  getFactors() {
    return this.subnodes.reduce((factors, node) => {
      return factors.concat(node.getFactors())
    }, [])
  }
  getNumFactor(){
    let numFactor=M.NumberBlock.one
    for(let node of this.subnodes){
      if(node.isNumber){
        numFactor=numFactor.mult(node)
      }
    }
    return numFactor
  }
  check() {
    if (this.subnodes.length == 1) {
      return this.subnodes[0]
    }
    if (this.subnodes.length == 0) {
      return new M.NumberBlock("1")
    }
    return this
  }
  reduceNumbers() {
    let factors = this.getFactors()
    let factorList=[]
    let shared_Nums = []
    const ONE=M.NumberBlock.one
    for (let idx_factor = 0; idx_factor < factors.length; idx_factor++) {
      let factor = factors[idx_factor]
      if (factor.isNumber) {
        shared_Nums.push(factor)
        factors.splice(idx_factor, 1)
        idx_factor--
        continue;
      }
      let exps = [factor.exp]
      for (let idx_other = idx_factor + 1; idx_other < factors.length; idx_other++) {
        let other = factors[idx_other]
        let isShared = false
        let remove_other = () => {
          factors.splice(idx_other, 1)
          idx_other--
        }
        if (factor.base.isEqualTo(other)) {
          exps.push(other.exp)
          factor = factor.base
          remove_other()
        } else if (other.base.isEqualTo(factor)) {
          exps.push(other.exp)
          factor = other.base
          remove_other()
        } else if (factor.base.isEqualTo(other.base)) {
          exps.push(other.exp)
          factor = factor.base
          remove_other()
        }
      }
      let exp = new M.operators.Plus({ subnodes: exps })
      exp = exp.check()
      let pow = new M.operators.Pow({ left: factor, right: exp ,checkSingles:false}).check()
      factorList.push(pow)
    }
    let numFactor = M.NumberBlock.mult(shared_Nums)
    if (numFactor.toString() != "1") {
      factorList.unshift(numFactor)
    }
    let product
    if (factorList.length == 0) {
      return new M.NumberBlock({ n: 1 })
    } else if (factorList.length == 1) {
      return factorList[0]
    } else {
      return new Mult({ subnodes: factorList })
    }
  }
}
M.operators.Mult = Mult