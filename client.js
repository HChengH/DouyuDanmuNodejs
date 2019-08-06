const net = require('net')
const Packet = require('./packet')
const Message = require('./message')
const cp = require('child_process')
const iconv = require('iconv-lite')

var fs = require("fs");

// var boundedBuffer = []

module.exports = class Client{
    constructor(port, hName, roomId){
        this.portNumber = port
        this.hostName = hName
        this.roomId = roomId

        // 创建 Packet处理，入库子进程
        this.msgParser = cp.fork('./msgParser.js')

        this.initializeSocket()
    }

    initializeSocket(){
        this.socket = net.createConnection({port: this.portNumber, host: this.hostName}, ()=>{
            console.log('socket Connected')
        })

        this.socket.on('data', this.receivePacket.bind(this))

        this.socket.on('timeout', this.handleError.bind(this, 'timeout'))
        this.socket.on('close', this.handleError.bind(this, 'close'))
        this.socket.on('error', this.handleError.bind(this, 'error'))
    }

    reInitializeSocket(){
        console.log('Socket reConnection Start.....\n')
        this.initializeSocket()
        this.start()
    }

    start(){
        this.sendMsg({
            type: 'loginreq',
            roomid: this.roomId,
        })
    }

    sendMsg(msg){
        this.socket.write(new Packet(new Message(msg).to_text()).toRaw())
    }

    receivePacket(data){
        const res = Packet.sniff(data)

        // debug log
        if(res.indexOf('type@=chatmsg') >= 0){
            const date = new Date()
            const path = `chatmsg_${date.getMonth()+1}@${date.getDate()}.txt`

            fs.access(path, fs.constants.F_OK, (err) => {
                // console.log(`${path} ${err ? 'does not exist' : 'exists'}`);
                if(err){
                    fs.mkdir(path, (err)=>{
                        if(err){
                            console.log(err)
                        }
                    })
                }
              })


            fs.appendFile(path, `${iconv.decode(data, 'utf-8')}\n\n`, (err) => {
                if (err) console.log(err);
                // console.log("Successfully Written to File.")
            })
        }

        this.msgParser.send({msg: res})

        // boundedBuffer.push(res)

        if(res.indexOf('type@=loginres') >= 0){
            this.sendMsg({
                type: 'joingroup', 
                rid: this.roomId, 
                gid: -9999,
            })
            this.heartBeat(45000)
        }
    }

    handleError(e){
        console.log('on Error: ', JSON.stringify(e))

        // close the heart beat task
        clearInterval(this.heartBeatTask)

        // close the socket
        this.socket.destroy()

        // reInitialize the socket.... i.e. try reconnect
        this.reInitializeSocket()
    }

    heartBeat(interval){
        const that = this
        this.heartBeatTask = setInterval(()=>{
            that.socket.write(new Packet(new Message({type: 'mrkl'}).to_text()).toRaw())
        }, interval)
    }
    
}