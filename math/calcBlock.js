export class MathBlock {
  constructor() {

  }
}
class OpBlock extends MathBlock {
  constructor({ priority } = {}) {
    super()
    this.priority = priority
    this.type = "operator"
    this.isOperator = true
  }
}
export class SingleBlock extends MathBlock {
  constructor() {
    super()
    this.isSingle = true
  }
}
export class SwapOpBlock extends OpBlock {
  static isSwappable = true
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
        while (subnode.isGroup) {
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
      else if (this.sign == "+" && subnode.isNegative) {
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
      if (subnode.isOperator && subnode.priority < this.priority) {
        subTexts.push("\\left(" + subnode.toLatex() + "\\right)")
      }
      else if (this.sign == "+" && subnode.isNegative) {
        subTexts[subTexts.length - 1] += subnode.toLatex()
      }
      else {
        subTexts.push(subnode.toLatex())
      }
    }
    return subTexts.join(this.laSign)
  }
  reduceGroups() {
    console.log("reducing groups")
    this.subnodes = this.subnodes.map(node => node.subnodes ? node.reduceGroups() : node)
    //tells subnodes to reduce Groups in their respective subnodes if they do have any
    let group
    let others = []
    for (let i = 0; i < this.subnodes.length; i++) {
      let node = this.subnodes[i]
      if (node.priority<this.priority) {
        group = node
        others = this.subnodes.slice(0, i).concat(this.subnodes.slice(i + 1))
        break;
      }
    }
    if (!group) {
      return this
    }
    if (group.isSingle || group.priority >= this.priority) {
      let nNode = new this.constructor({ subnodes: [group].concat(others) })
      return nNode.reduceGroups()
    } else {
      let nNodes=[]
      for(let node of group.subnodes){
        let nNode = new this.constructor({subnodes: [node].concat(others)})
        nNodes.push(nNode)
      }
      let nNode = new group.constructor({subnodes:nNodes})
      return nNode.reduceGroups()
    }
  }
}
export class FixOpBlock extends OpBlock {
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class TwoSideOp extends FixOpBlock {
  //values are on both sides of operator, but cannot be swapped. For Example: division, exponentiation
  static isTwoSided = true
  constructor({ sign, priority, left, right } = {}) {
    super({ priority })
    this.sign = sign
    this.left = left
    this.right = right
    this.subnodes = [left, right]
  }
  get leftLatex() {
    let node = this.left
    if (node.isSingle) {
      return node.toLatex()
    } else {
      return "\\left(" + node.toLatex() + "\\right)"
    }
  }
  get rightLatex() {
    let node = this.right
    if (node.isSingle) {
      return node.toLatex()
    } else {
      return "\\left(" + node.toLatex() + "\\right)"
    }
  }
  toString() {
    let { left, right } = this
    let leftText, rightText
    if (left.isSingle) {
      leftText = left.toString()
    } else {
      leftText = "(" + left.toString() + ")"
    }
    if (right.isSingle) {
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
export class TransformBlock extends SingleBlock {
  //transforms values inside e.g. Could be function/derivative/integral etc.
  constructor() {
    super()
    this.isTransformer = true
  }
}