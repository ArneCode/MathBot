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
    text=text.replace(/\\sqrt\[([^[\]]*)\]{([^{}]*)}/g,"($1) °§root§° ($2)")
    text=text.replace(/\\sqrt{([^{}]*)}/g,"2 °§root§° ($1)")
  }
  console.log(text)
  return text
}
