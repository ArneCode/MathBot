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
  constructor({ sign, priority, subnodes } = {}) {
    super({ priority })
    this.sign = sign
    let oldSubnodes = subnodes
    let nSubnodes = []
    let redo = false
    do {
      redo=false
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
        if (redo) {
          oldSubnodes = nSubnodes
          nSubnodes = []
        }
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
      else if(this.sign=="+"&&subnode.negative){
        subTexts[subTexts.length-1]+=subnode.toString()
      }
      else {
        subTexts.push(subnode.toString())
      }
    }
    return subTexts.join(this.sign)
  }
}
export class FixOpBlock extends OpBlock {
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class TwoSideOp extends FixOpBlock {
  static twoSided = true
  constructor({ sign, priority, left, right } = {}) {
    super({ priority })
    this.sign = sign
    this.left = left
    this.right = right
    this.subnodes = [left, right]
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