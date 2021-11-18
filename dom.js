let equationInput = document.getElementById("equationInput")
let equationResult = document.getElementById("equationResult")
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
  equationMathField.latex(window.sessionStorage.getItem("mainEquationLatex") || "x^2=a")
}
function checkInput() {
  //has become unimportant because of supSubsRequireOperand option in MQ.MathField
  let latex = equationMathField.latex()
  let nLatex = latex.replace(/\^{\^({([^{}]+)}|([^{}]+))}/, "^{$2$3}")
  console.log(latex, nLatex)
  if (nLatex != latex) {
    equationMathField.latex(nLatex)
  }
}
function handleEquationSubmit() {
  let latex = equationMathField.latex()
  console.log(latex)
  let node = M.parseLatex(latex)
  console.log(node)
  equationResult.innerHTML = node.toLatex()
  MQ.StaticMath(equationResult)
}