# 转移实现原理

需要通过 [CrossSpaceCall](https://doc.confluxnetwork.org/docs/espace/build/cross-space-bridge) 内置合约 `callEVM` 方法, 来调用 `cfxs 合约`的 `processTransaction` 来转移 cfxs 代币, 到 eSpace 的任意地址

## Step1. 获取 cfxs 的 id

可通过打铭文的`交易事件`获取, 也可通过 索引服务获取

## Step2. 构造调用 processTransaction 的参数

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

## Step3. 调用 CrossSpaceCall 的 callEVM 方法

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