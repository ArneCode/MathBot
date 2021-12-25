import { MathBlock } from "./calcBlock.js"
import Plus from "./operators/plus.js"
export class Equation extends MathBlock {
  constructor(options, isLatex = false) {
    super()
    if (typeof (options) == "string") {
      let textSplit = options.split("=")
      if (isLatex) {
        this.left = M.parseLatex(textSplit[0])
        this.right = M.parseLatex(textSplit[1])
      } else {
        this.left = M.parse(textSplit[0])
        this.right = M.parse(textSplit[1])
      }
    } else {
      this.left = options.left || options.subnodes[0]
      this.right = options.right || options.subnodes[1]
    }
  }
  get subnodes() {
    return [this.left, this.right]
  }
  set subnodes(subs) {
    this.left = subs[0]
    this.right = subs[1]
  }
  removeSharedFactors(exclude = []) {
    let factors = this.getFactors({ includeNums: true })
    let nFactors = []
    let numFactor = M.NumberBlock.one
    for (let i = 0; i < factors.length; i++) {
      let factor = factors[i]
      if (factor.isNumber) {
        if (factor.value.gt(numFactor.value)) {
          numFactor = factor
        }
        continue;
      }
      let i_exc
      for (i_exc = 0; i_exc < exclude.length; i_exc++) {
        let name = exclude[i_exc]
        if (factor.includes(name)) {
          break;
        }
      }
      if (i_exc == exclude.length) {
        nFactors.push(factor)
      }
    }
    if (numFactor.toString() != "1") {
      nFactors.unshift(numFactor)
    }
    factors=nFactors
    let factorsMult = new M.operators.Mult({ subnodes: factors, checkLength: false })
    let history = new M.CalcHistory({ action: "removeSharedFactors" })
    let result = this.left.splitOut(factors)
    if (result.rest.length > 0) {
      console.log("1", result, factors, this.toString())
      //throw new Error("internal error")
    }
    let leftSplit = result.split
    let newLeft = new M.operators.Mult({ subnodes: [...factors, result.split], checkLength: false })
    result = this.right.splitOut(factors)
    if (result.rest.length > 0) {
      console.log(result)
     // throw new Error("internal error")
    }
    let rightSplit = result.split
    let newRight = new M.operators.Mult({ subnodes: [...factors, result.split], checkLength: false })
    let newEq = new Equation({ left: newLeft, right: newRight })
    history.add(new M.CalcHistory({ path: newEq, kommando: factorsMult, action: "-" }))
    newEq = new Equation({ left: leftSplit, right: rightSplit })
    history.add(newEq)
    return history
  }
  solveFor(targetVar) {
    let history = new M.CalcHistory({ action: "solving", description: `solving equation for ${targetVar}` })
    history.add(this)
    let eq = history.add(this.toForm({ form: "Exp", targetVar }))
    eq = history.add(eq.removeSharedFactors([targetVar]))
    /*let lInfo = toArrayMaybe(eq.left.getExpInfo(targetVar))
    let rInfo = toArrayMaybe(eq.right.getExpInfo(targetVar))
    if (M.infoIsPolynomial(lInfo) && M.infoIsPolynomial(rInfo)) {
      let result = history.add(eq.solvePolynomial({ lInfo, rInfo, targetVar }))
    }
    console.log({ lInfo, rInfo })*/
    return history
  }
  solvePolynomial({ lInfo = null, rInfo = null, targetVar }) {
    if (!lInfo) {
      lInfo = toArrayMaybe(this.left.getExpInfo(targetVar))
    }
    if (!rInfo) {
      rInfo = toArrayMaybe(this.right.getExpInfo(targetVar))
    }
    let info_added = [...lInfo, ...rInfo]
    let exps = []
    for (let i = 0; i < info_added.lenght; i++) {
      let exp = info_added[i].e
      exps.push(exp.value)
    }
    exps = exps.sort()
    let degree = exps[exps.length - 1]
    let minDeg = exps[0]
  }
  toString() {
    return this.left.toString()
      + "=" + this.right.toString()
  }
  toLatex() {
    return this.left.toLatex() + "=" + this.right.toLatex()
  }
}
const polynSolvers = {
  "0,1,2": function (a, b, c) { }
}
Equation.prototype.getFactors = Plus.prototype.getFactors
Equation.prototype.isEquation = true
M.Equation = Equation