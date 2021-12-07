M.actions={
  mult:{
    importance:1
  },
  add:{
    importance:1
  },
  div:{
    importance:2
  },
  pow:{
    importance:3
  }
}
class CalcHistory {
  constructor({ path = [], parent = null, subPos = null, description = "", action = null } = {}) {
    if (path.constructor.name == "Array") {
      this.path = path
    } else {
      this.path = [path]
    }
    this.parent = parent
    this.subPos = subPos
    this.description = description
    if(!action){
      throw "action required"
    }
    this.action = action
  }
  add(elt) {
    this.path.push(elt)
    return this.result
  }
  set(options) {
    for (let key in options) {
      if (key in this) {
        this[key] = options[key]
      }
    }
  }
  get result() {
    let lastElt = this.path[this.path.length - 1]
    if (lastElt.isHistory) {
      return lastElt.result
    }
    if (!lastElt.isMathBlock) {
      throw "should be Mathblock"
    }
    return lastElt
  }
  //---
  //continue working here!
  //---
  unwrap() {
    let path = []
    for (let i = 0; i < this.path.length; i++) {
      let pathElt = this.path[i]
      if (pathElt.isHistory) {
        console.log("pathElt:", pathElt)
        path.push(...pathElt.unwrap())
      } else {
        path.push(pathElt)
      }
    }
    console.log("path:",...path)
    if (this.parent != null && this.subPos != null) {
      let pos = this.subPos
      let nodesBefore = this.parent.subnodes.slice(0, pos)
      let nodesAfter = this.parent.subnodes.slice(pos + 1)
      for (let i = 0; i < path.length; i++) {
        let node = path[i]
        alert(node.toString())
        let parent = Object.assign({}, this.parent)
        parent.subnodes = [...nodesBefore, node, ...nodesAfter]
        path[i]=parent
      }
    }
    return path
  }
}
CalcHistory.prototype.isHistory = true
M.CalcHistory = CalcHistory
M.makePathElt = function (options) { //has become unused, keeping it if I ever need it
  let obj
  if (options.simult) {
    obj = new SimultaniousPathElt(options)
  } else {
    obj = new PathElt(options)
  }
  return new Proxy(obj, {
    get: (a, key) => {
      if (key in obj && key != "toString") {
        return obj[key]
      }
      return obj.result[key]
    }
  })
}
class SimultHistory {
  constructor({ paths = [], result = null, description = "", action } = {}) {
    this.paths = paths
    this.result = result
    this.description = description
    if(!action){
      throw "action required"
    }
    this.action = action
  }
  add(elt) {
    this.paths.push(elt)
    return elt.result
  }
  set(options) {
    for (let key in options) {
      if (key in this) {
        this[key] = options[key]
      }
    }
  }
  unwrap() {
    if (this.result == null) {
      throw new Error("result needs to be given to be able to unwar SimultHistory Object")
    }
    let maxStep=Math.max(...this.paths.map(path=>path.length))
    for(let step=0;step<maxStep;step++){
      let actionsDone={}
      for(let i=0;i<this.paths.length;i++){
        
      }
    }
    return []
  }
}
SimultHistory.prototype.isHistory = true
M.SimultHistory = SimultHistory
M.getSolutionPathGenerator = function* ({ obj, actions }) {
  let objString = obj.toString()
  let prevTexts = []
  do {
    prevTexts.push(objString)
    for (let action of actions) {
      let result = action(obj)
      if (isGenerator(result.constructor)) {

      }
    }
    objString = obj.toString()
  }
  while (!prevTexts.includes(objString))
}
M.unwrapSolutionPath = function (path) {
}