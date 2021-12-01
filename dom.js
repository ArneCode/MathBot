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
  //console.log(latex)
  let node
  try {
    node = M.parseLatex(latex).check()
  } catch (err) {
    throw err
  }
  node = node.toForm({form:"Exp"})
  equationResult.innerHTML = node.toLatex()
  //console.log(equationResult.innerHTML)
  MQ.StaticMath(equationResult)
}