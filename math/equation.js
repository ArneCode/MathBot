import { MathBlock } from "./calcBlock.js"
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
  solveFor(targetVar) {
    let history = new M.CalcHistory({ action: "solving", description: `solving equation for ${targetVar}` })
    history.add(this)
    let eq = history.add(this.toForm({ form: "Exp", targetVar }))
    let lInfo = toArrayMaybe(eq.left.getExpInfo(targetVar))
    let rInfo = toArrayMaybe(eq.right.getExpInfo(targetVar))
    if (M.infoIsPolynomial(lInfo) && M.infoIsPolynomial(rInfo)) {
      let result = history.add(eq.solvePolynomial({ lInfo, rInfo, targetVar }))
    }
    console.log({ lInfo, rInfo })
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
    let degree=exps[exps.length-1]
    let minDeg=exps[0]
  }
  toString() {
    return this.left.toString()
      + "=" + this.right.toString()
  }
  toLatex() {
    return this.left.toLatex() + "=" + this.right.toLatex()
  }
}
const polynSolvers={
  "0,1,2":function(a,b,c){}
}
Equation.prototype.isEquation = true
M.Equation = Equation