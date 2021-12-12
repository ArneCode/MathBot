setTimeout(()=>{
  document.body.appendChild(new M.HistoryHTMLElement(M.parse("(a+b)^2").expandBases().compactify()))
},1000)