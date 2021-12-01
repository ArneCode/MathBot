class PathElt {
  constructor({ path, parentObj = null, parentSubPos = null, description = null, action = null } = {}) {
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
  get result() {
    if (this.path.isPathEltObj) {
      return path.result
    }
    let lastElt = this.path[this.path.length - 1]
    if (lastElt.isPathElt) {
      return lastElt.result
    }
    if (!lastElt.isMathBlock) {
      throw "should be Mathblock"
    }
    return lastElt
  }
  unwrap() {
    if (this.path.isPathEltObj) {
      return this.path.unwrap()
    }
    let path = []
    for (let i = 0; i < this.path.length; i++) {
      let pathElt = this.path[i]
      if (pathElt.isPathEltObj) {
        path.push(...pathElt.unwrap())
      }
    }
    return path
  }
}
M.makePathElt = function (options) {
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
PathElt.prototype.isPathEltObj = true
M.PathElt = PathElt
class SimultaniousPathElt extends PathElt {
  constructor({ paths, resultObj, description = null, action = null } = {}) {
    this.paths = paths
    this.result = resultObj
    this.resultSubPos = resultSubPos
    this.description = description
    this.action = action
  }
}
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