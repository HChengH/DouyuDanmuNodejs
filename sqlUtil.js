const Sequelize = require('sequelize')

module.exports = class sqlUtil{

    constructor(){
        // this.sequelize = new Sequelize(<DBName>, <User>, <Password>, {
        //     host: 'localhost',
        //     dialect: 'mysql',
        //     logging: false,
        //     define: {
        //         'underscored': true,
        //         'charset': 'utf8mb4'
        //     }
        // })

        this.chats = this.sequelize.define('chats', {
            // 即使表的结构也是Model的属性
            rid: {
                type: Sequelize.INTEGER
            },
            uid: {
                type: Sequelize.INTEGER
            },
            nn: {
                type: Sequelize.STRING
            }, 
            txt: {
                type: Sequelize.STRING
            }, 
            cid: {
                type: Sequelize.STRING
            }, 
            level: {
                type: Sequelize.SMALLINT
            }, 
            rg: {
                type: Sequelize.SMALLINT
            }, 
            nl: {
                type: Sequelize.SMALLINT
            }, 
            nc: {
                type: Sequelize.SMALLINT
            }, 
            bnn: {
                type: Sequelize.STRING
            }, 
            bl: {
                type: Sequelize.SMALLINT
            }, 
            ts: {
                type: Sequelize.BIGINT
            },
        })

        this.uenters = this.sequelize.define('uenters', {
            // 即使表的结构也是Model的属性
            rid: {
                type: Sequelize.INTEGER
            },
            uid: {
                type: Sequelize.INTEGER
            },
            nn: {
                type: Sequelize.STRING
            }, 
            ts: {
                type: Sequelize.BIGINT
            },
        })

        this.dgbs = this.sequelize.define('dgbs', {
            // 即使表的结构也是Model的属性
            rid: {
                type: Sequelize.INTEGER
            },
            uid: {
                type: Sequelize.INTEGER
            },
            nn: {
                type: Sequelize.STRING
            }, 
            gfid: {
                type: Sequelize.INTEGER
            }, 
            gfcnt: {
                type: Sequelize.INTEGER
            },
            ts: {
                type: Sequelize.BIGINT
            },
        })
        this.sequelize.sync()
    }

    testConnection(){
        return this.sequelize
            .authenticate()
    }

    async insertChatMsg(datas){
        console.log('bulkCreate(ChatMsg)..... with :::', datas.length)
        // console.log(datas)
        return this.chats.bulkCreate(datas)
    }

    async insertUenter(datas){
        console.log('bulkCreate(Uenter)..... with :::', datas.length)
        // console.log(datas)
        return this.uenters.bulkCreate(datas)
    }

    async insertdgb(datas){
        console.log('bulkCreate(dgb)..... with :::', datas.length)
        // console.log(datas)
        return this.dgbs.bulkCreate(datas)
    }
}