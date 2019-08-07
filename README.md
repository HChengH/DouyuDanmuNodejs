# DouyuDanmuNodejs
Node.js 实现的斗鱼三方弹幕接入，存储服务

## 介绍

- 一个简单的Node.js搭建的服务，主要用来接入斗鱼三方弹幕接口以及所对应的的存储数据库服务
- 自己瞎B写的，随便用，有问题可以@我 233333
- 后续可能会用egg框架包一下，给网页做一些增删改查以及数据分析的接口(画个饼)



## 结构

- 程序入口是main.js

  ```
  ├── LICENSE
  ├── README.md
  ├── client.js			客户端组件/与TCP层面上的client相似
  ├── main.js               	程序入口
  ├── message.js            	消息组件
  ├── msgParser.js          	消息处理组件
  ├── package.json
  ├── packet.js             	包模块
  ├── roomMonitor.js        	暂时废弃，未来开发...
  ├── sqlTableTemplate.js   	SQL 数据库数据模板
  ├── sqlUtil.js	    	SQL 数据库操作组件/API
  └── util.js		    	公用组件/API
  ```

  ```javascript
  // 可以直接改房间号实现不同房间的监听
  // 这里可以稍微更改一下用多进程的方式可以同时监听多个房间
  // 别问，问就菠萝赛东不pay，he tui
  const myRoom = new Client(8601, 'openbarrage.douyutv.com', '52004')
  myRoom.start()
  ```

  

- Client 是一个简单的基于net实现的长连接webSocket
  - Client会创建一个子进程 msgParser 用来处理消息
  - Client同时也会创建一个定时任务来维护心跳包的发送
    - 实现的比较丑陋，直接setInterval了。。。
- 其他的就都是emmm业务代码，懒得解释了，直接翻代码8
- 因为Node本身没有网络层的包的编解码，所以用了jspack，详细可以去看看jspack的文档嗷
- 同时为了方便实现，数据库入库部分用了Sequelize，也非常的直接，同样可以去自己看看文档
- 因为弹幕是一个存在高并发可能的服务，所以为了降低IO，我采用了一个长度为100的buffer用来存储消息，当buffer超过100后会分发给子队列，当子队列超过一定长度后再统一批量入库从而节约一些系统资源
  - 这其中有一些小问题比如说当消息不活跃时很有可能消息会在buffer中存很久...
  - 解决方案是可以加一个timeout
