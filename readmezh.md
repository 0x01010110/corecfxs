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

## 如何提取映射地址的 cfxs

### 提取单个 cfxs 工具

首先需要获取 `cfxsid` 铭文的 id, 可通过打铭文的`交易事件`获取, 然后通过如下命令转移 cfxs 到指定地址

```shell
 ./cfxs.js transfer --id <cfxs-id> --receiver <receiver-address>
 # Transfer cfxs id 11580629 to 0x7deFad05B632Ba2CeF7EA20731021657e2000000
 # Result: success
```

### 转移实现原理

需要通过 [CrossSpaceCall](https://doc.confluxnetwork.org/docs/espace/build/cross-space-bridge) 内置合约 `callEVM` 方法, 来调用 `cfxs 合约`的 `processTransaction` 来转移 cfxs 代币, 到 eSpace 的任意地址

#### Step1. 获取 cfxs 的 id

可通过打铭文的`交易事件`获取, 也可通过 索引服务获取

#### Step2. 构造调用 processTransaction 的参数

```js
let transaction = {
    inputs: [cfxsId],  // cfxsid
    outputs: [{
        owner: receiver, // 接受地址
        amount: 1,  // 符文的金额
        data: ''
    }]
}

// 使用 ethers.js 实例化 cfxs 合约
const { Contract, JsonRpcProvider } = require('ethers');
const { abi } = require('./artifacts/cfxs.json');
const cfxsContract = new Contract(CONFIG.cfxs, abi);

// 进行 abi encode
const data = cfxsContract.interface.encodeFunctionData('processTransaction', [transaction]);
```

#### Step3. 调用 CrossSpaceCall 的 callEVM 方法

```js
const conflux = new Conflux({
    url: CONFIG.url,
    networkId: CONFIG.networkId,
});

const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');
// 第一个参数是 cfxs 合约地址, 第二个参数为上一步的 data
const receipt = await CrossSpaceCall.callEVM(CONFIG.cfxs, data).sendTransaction({
    from: account.address,
}).executed();
```