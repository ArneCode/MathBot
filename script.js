/*setTimeout(() => {
  let startTime = performance.now()
  let history
  let n = 1
  console.log("start")
  for (let i = 0; i < n; i++) {
    history = M.parse("((a+2)^a)^2+2*3").toForm({ form: "Exp", targetVar: "a" }).compactify()
  }
  let endTime = performance.now()
  console.log(`calculating ${n} times took ${endTime - startTime} milliseconds`)
  console.log(history.result.toString())
  document.body.appendChild(new M.HistoryHTMLElement(history))
}, 2000)*/