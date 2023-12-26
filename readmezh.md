# corecfxs

本脚本可以通过跨 space 打铭文

## 使用方法

1. 安装 node.js 环境
2. 使用 git 下载本项目: `git clone https://github.com/0x01010110/corecfxs.git`
3. npm install
4. 创建配置文件 `cp config.json.sample config.json`(Linux 命令). 修改 config.json 文件的 `privateKey` 填入私钥(core 空间账户私钥). 需要确保账户里有足够的 CFX 用于支付手续费 
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

## 新 CFXs 合约地址

原 CFXs 合约为测试合约, 最终需要兑换成新 CFXs 合约, 合约地址为: `0xd3a4d837e0a7b40de0b4024fa0f93127dd47b8b8`

## 查询映射地址新 cfxs 合约余额

```shell
./cfxs.js newCfxsBalance
```

## 兑换 Core Space 打到的 CFXs

更新最新代码, 然后参照 config.json.sample 更新 config.json 文件(增加了四个配置项), 然后执行:

```shell
node exchangeCfxs.js
```

该脚本会从索引服务获取账户打到的 CFXs id, 然后兑换成新的 CFXs.

说明:

1. 兑换过程中可能因为 RPC 网络问题导致部分兑换失败, 可以多次执行该脚本, 直到所有 CFXs 兑换成功.
2. 可通过比较新旧 CFXs 合约余额来判断是否兑换成功, 两者相等则表示全部兑换成功.
3. 兑换的新 CFXs 余额还在 Core 账户的映射地址中, 可通过下边脚本, 转移到 eSpace 的 EOA 账户中.

## 转移新 CFXs 到 eSpace 的 EOA 账户

执行如下脚本, 并指定接受账户, 请注意接受账户为 eSpace EOA 账户:

```shell
node transferCfxs.js <receiver-address>
```

## eSpace 账户的 CFXs 兑换新 CFXs

需要先在 config.json 中配置 eSpace 账户的私钥, 配置项为 `eSpacePrivateKey`, 然后执行如下脚本:

```shell
node espace/eSpaceExchangeCfxs.js
```