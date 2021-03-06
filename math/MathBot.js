let M = { operators: {}, singles: {} }
M.latex_to_text = function (latex) {
  let text = latex
  let before = ""
  while (text != before) {
    before = text
    text = text.replace(/\\pm/g, "±")
    text = text.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
    text = text.replace(/\\(left|right)([\[\]()])/g, "$2")
    text = text.replace(/\\cdot/g, "*")
    text = text.replace(/\^\{([^{}]*)\}/g, "^($1)")
    text = text.replace(/\\sqrt\[([^[\]]*)\]{([^{}]*)}/g, "($1) °§root§° ($2)")
    text = text.replace(/\\sqrt{([^{}]*)}/g, "2 °§root§° ($1)")
  }
  return text
}
M.findSharedInArrs = function (arrs, { extractNums = false } = {}) { //only works with MathBlock Objects
  console.log("arrs:", arrs)
  let sharedElts = arrs.shift()
  let nums = []
  for (let arr of arrs) {
    for (let i = 0; i < sharedElts.length; i++) {
      let maybe_shared_elt = sharedElts[i]
      if (extractNums && maybe_shared_elt.isNumber) {
        nums.push(maybe_shared_elt)
        continue
      }
      let isShared = false
      for (let elt of arr) {
        if (maybe_shared_elt.isEqualTo(elt)) {
          isShared = true
        }
      }
      if (!isShared) {
        sharedElts.splice(i, 1)
        i--
      }
    }
  }
  return sharedElts
}
M.ArrsEqual = function (arrs) {
  let comp_arr = arrs.shift()
  for (let arr of arrs) {
    arr = [...arr]
    for (let comp_elt of comp_arr) {
      let eltInArr = false
      for (let elt_idx = 0; elt_idx < arr.length; elt_idx++) {
        let elt = arr[elt_idx]
        if (elt.isEqualTo(comp_elt)) {
          eltInArr = true
          arr.splice(elt_idx, 1)
          break;
        }
      }
      if (!eltInArr) {
        return false
      }
    }
    if (arr.length > 0) {
      return false
    }
  }
  return true
}
M.callRepeatedly = function ({ actions, obj }) {
  let history = new M.CalcHistory({ action: "-" })
  let prevObjs = []
  let objString = obj.toString()
  while (!prevObjs.includes(objString)) {
    prevObjs.push(objString)
    for (let i = 0; i < actions.length; i++) {
      obj = history.add(actions[i](obj))
    }
    objString = obj.toString()
  }
  return history
}
M.infoIsPolynomial = function (info) {
  if (!info) {
    return false
  }
  if (isArray(info)) {
    for (let i = 0; i < info.length; i++) {
      let exp = info[i].e
      if (!exp.isNumber) { return false }
      if (!exp.isEven) { return false }
    }
  } else {
    if (!info.e.isNumber) { return false }
    if (!info.e.isEven) { return false }
  }
  return true
}
M.infoHasNumExps = function (info) {
  if (!info) {
    return false
  }
  if (isArray(info)) {
    for (let i = 0; i < info.length; i++) {
      let exp = info[i].e
      if (!exp.isNumber) { return false }
    }
  } else {
    if (!info.e.isNumber) { return false }
  }
  return true
}
/*M.findSharedFactors = function (a, b) {
  let shared = []
  if (isArray(a)) {

  } else {
    
  }
}*/