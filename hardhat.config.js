require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('dotenv').config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 const ETHERSCAN_API_KEY = process.env.API_URL_KEY;
 const PRIVATE_KEY = process.env.PRIVATE_KEY
 const RPC_URL = process.env.RPC_URL;
module.exports = {
  defaultNetwork:'hardhat',
  networks:{
    hardhat:{
      chainId:31337,
      blockConfirmations:1,
    },
    rinkeby:{
      chainId:4,
      blockConfirmations:6,
      url:RPC_URL,
      accounts:[PRIVATE_KEY]
    }
  },
  solidity: '0.8.7',
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};
