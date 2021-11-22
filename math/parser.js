import Mult from "./operators/mult.js"
import Plus from "./operators/plus.js"
import Negative from "./operators/negative.js"
import Div from "./operators/div.js"
import Pow from "./operators/pow.js"
import Root from "./operators/root.js"
import NumberBlock from "./singles/number.js"
import Group from "./singles/group.js"
import Variable from "./singles/variable.js"
import FunctionBlock from "./singles/functionBlock.js"
import tokenize from "./tokenizer.js"
let priorityList = [
  Negative,
  Plus,
  Mult,
  Div,
  Pow,
  Root
]
export default function parse(text) {
  if (!text) {
    throw new Error("parse expects text, got:" + text)
  }
  let tokens = tokenize(text)
  tokens = addObjWrappers(tokens)
  let tree = tokens_to_tree(tokens)
  return tree
}
let opClasses = {
  "+": Plus,
  "-": Negative,
  "*": Mult,
  "/": Div,
  "^": Pow,
  "°§root§°": Root,
}
function addObjWrappers(tokens) {
  let nTokens = []
  for (let token of tokens) {
    switch (token.type) {
      case "number": {
        nTokens.push(new NumberBlock({ n: token.text }))
        break;
      }
      case "operator": {
        let opBlock = opClasses[token.text]
        if (opBlock) {
          nTokens.push(new opBlock({ temp: true }))
        } else {
          throw new Error("no such operator defined: " + token.text)
        }
        break;
      }
      case "bracket": {
        nTokens.push(token)
        break;
      }
      case "name": {
        nTokens.push(token)
        break;
      }
      default: {
        throw new Error(token.type + " is not a valid type")
      }
    }
  }
  return nTokens
}
function brack_to_gr(tokens) {
  let nTokens = []
  let group_arr = []
  let level = 0
  let contained_group
  for (let token of tokens) {
    if (token.text == "(") {
      if (level > 0) {
        group_arr.push(token)
      }
      level++
    } else if (token.text == ")") {
      level--
      if (level == -1) {
        throw new Error("bracket error")
      } else if (level == 0) {
        let group = new Group(tokens_to_tree(group_arr))
        nTokens.push(group)
        group_arr = []
      } else {
        group_arr.push(token)
      }
    } else {
      if (level == 0) {
        nTokens.push(token)
      } else {
        group_arr.push(token)
      }
    }
  }
  if (level != 0) {
    throw new Error("bracket error")
  }
  return nTokens
}
function structureOps(tokens, priority) {
  let Op = priorityList[priority]
  if (Op == Negative) {
    let subnodes = []
    let isNeg = false
    let curr_node = []
    let wrapNeg = () => {
      if (subnodes.length > 0) {
        subnodes.push(new Plus())
      }
      let subnode = new Negative({ subnode: tokens_to_tree(curr_node, priority + 1) })
      subnodes.push(subnode)
      curr_node = []
    }
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]
      if (token.isNegative) {
        isNeg = !isNeg
        if (!isNeg) {
          wrapNeg()
        }
      } else if (isNeg) {
        curr_node.push(token)
      } else {
        subnodes.push(token)
      }
    }
    if (isNeg) {
      wrapNeg()
    }
    return structureOps(subnodes, priority + 1)
  }
  if (Op.isSwappable) {
    let subnodes = []
    let curr_node = []
    let opFound = false
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]
      if (token.constructor == Op) {
        opFound = true
        if (curr_node.length == 0) {
          throw new Error("operators need to be placed between singles")
        }
        subnodes.push(tokens_to_tree(curr_node, priority + 1))
        curr_node = []
        //tokens = tokens.slice(i+1)
        //i = 0
      } else {
        curr_node.push(token)
      }
    }
    if (curr_node.length == 0) {
      console.log(tokens)
      throw new Error("operators need to be placed between singles")
    }
    subnodes.push(tokens_to_tree(curr_node, priority + 1))
    if (subnodes.length == 1) {
      //console.log(tokens,subnodes,"length1")
      return subnodes[0]
    }
    if (opFound) {
      return new Op({ subnodes })
    } else {
      return tokens_to_tree(subnodes)
    }
  } else if (Op.isTwoSided) {
    if (tokens.length == 3 && tokens[1].constructor == Op) {
      return new Op({ left: tokens[0], right: tokens[2] })
    }
    else return tokens_to_tree(tokens, priority + 1)
  }
  else {
    console.log(Op)
    throw "not jet implemented"
  }
}
function parseFuncVars(tokens) {
  let nTokens = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (token.type == "name") {
      let nextToken = tokens[i + 1] || {}
      if (nextToken.isGroup) {
        nTokens.push(new FunctionBlock({ name: token.text, subnodes: nextToken.subnodes }))
        i++
      } else {
        nTokens.push(new Variable({ name: token.text }))
      }
    } else {
      nTokens.push(token)
    }
  }
  return nTokens
}
function tokens_to_tree(tokens, priority = 0) {
  if (priority >= priorityList.length) {
    if (tokens.length > 1) {
      console.log("tokens:", tokens)
      throw new Error("there seems to be an error. it might be, that you forgot a * sign between elements of the calculation")
    }
    return tokens[0]
  }
  let pTokens = tokens
  tokens = brack_to_gr(tokens)
  tokens = parseFuncVars(tokens)
  let result
  try {
    result = structureOps(tokens, priority)
  } catch (err) {
    throw err
  }
  return result
}
function parseLatex(latex) {
  let text = M.latex_to_text(latex)
  return parse(text)
}
M.parseLatex = parseLatex
M.parse = parse