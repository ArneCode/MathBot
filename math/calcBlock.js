export class MathBlock{
  constructor(){
    
  }
}
class OpBlock extends MathBlock{
  constructor({priority}={}){
    super()
    this.subnodes=[]
    this.priority=priority
    this.type="operator"
  }
}
export class SwapOpBlock extends OpBlock{
  static swappable=true
  constructor({sign,priority}={}){
    super({priority})
    this.sign=sign
  }
}
export class FixOpBlock extends OpBlock{
  constructor({priority}={}){
    super({priority})
  }
}