export class MathBlock {
  constructor() {

  }
}
class OpBlock extends MathBlock {
  constructor({ priority } = {}) {
    super()
    this.priority = priority
    this.type = "operator"
  }
}
export class SingleBlock extends MathBlock {
  constructor() {
    super()
    this.single = true
  }
}
export class SwapOpBlock extends OpBlock {
  static swappable = true
  constructor({ sign, priority, subnodes, laSign } = {}) {
    super({ priority })
    this.sign = sign
    this.laSign = laSign || sign
    let oldSubnodes = subnodes
    let nSubnodes = []
    let redo = false
    do {
      redo = false
      for (let subnode of oldSubnodes) {
        while (subnode.type == "group") {
          subnode = subnode.subnode
        }
        if (subnode.sign == this.sign) {
          nSubnodes = nSubnodes.concat(subnode.subnodes)
          redo = true
        } else {
          nSubnodes.push(subnode)
        }
      }
      if (redo) {
        oldSubnodes = nSubnodes
        nSubnodes = []
      }
    } while (redo)
    this.subnodes = nSubnodes
  }
  toString() {
    let subTexts = []
    for (let subnode of this.subnodes) {
      if (subnode.type == "operator" && subnode.priority < this.priority) {
        subTexts.push("(" + subnode.toString() + ")")
      }
      else if (this.sign == "+" && subnode.negative) {
        subTexts[subTexts.length - 1] += subnode.toString()
      }
      else {
        subTexts.push(subnode.toString())
      }
    }
    return subTexts.join(this.sign)
  }
  toLatex() {
    let subTexts = []
    for (let subnode of this.subnodes) {
      if (subnode.type == "operator" && subnode.priority < this.priority) {
        subTexts.push("\\left(" + subnode.toLatex() + "\\right)")
      }
      else if (this.sign == "+" && subnode.negative) {
        subTexts[subTexts.length - 1] += subnode.toLatex()
      }
      else {
        subTexts.push(subnode.toLatex())
      }
    }
    return subTexts.join(this.laSign)
  }
}
export class FixOpBlock extends OpBlock {
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class TwoSideOp extends FixOpBlock {
  //values are on both sides of operator, but cannot be swapped. For Example: division, exponentiation
  static twoSided = true
  constructor({ sign, priority, left, right } = {}) {
    super({ priority })
    this.sign = sign
    this.left = left
    this.right = right
    this.subnodes = [left, right]
  }
  get leftLatex() {
    let node = this.left
    if (node.single) {
      return node.toLatex()
    } else {
      return "\\left(" + node.toLatex() + "\\right)"
    }
  }
  get rightLatex() {
    let node = this.right
    if (node.single) {
      return node.toLatex()
    } else {
      return "\\left(" + node.toLatex() + "\\right)"
    }
  }
  toString() {
    let { left, right } = this
    let leftText, rightText
    if (left.single) {
      leftText = left.toString()
    } else {
      leftText = "(" + left.toString() + ")"
    }
    if (right.single) {
      rightText = right.toString()
    } else {
      rightText = "(" + right.toString() + ")"
    }
    return leftText + this.sign + rightText
  }
}
export class OneSideOp extends FixOpBlock {
  static oneSided = true
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class OneSideLeftOp extends OneSideOp {
  //op is on the left side e.g. "-" (minus)
  static oneSidedLeft = true
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class OneSideRightOp extends OneSideOp {
  //op is on the right side e.g. "!" (factorial)
  static oneSidedRight = true
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class TransformBlock extends SingleBlock{
  //transforms values inside e.g. Could be function/derivative/integral etc.
  constructor(){
    super()
    this.transformer=true
  }
}