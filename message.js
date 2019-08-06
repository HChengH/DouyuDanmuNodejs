const {serialize, deserialize} = require('./util')
module.exports = class Message{
    constructor(msg){
        this.bodyMsg = msg
    }

    to_text(){
        return serialize(this.bodyMsg)
    }

    static toData(raw){
        raw = raw.split('\0')
        // if(raw.length > 2){
        //     console.log('packet length::: ', raw.length)
        // }
        let result = []
        for(let i in raw){
            const res = deserialize(raw[i])
            if(JSON.stringify(res) !== '{}'){
                result.push(res)
            }
            
        }
        // let result = deserialize(raw)
        // if(result.length > 1){
        //     console.log(result)
        // }
        return result
    }
}