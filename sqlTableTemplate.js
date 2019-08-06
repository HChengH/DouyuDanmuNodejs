//  rid uid nn txt cid level rg nl nc bnn bl chtin
const chatmsgMap = ['rid', 'uid', 'nn', 'txt', 'cid', 'level', 'rg', 'nl', 'nc', 'bnn', 'bl']
const intMap = ['rid', 'uid', 'level', 'rg', 'nl', 'nc', 'bl']
const uenterMap = ['rid', 'uid', 'nn']
const dgbMap = ['rid', 'uid', 'nn', , 'gfid', 'gfcnt']

function toInt(data){
    let value = data
    try {
        value = parseInt(value)
    } catch (e){
        console.log('toIntFailed')
    }
    return value
}

module.exports = class template{
    static createChatMsgTemplate(data){
        let rval = {
            rid: 0,
            uid: 0,
            nn: '', 
            txt: '', 
            cid: '', 
            level: 0, 
            rg: 1, 
            nl: 0, 
            nc: 0, 
            bnn: '', 
            bl: 0, 
            ts: new Date().getTime(), 
        }
        for(let i in data){
            if(chatmsgMap.indexOf(i) >= 0){
                let value = data[i]
                if(intMap.indexOf(i) >= 0){
                    value = toInt(value)
                }
                rval[i] = value
            }
        }
        return rval
    }

    static createUenterTemplate(data){
        let rval = {
            rid: 0,
            uid: 0,
            nn: '',
            ts: new Date().getTime(),
        }
        for(let i in data){
            if(uenterMap.indexOf(i) >= 0){
                let value = data[i]
                if(intMap.indexOf(i) >= 0){
                    value = toInt(value)
                }
                rval[i] = value
            }
        }
        return rval
    }

    static createDgbTemplate(data){
        let rval = {
            rid: 0,
            uid: 0,
            nn: '', 
            gfid: 0, 
            gfcnt: 0,
            ts: new Date().getTime(), 
        }
        for(let i in data){
            if(dgbMap.indexOf(i) >= 0){
                let value = data[i]
                if(intMap.indexOf(i) >= 0){
                    value = toInt(value)
                }
                rval[i] = value
            }
        }
        return rval
    }


}