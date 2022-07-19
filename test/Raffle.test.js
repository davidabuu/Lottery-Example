const { assert } = require('chai');
const { network, getNamedAccounts, deployments, ethers } = require('hardhat');
const { networkConfig, developmentChains } = require('../helper-hardhat-config');

!developmentChains.includes(network.name) ? describe.skip : describe('Raffel Unit Test', async() => {
    let raffle, vrfCoordinatorV2Mock
    const chainId = network.config.chainId
    beforeEach((async () => {
        const {deployer} = await getNamedAccounts()
        await deployments.fixture(['all'])
        raffle = await ethers.getContract('Raffle', deployer) 
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock', deployer)
    }))
    describe('Constructor', async () => {
        it('Initalizes the raffle correctly', async () => {
            const raffleState = await raffle.getRaffleState()
            const getPlayersLength = await raffle.getNumberOfPlayers();
            const interval = await raffle.getInterval();
            assert.equal(raffleState.toString(), '0')
            assert.equal(getPlayersLength.toString(), '0')
            assert.equal(interval.toString(), networkConfig[chainId]['interval'])
        })
    })
})