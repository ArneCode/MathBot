let M={}
M.latex_to_text = function(latex) {
  let text = latex
  let before = ""
  while (text != before) {
    before = text
    text = text.replace(/\\pm/g, "±")
    text = text.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
    text = text.replace(/\\(left|right)([\[\]()])/g, "$2")
    text = text.replace(/\\cdot/g, "*")
    text = text.replace(/\^\{([^{}]*)\}/g, "^($1)")
  }
  return text
}