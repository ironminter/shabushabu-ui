import abi from './contractABI';

// 测试配置 
export default {
  bonusInfos: { // 奖金信息  挖矿的代币地址
    pool1: {
      address: '0xCd2c4BA710341484e10CB58eC623f740aeE28D7d',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
  },
  poolInfos: { // 池子信息  池子信息的地址
    pool1: {
      address: '0x1d6d45E1370E894Deaf1F33E946E9bc1d566C9F9',
      decimals: 18,
      isToken: true,
      abi: abi.rewardPoolABI
    },
    pool2: {
      address: '0x0000000000000000000000000000000000000000',
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
      address: '0xa49df271Dcd43A6c623415A20C20cf42b25Cca2D',
      decimals: 18,
      isToken: true,
      abi: abi.erc20ABI
    },
    pool2: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 6,
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
