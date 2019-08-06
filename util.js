var exports = module.exports

function escape(value){
    value = value.toString()
    value = value.replace('@', '@A')
    value = value.replace('/', '@S')
    return value
}

function unescape(value){
    value = value.toString()
    value = value.replace('@A', '@')
    value = value.replace('@S', '/')
    return value
}

exports.serialize = function(message){
    if(typeof message === 'undefined'){
        return ''
    }

    let buff = []
    for(var key in message){
        const value = message[key]
        buff.push( escape(key) + '@=' + escape(value) )
    }
    buff.push('')
    return buff.join('/')
}

exports.deserialize = function(raw){
    result = {}
    if(typeof raw === 'undefined' || raw.length <= 0){
        return result
    }

    kv_pairs = raw.split('/')
    for(let i in kv_pairs){
        let temp = kv_pairs[i]
        if(temp.length === 0){
            // console.log('CONTINUE1')
            continue
        }

        temp = temp.split('@=')
        if(temp.length !== 2){
            // console.log('CONTINUE2')
            continue
        }

        // console.log(temp)
        const key = unescape(temp[0])
        let value = unescape(temp[1])
        if(!key){
            // console.log('CONTINUE3')
            continue
        }
        if(!value){
            value = ''
        }
        try{
            if(value.includes('@=')){
                value = deserialize(value)
            }
        }catch(e){
            continue
        }
        result[key] = value
    }

    return result
}