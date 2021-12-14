setTimeout(() => {
  let startTime = performance.now()
  let history
  let n=1
  for(let i=0;i<n;i++){
  history = M.parse("(a+b)^2").toForm({form:"Exp",targetVar:"a"}).compactify()
  }
  let endTime = performance.now()
  console.log(`calculating ${n} times took ${endTime - startTime} milliseconds`)
  console.log(history.result.toString())
  document.body.appendChild(new M.HistoryHTMLElement(history))
}, 2000)