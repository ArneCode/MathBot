let token_types=[
  {
    name:"number",
    rx: /^\d+(\.\d+)?(e[+-]\d+)?/
  },
  {
    name:"operator",
    rx: /^[+\-*\/]/
  },
  {
    name:"bracket",
    rx: /^[()]/
  }
  ]
export default function tokenize(text) {
  let tokens = []
  while(text.length>0){
    let found=false
    for(let type of token_types){
      let result=type.rx.exec(text)
      if(result){
        found=true
        result=result[0]
        let token={
          type:type.name,
          text:result
        }
        tokens.push(token)
        text=text.slice(result.length)
        //alert(text)
      }
    }
    if(!found){
      throw new Error("could not tokenize the following Sequence: "+text)
    }
  }
  return tokens
}