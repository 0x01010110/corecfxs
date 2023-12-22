# corecfxs

本脚本可以通过跨 space 打铭文

## 使用方法

1. 安装 node.js 环境
2. 使用 git 下载本项目: `git clone https://github.com/0x01010110/corecfxs.git`
3. npm install
4. 创建配置文件 `cp config.json.sample config.json`(Linux 命令). 修改 config.json 文件的 `privateKey` 填入私钥. 需要确保账户里有足够的 CFX 用于支付手续费 
5. 启动脚本  `node index.js`

### 说明

1. 目前采用固定的 gasPrice 100 GDrip, 可在配置文件(config.json)中配置

## 获取映射地址

```shell
./cfxs.js mappedAddress
```

## 查询映射地址 cfxs 余额

```shell
./cfxs.js cfxsBalance
```