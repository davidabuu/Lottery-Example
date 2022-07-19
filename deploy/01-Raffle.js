const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config');
const { verify } = require('../hardhat.config');
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let vrfCoordinatorV2Address, subId;
  const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther('30');
  const chainId = network.config.chainId;
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subId = transactionReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subId, VRF_SUB_FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordintorV2'];
    subId = networkConfig[chainId]['subscriptionId'];
  }
  const entranceFee = networkConfig[chainId]['entranceFee'];
  const gasLane = networkConfig[chainId]['gasLane'];
  const callbackGasLimit = networkConfig[chainId]['callbackGasLimit'];
  const interval = networkConfig[chainId]['interval'];
  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subId,
    callbackGasLimit,
    interval,
  ];
  const raffle = await deploy('Raffle', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations,
  });
  if (!developmentChains.includes(network.name) && process.env.API_URL_KEY) {
    log('Verfying')
    await verify(raffle.address, args);
  }
  log('-----------------------------------')
};
module.exports.tags = ['all', 'raffle']