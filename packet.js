const MESSAGE_TYPE_FROM_CLIENT = 689
const MESSAGE_TYPE_FROM_SERVER = 690
const {jspack} = require('jspack')

module.exports = class Packet{
    constructor(body){
        // return JSON.stringify(msg)
        this.body = body
    }
    
    toRaw(){
        const rawLength = (this.body.length + 9)
        const msgType = MESSAGE_TYPE_FROM_CLIENT
        var rawData = jspack.Pack(`<llhbb${this.body.length+1}s`, [rawLength, rawLength, msgType, 0, 0, this.body + '\0'])
        return Buffer.from(rawData)
    }

    static sniff(buff){
        // console.log(buff)
        const buffLen = buff.length
        // let chunks = []
        if(buffLen < 12)
            return ''
        
        // 协议头
        //      length  length  msgType 保留1  保留2
        // 12 =    4   +   4   +  2    + 1   + 1
        const res = jspack.Unpack(`<llhbb${buffLen-12}s`, buff)
        // console.log(res)
        const msg = res.pop()
        // console.log(msg)
        return msg
    }
}