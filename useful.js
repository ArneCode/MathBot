String.prototype.replaceMultiple = function (pairs) {
  let nString = this
  for (let [old, subst] of pairs) {
    nString = nString.split(old).join(subst)
  }
  return nString
}
Number.prototype.getFactors = function () {
  //returns {n,corres}
  if (this % 1 != 0) {
    return []
  }
  let factors = []
  let max = this / 2 + 1
  for (let n = 2; n < max; n++) {
    if (this % n == 0) {
      let corres = this / n
      max = corres
      factors.push({ n, corres })
      if (n != corres) {
        factors.push({ n: corres, corres: n })
      }
    }
  }
  return factors
}
Array.prototype.eachWeach = function (f) {
  let nlist = new Array()
  let restart
  let restart_func = function (val = true) { restart = val }
  for (let i1 = 0; i1 < this.length; i1++) {
    restart = true
    while (restart) {
      restart = false
      for (let i2 = i1 + 1; i2 < this.length; i2++) {
        let elt1 = this[i1]
        let elt2 = this[i2]
        nlist[i1] = f(elt1, elt2, { i1, i2, list: this, restart_loop: restart_func })
      }
    }
  }
  return nlist
}
function isGenerator(fn){
  return ['GeneratorFunction', 'AsyncGeneratorFunction'].includes(fn.constructor.name)
}
function isArray(obj){
  return Object.prototype.toString.call(obj) === '[object Array]'
}