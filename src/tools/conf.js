import abi from './contractABI';

// 测试配置 
export default {
  bonusInfos: { // 奖金信息  挖矿的代币地址
    pool1: {
      address: '0xCb4e8CafEDa995da5cEdfda5205BD5664a12b848',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
  },
  poolInfos: { // 池子信息  池子信息的地址
    pool1: {
      address: '0xa8d8FEeB169EeAA13957300A8c502D574bda2114',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool2: {
      address: '0x8fB10755a42A1B44036379D250BDCCE06834DFfE',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool3: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool4: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
  },
  marginInfos: { // 池子对应的保证金   质押代币的地址
    pool1: {
      address: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool2: {
      address: '0x4E09EABb448525A77A7A7727E049DFE428012c1a',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool3: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool4: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
  } 
}
