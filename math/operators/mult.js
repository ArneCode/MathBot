import { SwapOpBlock } from "../calcBlock.js"
export default class Mult extends SwapOpBlock {
  constructor({ subnodes = [], temp = false, checkLength = true } = {}) {
    if (temp) {
      super({ sign: "*", priority: 2, subnodes: [], temp })
      return
    }
    if (subnodes.length < 2 && checkLength) {
      console.log(subnodes)
      throw new SyntaxError("there need to be at least two elements in a multiplication chain")
    }
    super({ sign: "*", priority: 2, subnodes, laSign: "\\cdot " })
  }
  getFactors() {
    return this.subnodes.reduce((factors, node) => {
      return factors.concat(node.getFactors())
    }, [])
  }
  getNumFactor() {
    let numFactor = M.NumberBlock.one
    for (let node of this.subnodes) {
      if (node.isNumber) {
        numFactor = numFactor.mult(node)
      }
    }
    return numFactor
  }
  check() {
    let subnodes = this.subnodes.filter(node => !node.isOne)
    if (subnodes.length == 1) {
      return subnodes[0]
    }
    if (subnodes.length == 0) {
      return new M.NumberBlock.one
    }
    if (subnodes.some(node => node.isZero)) {
      return new M.NumberBlock.zero
    }
    return new Mult({ subnodes })
  }
  reduceNumbers() {
    let obj = super.reduceNumbers()
    let num = obj.getNumFactor()
    let factors = obj.getFactors()
    return new Mult({ subnodes: [num, ...factors], checkLength: false }).check()
  }
  reduceFactors() {
    let obj = super.reduceNumbers()
    let factors = obj.getFactors()
    //console.log("factors:",factors.map(fac=>fac.toString()))
    let factorList = []
    for (let idx_factor = 0; idx_factor < factors.length; idx_factor++) {
      let factor = factors[idx_factor]
      let exps = [factor.exp]
      for (let idx_other = idx_factor + 1; idx_other < factors.length; idx_other++) {
        let other = factors[idx_other]
        //console.log(other.toString(),exps)
        let isShared = false
        let remove_other = () => {
          factors.splice(idx_other, 1)
          idx_other--
        }
        if (factor.base.isEqualTo(other)) {
          exps.push(other.exp)
          remove_other()
        } else if (other.base.isEqualTo(factor)) {
          exps.push(other.exp)
          factor = other.base
          remove_other()
        } else if (factor.base.isEqualTo(other.base)) {
          exps.push(other.exp)
          remove_other()
        }
      }
      let exp = new M.operators.Plus({ subnodes: exps })
      exp = exp.reduceNumbers().check()
      let pow = new M.operators.Pow({ left: factor.base, right: exp, checkSingles: false }).check()
      factorList.push(pow)
    }
    let numFactor = obj.getNumFactor()//M.NumberBlock.mult(shared_Nums)
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
  toPolynomialForm({ targetVar }) {
    let obj = this.reduceNumbers()
  }
}
M.operators.Mult = Mult