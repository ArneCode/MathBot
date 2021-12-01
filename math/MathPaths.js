class CalcHistory {
  constructor({ path = [], parentObj = null, parentSubPos = null, description = "", action = "" } = {}) {
    if (path.constructor.name == "Array") {
      this.path = path
    } else {
      this.path = [path]
    }
    this.parentObj = parentObj
    this.parentSubPos = parentSubPos
    this.description = description
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
        path.push(...pathElt.unwrap())
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
  constructor({ paths=[], result=null, description = "", action = "" } = {}) {
    this.paths = paths
    this.result = result
    this.description = description
    this.action = action
  }
  add(elt) {
    this.paths.push(elt)
  }
  set(options) {
    for (let key in options) {
      if (key in this) {
        this[key] = options[key]
      }
    }
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