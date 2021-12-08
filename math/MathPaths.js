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
  }
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
        path.push(pathElt.compactify(settings))
      } else {
        path.push(pathElt)
      }
    }
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
  toHtmlElt(settings) {
    let history = this.removeSubNodeHist().compactify(settings)
    let elt = document.createElement("div")
    let descElt = document.createElement("div")
    descElt.innerHTML = this.description
    for (let i = 0; i < history.path.length; i++) {
      let pathElt = history.path[i]
      if (pathElt.isHistory) {

      }
    }
  }
}
CalcHistory.prototype.isHistory = true
M.CalcHistory = CalcHistory
class SimultHistory {
  constructor({ paths = [], result = null, description = "", action = "-" } = {}) {
    this.paths = paths
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
    let maxStep = Math.max(...this.paths.map(path => path.length))
    for (let step = 0; step < maxStep; step++) {
      let actionsDone = {}
      for (let i = 0; i < this.paths.length; i++) {

      }
    }
    return []
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
    this.setSlot("subPath",subPath)
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