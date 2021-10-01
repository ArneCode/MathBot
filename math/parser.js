import Mult from "./operators/mult.js"
import Plus from "./operators/plus.js"
import NumberBlock from "./singles/number.js"
import Group from "./singles/group.js"
import tokenize from "./tokenizer.js"
let priorityList = [
  Plus,
  Mult
]
export default function parse(text) {
  let tokens = tokenize(text)
  tokens = addObjWrappers(tokens)
  let tree = tokens_to_tree(tokens)
  return tree
}
let opClasses = {
  "+": Plus,
  "*": Mult
}
function addObjWrappers(tokens) {
  let nTokens = []
  for (let token of tokens) {
    switch (token.type) {
      case "number": {
        nTokens.push(new NumberBlock(token.text))
        break;
      }
      case "operator": {
        let opBlock = opClasses[token.text]
        if (opBlock) {
          nTokens.push(new opBlock())
        } else {
          throw new Error("no such operator defined: " + token.text)
        }
        break;
      }
      case "bracket": {
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
  if (Op.swappable) {
    let subnodes = []
    let curr_node = []
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]
      if (token.constructor == Op) {
        if (curr_node.length == 0) {
          throw new Error("operators need to be placed between singles")
        }
        subnodes.push(tokens_to_tree(curr_node, priority + 1))
        curr_node = []
        tokens = tokens.slice(i)
        i = 0
      } else {
        curr_node.push(token)
      }
    }
    if (curr_node.length == 0) {
      throw new Error("operators need to be placed between singles")
    }
    subnodes.push(tokens_to_tree(curr_node, priority + 1))
    if (subnodes.length == 1) {
      return subnodes[0]
    }
    return new Op(subnodes)
  } else {
    console.log(Op)
    throw "not jet implemented"
  }
}
function tokens_to_tree(tokens, priority = 0) {
  if (priority >= priorityList.length) {
    if (tokens.length > 1) {
      throw new Error("there seems to be an error. it might be, that you forgot a * sign between elements of the calculation")
    }
    return tokens[0]
  }
  tokens = brack_to_gr(tokens)
  return structureOps(tokens, priority)
}
M.parse = parse