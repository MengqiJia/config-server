config-server

功能说明
-------
config-server是用于提供认证信息的服务

安装及使用
--------
安装: npm install config-server
使用: 
1. 使用web交互界面
node index.js 默认使用端口是 1234
浏览器打开localhost:1234/index 即可使用
2. 使用命令行工具生成clients配置数据
./generateClients.js

详细配置
-------
config目录下有配置信息，默认使用defaut.json。可以配置以下信息
· 登录系统的用户名密码
· redis的使用端口
· 单元测试的数据