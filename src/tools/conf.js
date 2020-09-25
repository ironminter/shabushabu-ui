import abi from './contractABI';

// 测试配置 
export default {
  bonusInfos: { // 奖金信息  挖矿的代币地址
    pool1: {
      address: '0x79b234d5389E17DF2d9a09F1FF6a1Ac0Db0255B9',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
  },
  poolInfos: { // 池子信息  池子信息的地址
    pool1: {
      address: '0xEc9CA6b575a62C059AE50c7139d3Ed06e5e2EB5c',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool2: {
      address: '0xA816F532a3A5a6e8BD6BE2e32C9c064928AEdC06',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool3: {
      address: '0x99dcEf0A3a1694ceCa913bF21cF263C22EFE416d',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool4: {
      address: '0x31A21046a6b7c913F3863F62E465c578e7634c78',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
  },
  marginInfos: { // 池子对应的保证金   质押代币的地址
    pool1: {
      address: '0x7906Fe53F834b7d53cAB4A290AA690395FEF6771',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool2: {
      address: '0xEBA2a7912bC80edf9966648ae0c43190CDDffAeC',
      decimals: 6,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool3: {
      address: '0x9ac3ae0e48da49b33EA39E0340cDce08084efF0d',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool4: {
      address: '0x10C8AEc2C818c442832D322858611d8616cC5b60',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
  } 
}
