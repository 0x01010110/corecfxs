# corecfxs

本脚本可以通过跨 space 打铭文

## 使用方法

1. 安装 node.js 环境
2. 使用 git 下载本项目: `git clone https://github.com/0x01010110/corecfxs.git`
3. npm install
4. 修改 config.json 文件的 `privateKey` 填入私钥. 需要确保账户里有足够的 CFX 用于支付手续费 
5. 启动脚本  `node index.js`

### 说明

1. 目前采用固定的 gasPrice 100 GDrip, 可在配置文件中配置

## 获取映射地址

```shell
node getMapAddress.js
```

## 如何提取映射地址的 cfxs

需要通过 [CrossSpaceCall](https://doc.confluxnetwork.org/docs/espace/build/cross-space-bridge) 内置合约 `callEVM` 方法, 来调用 `cfxs 合约`的 `processTransaction` 来转移 cfxs 代币, 到 eSpace 的任意地址

```js
```