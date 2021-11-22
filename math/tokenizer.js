let token_types = [
  {
    name: "number",
    rx: /^\d+(\.\d+)?(e[+-]\d+)?/
  },
  {
    name: "operator",
    rx: /^([+\-*\/\^]|°§root§°)/
  },
  {
    name: "bracket",
    rx: /^[()]/
  },
  {
    name: "name",
    rx: /^[a-z]+\w*/i
  }
]
export default function tokenize(text) {
  let tokens = []
  text=text.split(" ").join("")
  while (text.length > 0) {
    let found = false
    for (let type of token_types) {
      let result = type.rx.exec(text)
      if (result) {
        found = true
        result = result[0]
        let token = {
          type: type.name,
          text: result
        }
        tokens.push(token)
        text = text.slice(result.length)
        //alert(text)
      }
    }
    if (!found) {
      throw new Error("could not tokenize the following Sequence: " + text)
    }
  }
  return tokens
}
M.tokenize = tokenize