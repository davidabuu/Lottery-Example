const { deployments, getNamedAccounts, ethers, network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
developmentChains.includes(network.name) ? describe.skip: 
describe('Raffle Stagin Tests', () => {
  let raffle, enterRaffle, deployer, interval;
  const chainId = network.config.chainid;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture('all');
    raffle = await ethers.getContract('Raffle', deployer);
  });
});
