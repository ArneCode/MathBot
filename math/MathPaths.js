M.actions = {
  mult: {
    importance: 1
  },
  plus: {
    importance: 1
  },
  div: {
    importance: 2
  },
  pow: {
    importance: 3
  },
  expandBases: {
    importance: 5
  },
  expToMult: {
    importance: 1
  },
  check: {
    importance: 1
  },
  mult_out_group: {
    importance: 2
  },
  "-": {
    importance: 0
  },
  test:{
    importance:0
  },
}
class CalcHistory {
  constructor({ path = [], parent = null, subPos = null, description = "", action = "" } = {}) {
    if (path.constructor.name == "Array") {
      this.path = path
    } else {
      this.path = [path]
    }
    this.parent = parent
    this.subPos = subPos
    this.description = description
    if (M.actions[action]) {
      this.importance = M.actions[action].importance
    } else {
      throw new Error("action required for history")
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
  compactify(settings = {}) {
    let { min_importance = 0 } = settings
    let path = []
    for (let i = 0; i < this.path.length; i++) {
      let pathElt = this.path[i]
      if (pathElt.isHistory) {
        pathElt = pathElt.compactify(settings)
        path.push(pathElt)
      } else {
        path.push(pathElt)
      }
    }
    this.path = path
    return this
  }
  removeSubNodeHist() {
    //transforms "tree" of subnodes and histories into tree of just histories
    let path = []
    for (let i = 0; i < this.path.length; i++) {
      let pathElt = this.path[i]
      if (pathElt.isHistory) {
        path.push(pathElt.removeSubNodeHist())
      } else {
        path.push(pathElt)
      }
    }
    if (this.parent != null && this.subPos != null) {
      let pos = this.subPos
      let nodesBefore = this.parent.subnodes.slice(0, pos)
      let nodesAfter = this.parent.subnodes.slice(pos + 1)
      for (let i = 0; i < path.length; i++) {
        let node = path[i]
        let parent = Object.assign(CalcHistory.prototype, this.parent)
        parent.subnodes = [...nodesBefore, node, ...nodesAfter]
        path[i] = parent
      }
    }
    return new CalcHistory({ path, description: this.description, action: this.action })
  }
  unwrap(settings = {}) {
    let path = []
    for (let pathElt of this.path) {
      if (pathElt.isHistory) {
        path.push(...pathElt.unwrap(settings))
      } else {
        path.push(pathElt)
      }
    }
    return path
  }
}
CalcHistory.prototype.isHistory = true
M.CalcHistory = CalcHistory
class SimultHistory {
  constructor({ paths = [], result = null, description = "", action = "-" } = {}) {
    this.paths = paths.map(path => path.isHistory ? path : new CalcHistory({ path }))
    this.result = result
    this.description = description
    if (M.actions[action]) {
      this.importance = M.actions[action].importance
    } else {
      throw new Error("action required for history")
    }
    this.action = action
  }
  add(elt) {
    this.paths.push(elt.isHistory ? elt : new CalcHistory({ path: elt, action: "-" }))
    return elt.result
  }
  set(options) {
    for (let key in options) {
      if (key in this) {
        this[key] = options[key]
      }
    }
  }
  unwrap(settings = {}) {
    return this.compactify(settings).unwrap(settings)
  }
  compactify(settings = {}) {
    let obj = this.mergePaths(settings)
    return obj.compactify(settings)
  }
  mergePaths(settings = {}) {
    if (this.result == null) {
      throw new Error("result needs to be given to be able to unwar SimultHistory Object")
    }
    if(this.paths.length==1){
      return new CalcHistory({path:this.paths[0],action:this.action,description:this.description})
    }
    let paths = this.paths.map(path => path.compactify(settings).unwrap(settings))
    let maxStep = Math.max(...paths.map(path => path.length))
    let pElts = []
    let pPathElts = []
    let nPath = []
    for (let step = 0; true; step++) {
      if (paths.every(path => !path[step])) {
        break;
      }
      if (step > 1000) {
        throw "steps > 1000"
      }
      let pathElts = paths.map((path, idx) => path[step] || pPathElts[idx])
      let actionsDone = {}
      for (let i = 0; i < paths.length; i++) {
        let pathElt = pathElts[i]
        if (!pathElt) {
          console.log({ pathElts, i, paths, step, elt: this, pPathElts })
        }
        if (pathElt.isMathBlock) {
          continue;
        }
        let { action } = pathElt
        if (actionsDone[action]) {
          actionsDone[action]++
        } else {
          actionsDone[action] = 1
        }
      }
      let maxAction = { times: 0, action: "none" }
      for (let action in actionsDone) {
        if (actionsDone[action] > maxAction.times) {
          maxAction = { action, times: action[action] }
        }
      }
      let { action } = maxAction
      if (action == "none") {
        try {
          pPathElts = pathElts
          let obj = new this.result.constructor({ subnodes: pathElts })
          nPath.push(new CalcHistory({ path: obj, action: "-" }))
        } catch (err) {
          console.log("MathPath errer",{pathElts,paths,result:this.result})
          throw err
        }

        continue
      }
      let subnodes = []
      let descriptions = []
      for (let i = 0; i < pathElts.length; i++) {
        let pathElt = pathElts[i]
        if (pathElt.isHistoryBlock) {
          if (pathElt.action != action) {
            if (pathElt.description) {
              descriptions.push(pathElt.description)
            }
            pathElt = pathElt.result
            paths[i].splice(step, 0, pathElt)
          }
        }
        subnodes.push(pathElt)
      }
      let obj = new this.result.constructor({ subnodes })
      if (action == "none") {
        action = "-"
      }
      nPath.push(new CalcHistory({ path: obj, action, description: descriptions.join(",") }))
      console.log("added to nPath", nPath)
      pPathElts = pathElts.map(elt => elt.result)
    }
    let history = new CalcHistory({ path: nPath, action: "-" })
    return history
  }
}
SimultHistory.prototype.isHistory = true
M.SimultHistory = SimultHistory
const histEltTemplate = document.querySelector("#histEltTemplate")
class HistoryHTMLElement extends HTMLElement {
  constructor(history, settings = {}) {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.appendChild(histEltTemplate.content.cloneNode(true))
    history = history.compactify(settings)
    if (history.description) {
      this.setSlot("description", document.createTextNode(history.description))
    }
    this.setSlot("action",document.createTextNode(history.action))
    let subPath = document.createElement("div")
    for (let pathElt of history.path) {
      if (pathElt.isHistory) {
        subPath.appendChild(new HistoryHTMLElement(pathElt, settings))
      } else {
        let elt = document.createElement("div")
        elt.innerHTML = pathElt.toLatex()
        MQ.StaticMath(elt)
        subPath.appendChild(elt)
      }
    }
    this.setSlot("subPath", subPath)
  }
  setSlot(name, content) {
    let div = document.createElement("div")
    div.slot = name
    div.appendChild(content)
    this.appendChild(div)
  }
}
window.customElements.define("hist-elt", HistoryHTMLElement)
M.HistoryHTMLElement = HistoryHTMLElement