export class MathBlock {
  constructor() {

  }
}
class OpBlock extends MathBlock {
  constructor({ priority } = {}) {
    super()
    this.subnodes = []
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
  constructor({ sign, priority, subnodes} = {}) {
    super({ priority })
    this.sign = sign
    this.subnodes = subnodes
  }
}
export class FixOpBlock extends OpBlock {
  constructor({ priority } = {}) {
    super({ priority })
  }
}
export class TwoSideOp extends FixOpBlock {
  static twoSided=true
  constructor({ sign, priority, left, right } = {}) {
    super({ priority })
    this.sign = sign
    this.left = left
    this.right = right
    this.subnodes = [left, right]
  }
}