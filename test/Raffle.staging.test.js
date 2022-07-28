const { expect, assert } = require('chai');
const { deployments, getNamedAccounts, ethers, network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Stagin Tests', () => {
      let raffle, raffleEntranceFee, deployer;
      const chainId = network.config.chainId;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract('Raffle', deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });
      describe('FulfillRandomWords', () => {
        it('Works with Chainlink Keepers and ChainLink VRF, we get a random winner', async () => {
          //Enter the raffle
          const startingTimeStamp = await raffle.getLatestTimeStamp();
          const accounts = ethers.getSigners();
          await new Promise(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('Winner Picked Event Fired');
            
              try {
                const recenctWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimeStamp()
                await expect(raffle.getPlayer(0)).to.be.reverted
                assert.equal(recenctWinner.toString(), '0')
                assert.equal(raffleState, 0)
                assert.equal(winnerBalance.toString(), winnerStartingBalance.add(raffleEntranceFee).toString())
                assert(endingTimeStamp > startingTimeStamp)
                resolve();
              } catch (error) {
                reject(e);
              }
            });
            await raffle.enterRaffle({ value: raffleEntranceFee });
            const winnerStartingBalance = await accounts[0].getBalance()
          });
        });
      });
    });
