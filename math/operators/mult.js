import { SwapOpBlock } from "../calcBlock.js"
export default class Mult extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "*", priority: 2, subnodes: [], temp })
      return
    }
    if (subnodes.length < 2) {
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
    this.subnodes = this.subnodes.filter(node => node.toString() != "1")
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
    let factorList = []
    const ONE = M.NumberBlock.one
    for (let idx_factor = 0; idx_factor < factors.length; idx_factor++) {
      let factor = factors[idx_factor]
      let nodesWhereFacEq = [factor]
      for (let idx_other = idx_factor + 1; idx_other < factors.length; idx_other++) {
        let other = factors[idx_other]
        let addOther = () => {
          nodesWhereFacEq.push(other)
          factors.splice(idx_other, 1)
          idx_other--
        }
        let isShared = false
        let _factor = factor
        let _other = other
        let factorPowStack = [factor]
        let otherPowStack = [other]
        do {
          if (_factor.isEqualTo(other)) {
            isShared = true
            factor = _factor
            break;
          }
          _factor = _factor.base
          factorPowStack.push(_factor)
        } while (_factor.isPow)
        if (isShared) {
          addOther()
          continue;
        }
        do {
          if (_other.isEqualTo(factor)) {
            isShared = true
            break;
          }
          _other = _other.base
          otherPowStack.push()
        } while (_other.isPow)
        if (isShared) {
          addOther()
          continue;
        }
        if (_factor.isEqualTo(_other)) {
          let pFactor, pOther
          while (_factor && _other) {
            pFactor = _factor
            pOther = _other
            if (!_factor.isEqualTo(_other)) {
              break;
            }
            _factor = factorPowStack.pop()
            _other = otherPowStack.pop()
          }
          factor = pFactor
          addOther()
        }
      }
      let exps=[]
      for(let node of nodesWhereFacEq){
        let exps_reversed=[]
        while(!node.isEqualTo(factor)){
          if(!node.isPow){
            throw new Error("Something went wrong, internal error")
          }
          exps_reversed.push(node.exp)
          node=node.base
        }
        let exp=exps_reversed.pop()
        for(let expPart of exps_reversed){
          exp=new M.operators.Pow({left:exp,right:expPart,checkSingles:false})
        }
        exps.push(exp)
      }
      console.log("exps:",exps)
      let exp = new M.operators.Plus({ subnodes: exps })
      exp = exp.check().reduceNumbers()
      let pow = new M.operators.Pow({ left: factor, right: exp, checkSingles: false }).check()
      factorList.push(pow)
    }
    let numFactor = this.getNumFactor()
    if (numFactor.toString() != "1") {
      factorList.unshift(numFactor)
    }
    if (factorList.length == 0) {
      return numFactor
    } else if (factorList.length == 1) {
      return factorList[0].check()
    } else {
      return new Mult({ subnodes: factorList }).check()
    }
  }
}
M.operators.Mult = Mult