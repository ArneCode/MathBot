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
      this.left = options.left||options.subnodes[0]
      this.right = options.right||options.subnodes[1]
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
    let leftInfo=this.left.getExpInfo(targetVar)
    let rightInfo=this.right.getExpInfo(targetVar)
    console.log(leftInfo,rightInfo)
    return history
  }
  toString() {
    return this.left.toString()
      + "=" + this.right.toString()
  }
  toLatex() {
    return this.left.toLatex() + "=" + this.right.toLatex()
  }
}
Equation.prototype.isEquation = true
M.Equation = Equation