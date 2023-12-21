
### 批量提取

`transferCfxs.js` 是一个批量提取脚本, 可以将映射地址中的 cfxs 转移到**指定地址(eSpace 的 EOA)** 

```shell
node transferCfxs.js <receiver-address>
```

注意: 接受地址必须是一个 eSpace EOA 账户, 即普通账户, 不能是合约地址

注意: 该转移脚本使用的 cfxsid 数据是, 爬取的铸造期间链上 `CFXsCreated` 事件, 可能数据有遗漏, 遗漏的 id 可使用下边的工具单独转移.