String.prototype.replaceMultiple=function(pairs){
  let nString=this
  for(let [old,subst] of pairs){
    nString=nString.split(old).join(subst)
  }
  return nString
}