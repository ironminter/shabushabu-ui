import conf from "./conf";
import { injected, walletconnect } from "./connectors";

import Web3 from 'web3';
import EventEmitter from 'eventemitter3';
const rp = require('request-promise');

class EthWallet {

  constructor() {

    this.eventConstant = {
      wallet_connection: "wallet_connection", // 钱包连接
      connection_disconnected: "connection_disconnected", // 钱包断开连接
      ERROR: "ERROR" // 钱包断开连接
    };

    this.store = {
      universalGasPrice: '70',
      /**
       * @type {address: string}
       */
      account: {},
      web3: null,
      web3context: null,
      connectorsByName: {
        MetaMask: injected,
        WalletConnect: walletconnect
      }
    }

    // 事件管理器
    this.eventEmitter = new EventEmitter();
    // this._init();
  }

  _init() {

    const self = this;

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
          .then((res) => {
            self.store.account = { address: res.account };
            self.store.web3context = { library: { provider: res.provider } };
            self.eventEmitter.emit(self.eventConstant.wallet_connection)
          })
          .catch((err) => {
            console.error(err)
          })
      } else {

      }
    });
  }

  // 获取默认地址
  getDefaultAddress() {

    if (typeof this.store.account.address === 'undefined') {
      return {
        code: -1,
        msg: '未连接钱包'
      };
    }

    return {
      code: 0,
      data: this.store.account.address
    };
  }

  // 获取 web3provider
  getWeb3provider() {
    return this.store.web3context.library.provider;
  }

  /**
   * 安全的投资、校验 授权金额
   * @param {string} poolMark 
   * @param {number} amount 
   * @param {function} stepCall 
   */
  safeInvest = async (poolMark, amount, stepCall) => {

    const addressRes = this.getDefaultAddress();
    if (addressRes.code !== 0) {
      return addressRes;
    }

    const marginInfo = conf.marginInfos[poolMark];

    if (marginInfo.isToken) {

      await this._checkApproval(poolMark, amount);

      return await this._callInvest(poolMark, amount, stepCall);

    } else {
      return await this._callInvest(poolMark, amount, stepCall);
    }
  }

  /**
   * 检验授权
   * @param {string} poolMark 
   * @param {number} amount 
   */
  _checkApproval = async (poolMark, amount) => {

    const addressRes = this.getDefaultAddress();
    if (addressRes.code !== 0) {
      return addressRes;
    }

    const poolInfo = conf.poolInfos[poolMark];
    const marginInfo = conf.marginInfos[poolMark];

    if (!marginInfo.isToken) {
      return {
        code: 0,
        msg: '已授权'
      }
    }

    const web3 = new Web3(this.getWeb3provider());
    const erc20Contract = new web3.eth.Contract(marginInfo.abi, marginInfo.address);

    try {
      const allowance = await erc20Contract.methods
        .allowance(addressRes.data, poolInfo.address)
        .call({ from: addressRes.data });

      let ethAllowance = web3.utils.fromWei(allowance, "ether");

      if (marginInfo.decimals !== 18) {
        ethAllowance = allowance / (10 ** marginInfo.decimals);
      }

      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(poolInfo.address, web3.utils.toWei('999999999999', "ether"))
          .send(
            {
              from: addressRes.data,
              to: marginInfo.address,
              gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
              gasLimit: 500000
            }
          )
        return {
          code: 0,
          msg: '已授权'
        }
      } else {
        return {
          code: 0,
          msg: '已授权'
        }
      }
    } catch (err) {
      console.error(err);
      return {
        code: -1,
        msg: '授权失败'
      }
    }
  }

  /**
   * 投资
   * @param {string} poolMark 
   * @param {number} amount 
   * @param {function} stepCall 
   */
  _callInvest = async (poolMark, amount, stepCall) => {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];
    const marginInfo = conf.marginInfos[poolMark];

    const web3 = new Web3(this.getWeb3provider());

    // erc20 转账
    const contract = new web3.eth.Contract(poolInfo.abi, poolInfo.address); // 合同

    let amountToSend = web3.utils.toWei(amount, "ether");
    if (marginInfo.decimals !== 18) {
      amountToSend = amount * 10 ** marginInfo.decimals;
    }

    stepCall({
      code: 1,
      msg: '连接合同已完成'
    });

    try {
      const result = await contract.methods.stake(amountToSend).send(
        {
          from: addressRes.data,
          to: poolInfo.address,
          gasLimit: 500000,
          gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei')
        }
      )

      return {
        code: 0,
        data: result
      }

    } catch (err) {
      console.error('_callInvest>>>', err)
    }
  }

  /**
  * 根据合约地址、存款
  * 存款 stake(uint256 amount)
  * @param {string} contractAddress 合约地址
  * @param {number} myNum 查询谁的账户
  */
  async invest(poolMark, amount, stepCall) {
    return this._callInvest(poolMark, amount, stepCall);
  }

  /**
   * 获取余额 外部调用
   * @param {*} asset 
   * @param {string} needAddress 
   */
  getBalance = async (asset, needAddress, decimals) => {
    const web3 = new Web3(this.getWeb3provider());

    return await this._getBalance(web3, asset, needAddress, decimals);
  }

  /**
   * 查询余额
   * @param {Web3} web3 
   * @param {*} asset 
   * @param {string} needAddress 
   */
  _getBalance = async (web3, asset, needAddress, decimals) => {
    if (asset.isToken) {

      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address);

      try {
        let balance = await erc20Contract.methods
          .balanceOf(needAddress)
          .call();
        // .call({ from: this.getDefaultAddress().data });

        const dec = decimals ? decimals : asset.decimals;

        // balance = parseFloat(balance) / 10 ** dec;
        balance = web3.utils.toBN(balance).div(web3.utils.toBN(10 ** dec)).toNumber();
        return {
          code: 0,
          data: balance
        }
      } catch (err) {
        console.log(err);
        return {
          code: -1,
          data: 0
        }
      }
    } else {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(needAddress), "ether");
        return {
          code: 0,
          data: eth_balance
        }
      } catch (err) {
        console.log(err)
        return {
          code: -1,
          data: 0
        }
      }
    }
  }

  _getTransaction = async (web3, hash) => {
    const rawTx = await web3.eth.getTransaction(hash)
    return rawTx
  }

  /**
   * 授权
   * @param {string} poolMark 
   * @param {number} amount 
   * @param {function} stepCall 
   */
  approveToken = async (poolMark, amount, stepCall) => {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];
    const marginInfo = conf.marginInfos[poolMark];

    const web3 = new Web3(this.getWeb3provider());

    const contract = new web3.eth.Contract(marginInfo.abi, marginInfo.address);

    stepCall({
      code: 1,
      msg: '连接合同已完成'
    });

    await contract.methods
      .approve(poolInfo.address, web3.utils.toWei('999999999999', "ether"))
      .send(
        {
          from: addressRes.data,
          to: marginInfo.address,
          gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          gasLimit: 500000
        }
      )

    return {
      code: 0,
      msg: '成功授权'
    }

  }

  /**
    * 根据合约地址查询总量
    * 查询总量 totalSupply() view
    * @param {string} contractAddress 合约地址 asset
    */
  async getTotalSupply(asset, decimals) {
    const web3 = new Web3(this.getWeb3provider());

    const erc20Contract = new web3.eth.Contract(asset.abi, asset.address);
    let balance = await erc20Contract.methods
      .totalSupply()
      .call();

    const dec = decimals ? decimals : asset.decimals;

    // balance = parseFloat(balance) / 10 ** dec;
    balance = web3.utils.toBN(balance).div(web3.utils.toBN(10 ** dec)).toNumber();

    return {
      code: 0,
      data: balance
    }
  }

  /**
    * 根据合约地址查询、我的奖励
    * @param {string} poolMark 
    */
  async _getEarned(poolMark) {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];
    const web3 = new Web3(this.getWeb3provider());
    const contract = new web3.eth.Contract(poolInfo.abi, poolInfo.address);

    const result = await contract.methods
      .earned(this.getDefaultAddress().data)
      .call();

    console.log('根据合约地址查询、我的奖励>>>', result);

    return {
      code: 0,
      data: parseFloat(result) / 10 ** poolInfo.decimals
    };
  }

  /**
  * 根据合约地址、撤出资金池
  * 解压 withdraw(uint256 amount)
  * @param {string} poolMark 
  * @param {number} myNum 查询谁的账户
  * @param {func} stepCall 查询谁的账户 stepCall
  */
  async withdraw(poolMark, myNum, stepCall) {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];
    const marginInfo = conf.marginInfos[poolMark];

    const web3 = new Web3(this.getWeb3provider());

    // erc20 转账
    const contract = new web3.eth.Contract(poolInfo.abi, poolInfo.address); // 合同

    let amountToSend = web3.utils.toWei(myNum, "ether");
    if (marginInfo.decimals !== 18) {
      amountToSend = myNum * 10 ** marginInfo.decimals;
    }

    stepCall({
      code: 1,
      msg: '连接合同已完成'
    });

    const result = await contract.methods.withdraw(amountToSend).send(
      {
        from: addressRes.data,
        to: poolInfo.address,
        gasLimit: 500000,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei')
      }
    )

    return {
      code: 0,
      data: result
    }
  }

  /**
    * 根据合约地址、领取奖励
    * 领取奖励 getReward()
    * @param {string} poolMark
    */
  async getReward(poolMark, stepCall) {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];

    const web3 = new Web3(this.getWeb3provider());

    // erc20 转账
    const contract = new web3.eth.Contract(poolInfo.abi, poolInfo.address); // 合同

    stepCall({
      code: 1,
      msg: '连接合同已完成'
    });

    const result = await contract.methods.getReward().send(
      {
        from: addressRes.data,
        to: poolInfo.address,
        gasLimit: 500000,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei')
      }
    )

    return {
      code: 0,
      data: result
    }
  }

  /**
    * 根据合约地址、退出
    * 领取奖励 exit()
    */
  async exit(poolMark, stepCall) {

    const addressRes = this.getDefaultAddress();

    if (addressRes.code !== 0) {
      return addressRes; // 错误
    }

    const poolInfo = conf.poolInfos[poolMark];

    const web3 = new Web3(this.getWeb3provider());

    // erc20 转账
    const contract = new web3.eth.Contract(poolInfo.abi, poolInfo.address); // 合同

    stepCall({
      code: 1,
      msg: '连接合同已完成'
    });

    const result = await contract.methods.exit().send(
      {
        from: addressRes.data,
        to: poolInfo.address,
        gasLimit: 500000,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei')
      }
    )

    return {
      code: 0,
      data: result
    }

  }

  /**
    * 根据合约地址查询、查询授权金额
    * 查询授权金额 "allowance(address,address)" 我的钱可以谁花
    * @param {string} poolMark 合约地址
    */
  async allowance(poolMark) {

    const addressRes = this.getDefaultAddress();
    if (addressRes.code !== 0) {
      return addressRes;
    }

    const poolInfo = conf.poolInfos[poolMark];
    const marginInfo = conf.marginInfos[poolMark];

    if (!marginInfo.isToken) {
      return {
        code: 0,
        msg: '已授权'
      }
    }

    const web3 = new Web3(this.getWeb3provider());
    const erc20Contract = new web3.eth.Contract(marginInfo.abi, marginInfo.address);

    const allowance = await erc20Contract.methods
      .allowance(addressRes.data, poolInfo.address)
      .call({ from: addressRes.data });

    let ethAllowance = web3.utils.fromWei(allowance, "ether");
    if (marginInfo.decimals !== 18) {
      ethAllowance = allowance / (10 ** marginInfo.decimals);
    }

    return {
      code: 0,
      data: ethAllowance
    };
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if (priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return this.store.universalGasPrice;
    } catch (err) {
      console.error(err);
      return this.store.universalGasPrice;
    }
  }

  _getWeb3Provider = async () => {

    const web3context = this.store.web3context;

    if (!web3context) {
      return null
    }

    const provider = web3context.library.provider
    if (!provider) {
      return null
    }

    const web3 = new Web3(provider);

    return web3
  }
}

export default new EthWallet();
