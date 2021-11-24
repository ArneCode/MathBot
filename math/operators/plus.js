import { SwapOpBlock } from "../calcBlock.js"
export default class Plus extends SwapOpBlock {
  constructor({ subnodes = [], temp = false } = {}) {
    if (temp) {
      super({ sign: "+", priority: 0, subnodes: [], temp })
      return
    }
    super({ sign: "+", priority: 0, subnodes })
  }
  reduceNumbers() {
    return this
    throw "continue here, doesnt work"
    super.reduceNumbers()
    let newSubNodes = this.subnodes.eachWeach((a, b) => {
      let facA = a.getFactors()
      let facB = b.getFactors()
      //let sharedFactors = M.findSharedInArrs([facA, facB], { extractNums: true })
      if (M.ArrsEqual([facA,facB])) {
        console.log("test")
        let numA = a.getNumFactor()
        let numB = b.getNumFactor()
        let num = numA.add(numB)
        console.log(num.toString())
        if(facA.length==0){
          return num
        }else{
          return new M.operators.Mult({subnodes:[num,...facA]}).check()
        }
      }
      return a
    })
    return this
  }
}
M.operators.Plus = Plus