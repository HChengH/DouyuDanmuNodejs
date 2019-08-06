const iconv = require('iconv-lite')
const Message = require('./message')
const template = require('./sqlTableTemplate')

const sqlUtil = require('./sqlUtil')
const mySqlUtil = new sqlUtil()

const connectionPromise = mySqlUtil.testConnection()

var buffer = []
var chatMsgQueue = []
var uenterQueue = []
var dgbQueue = []

var isFinished = true

process.on('message', (data)=>{
    let msg = parseMessage(iconv.decode(data.msg, 'utf-8'))

    buffer = buffer.concat(constructTemplate(msg))

    // insertSQL(buffer)
    if(buffer.length >= 100 && isFinished){
        console.log('插入数据库: length('+ buffer.length + ')')
        isFinished = false
        const inputBuf = [...buffer]
        buffer = []
        insertSQL(inputBuf)
    }
})


// module.exports = {
//     parseMessage(data){
//         let msg = parseMessage(iconv.decode(data.msg, 'utf-8'))

//         buffer.push(msg)

//         if(buffer.length >= 500){
//             const inputBuf = [...buffer]
//             buffer = []
//             await insertSQL(inputBuf)
//         }
//     }
// }

process.on('close', (code, signal)=>{
    console.log(`child process terminated due to receipt of signal ${signal}`)
})

function parseMessage(data){
    const pData = Message.toData(data)
    return pData
}

async function insertSQL(data){
    isFinished = false
    for(let i in data){
        const tempMsg = data[i]
        dispatchToIndividualSQLTable(tempMsg)
    }

    await connectionPromise

    let promiseQueue = []
    if(chatMsgQueue.length >= 50){
        promiseQueue.push(mySqlUtil.insertChatMsg(chatMsgQueue))
        chatMsgQueue = []
    }

    if(uenterQueue.length >= 20){
        promiseQueue.push(mySqlUtil.insertUenter(uenterQueue))
        uenterQueue = []
    }

    if(dgbQueue.length >= 100){
        promiseQueue.push(mySqlUtil.insertdgb(dgbQueue))
        dgbQueue = []
    }

    Promise.all(promiseQueue)
        .catch((err)=>{
            buffer.concat(data)
            console.log('sql插入错误:', err)
        })
        .finally(()=>{
        isFinished = true
    })
}

function dispatchToIndividualSQLTable(data){
    let insertedData
    switch(data['type']){
        // 弹幕
        case 'chatmsg':
            // insertedData = template.createChatMsgTemplate(data)
            // console.log(insertedData)
            chatMsgQueue.push(data['data'])
            break
        // 用户进入房间
        case 'uenter':
            insertedData = template.createUenterTemplate(data)
            // console.log(insertedData)
            uenterQueue.push(data['data'])
            break
        // 用户赠送礼物 824=荧光棒, 193=弱鸡
        case 'dgb':
            insertedData = template.createDgbTemplate(data)
            // console.log(insertedData)
            dgbQueue.push(data['data'])
            break
        房间开关播提醒
        case 'rss':
            break
        // 房间用户抢鱼丸
        case 'ggbb':
            break
        // 房间top10变化消息
        case 'rankup':
            console.log('top 10 变化')
            // console.log(data)
            break
        // 主播离开提醒
        case 'al':
            break
        // 主播回来提醒
        case 'ab':
            break
        // 用户抢到道具(捡垃圾)
        case 'gpbc':
            break
        // 房间贵族列表广播信息
        case 'online_noble_list':
            break
        // 用户升级
        case 'upgrade':
            break
        // 主播等级提升
        case 'upbc':
            break
        // 禁言
        case 'newblackres':
            break
        // 粉丝牌等级提升
        case 'blab':
            break
        // 粉丝排行榜变化
        case 'frank':
            break
        default:
            // console.log('不支持的消息类型')
    }
}

function constructTemplate(data){
    let res = []

    // if(data.length > 1){
    //     console.log('处理多个...')
    // }

    for(let i in data){
        let insertedData
        const tmpData = data[i]
        switch(tmpData['type']){
            // 弹幕
            case 'chatmsg':
                insertedData = template.createChatMsgTemplate(tmpData)
                res.push({type: tmpData['type'], data: insertedData})

                // if(data.length > 1) console.log('chatmsg')

                break
            // 用户进入房间
            case 'uenter':
                insertedData = template.createUenterTemplate(tmpData)
                res.push({type: tmpData['type'], data: insertedData})

                // if(data.length > 1) console.log('uenter')

                break
            // 用户赠送礼物 824=荧光棒, 193=弱鸡
            case 'dgb':
                insertedData = template.createDgbTemplate(tmpData)
                res.push({type: tmpData['type'], data: insertedData})

                // if(data.length > 1) console.log('dgb')

                break
            房间开关播提醒
            case 'rss':
                break
            // 房间用户抢鱼丸
            case 'ggbb':
                break
            // 房间top10变化消息
            case 'rankup':
                console.log('top 10 变化')
                // console.log(data)
                break
            // 主播离开提醒
            case 'al':
                break
            // 主播回来提醒
            case 'ab':
                break
            // 用户抢到道具(捡垃圾)
            case 'gpbc':
                break
            // 房间贵族列表广播信息
            case 'online_noble_list':
                break
            // 用户升级
            case 'upgrade':
                break
            // 主播等级提升
            case 'upbc':
                break
            // 禁言
            case 'newblackres':
                break
            // 粉丝牌等级提升
            case 'blab':
                break
            // 粉丝排行榜变化
            case 'frank':
                break
            default:
                // console.log('不支持的消息类型')
        }
    }
    return res
}
// function main(){
//     console.log('子线程开始:::')
//     setInterval(()=>{
//         isFinished = false;
//         insertSQL([...buffer])
//         buffer = []
//     }, 5000)
// }

// main()