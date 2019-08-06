const Client = require('./client')
const heapdump = require('heapdump')

function main(){
    console.log('开始....')
    try{
        const myRoom = new Client(8601, 'openbarrage.douyutv.com', '52004')
        myRoom.start()
    } catch (err) {
        console.log('Error msg: ', err)
    }
}

main()