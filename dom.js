let equationInput = document.getElementById("equationInput")
let equationResult = document.getElementById("equationResult")
let stepsTakenContainer = document.getElementById("stepsTakenContainer")
let windows = {}
for (let windowName of ["settings", "main"]) {
  windows[windowName] = document.getElementById(windowName + "Window")
}
let equationMathField
window.onload = function () {
  equationMathField = MQ.MathField(equationInput, {
    handlers: {
      edit: function () {
        //alert()
        window.sessionStorage.setItem("mainEquationLatex", equationMathField.latex())
      },
      enter: function () {
        handleEquationSubmit()
      }
    },
    charsThatBreakOutOfSupSub: '=',
    supSubsRequireOperand: true
  })
  equationMathField.latex(window.sessionStorage.getItem("mainEquationLatex") || "x^2")
}
function checkInput() {
  let latex = equationMathField.latex()
  /*
  //has become unimportant because of supSubsRequireOperand option in MQ.MathField :
  let nLatex = latex.replace(/\^{\^({([^{}]+)}|([^{}]+))}/, "^{$2$3}")
  */
  let nLatex = latex.replace(/\^{ }/, "")
  //console.log(latex, nLatex)
  if (nLatex != latex) {
    equationMathField.latex(nLatex)
  }
}
function handleEquationSubmit() {
  checkInput()
  console.clear()
  let latex = equationMathField.latex()
  let history = new M.CalcHistory({ action: "-" })
  let eq = new M.Equation(latex,true)
  history.add(eq)
  eq = history.add(eq.solveFor("x"))
  let historyHtmlElt = new M.HistoryHTMLElement(history)
  stepsTakenContainer.innerHTML = ""
  stepsTakenContainer.appendChild(historyHtmlElt)
  equationResult.innerHTML = eq.toLatex()
  //console.log(equationResult.innerHTML)
  MQ.StaticMath(equationResult)
}
function openWindow(name) {
  for (windowName in windows) {
    if (windowName == name) {
      windows[name].style.display = "block"
    } else {
      windows[windowName].style.display = "none"
    }
  }
}