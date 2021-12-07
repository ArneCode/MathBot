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
    for (let i = 0; i < this.subnodes.length; i++) {
      let node = this.subnodes[i]
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
    return new M.CalcHistory({
      path: new Mult({ subnodes }),
      description: "removing ones from multiplication chain",
      action:"check"
    })
  }
  reduceNumbers() {
    let history = new M.CalcHistory({
      description: "multiplying numbers",
      action: "mult"
    })
    let obj = history.add(super.reduceNumbers())
    let num = obj.getNumFactor()
    let factors = obj.getFactors()
    history.add(new Mult({
      subnodes: [num, ...factors],
      checkLength: false
    }).check())
    return history
  }
  reduceFactors() {
    let history = new M.CalcHistory({action:"mult"})
    let obj = history.add(super.reduceNumbers())
    let factors = obj.getFactors()
    let factorList = []
    let toSkip = []
    let simultHistory = new M.SimultHistory()
    history.add(simultHistory)
    for (let idx_factor = 0; idx_factor < factors.length; idx_factor++) {
      if (toSkip.includes(idx_factor)) {
        continue
      }
      let factor = factors[idx_factor]
      let exps = [factor.exp]
      for (let idx_other = idx_factor + 1; idx_other < factors.length; idx_other++) {
        if (toSkip.includes(idx_other)) {
          continue
        }
        let other = factors[idx_other]
        //console.log(other.toString(),exps)
        let isShared = false
        if (factor.base.isEqualTo(other)) {
          exps.push(other.exp)
          toSkip.push(idx_other)
        } else if (other.base.isEqualTo(factor)) {
          exps.push(other.exp)
          factor = other.base
          toSkip.push(idx_other)
        } else if (factor.base.isEqualTo(other.base)) {
          exps.push(other.exp)
          toSkip.push(idx_other)
        }
      }
      let exp = new M.operators.Plus({ subnodes: exps })
      let expHistory = new M.CalcHistory({
        path: [exp],
        description: "adding the exponents of factors with the same base",
        action:"-"
      })
      exp = expHistory.add(exp.reduceNumbers())
      exp = expHistory.add(exp.check())
      let powHistory = new M.CalcHistory({ path: expHistory , action:"-"})
      let pow = powHistory.add(new M.operators.Pow({ left: factor.base, right: exp, checkSingles: false }))
      pow = powHistory.add(pow.check())
      expHistory.set({ parent: pow, subPos: 1 })
      simultHistory.add(powHistory)
      factorList.push(pow)
    }
    let numFactor = obj.getNumFactor()
    if (numFactor.toString() != "1") {
      factorList.unshift(numFactor)
      simultHistory.paths.unshift(numFactor)
    }
    let product
    if (factorList.length == 0) {
      product = new M.NumberBlock({ n: 1 })
    } else if (factorList.length == 1) {
      product = factorList[0]
    } else {
      product = new Mult({ subnodes: factorList })
    }
    simultHistory.result = product
    history.add(product)
    return history
  }
  toExpForm({ targetVar }) {
    let obj = this.reduceNumbers()
    obj = obj.reduceNumbers()
    obj = obj.reduceGroups()
    obj = obj.reduceFactors()
    obj = obj.reduceNonValExps()
    obj = obj.reduceNumbers()
    return obj
  }
}
M.operators.Mult = Mult