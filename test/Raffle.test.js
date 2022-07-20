const { assert, expect } = require('chai');
const { network, getNamedAccounts, deployments, ethers } = require('hardhat');
const {
  networkConfig,
  developmentChains,
} = require('../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffel Unit Test', async () => {
      let raffle, vrfCoordinatorV2Mock, entranceFee, deployer, interval;
      const chainId = network.config.chainId;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
        entranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });
      describe('Constructor', async () => {
        it('Initalizes the raffle correctly', async () => {
          const raffleState = await raffle.getRaffleState();
          const getPlayersLength = await raffle.getNumberOfPlayers();
          const interval = await raffle.getInterval();
          assert.equal(raffleState.toString(), '0');
          assert.equal(getPlayersLength.toString(), '0');
          assert.equal(interval.toString(), networkConfig[chainId]['interval']);
        });
      });
      describe('Enter Raffle', async () => {
        it('Reverts when you do not pay engough', async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            'Raffle__NotEnoughEth'
          );
        });
        it('Record player when they enter', async () => {
          await raffle.enterRaffle({ value: entranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert(playerFromContract, deployer);
        });
        it('Emit events on enter', async () => {
          await expect(raffle.enterRaffle({ value: entranceFee })).to.emit(
            raffle,
            'RaffleEnter'
          );
        });
        it('Does not allow entrance when raffle is calculating', async () => {
          await raffle.enterRaffle({ value: entranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          await raffle.performUpkeep([]);
          await expect(
            raffle.enterRaffle({ value: entranceFee })
          ).to.be.revertedWith('Raffle__NotOpen');
        });
      });
      describe('CheckUpKeep', async () => {
        it('returns false if people have not sent any ETH', async () => {
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });
      });
      describe('PerformUpKeep', () => {
        it('it can only run if checkuokeep is true', async () => {
          await raffle.enterRaffle({ value: entranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          const tx = await raffle.performUpkeep([]);
          assert(tx); 
        });
        it('Reverts when checkupkeep is false', async () => {
            await expect(raffle.performUpkeep([])).to.be.revertedWith('Raffle__upkeepFailed')
        })
        it('Check if the performUpKeep ic calculating and emit and event and call the VRFCoor', async()=> {
            await raffle.enterRaffle({ value: entranceFee });
            await network.provider.send('evm_increaseTime', [
              interval.toNumber() + 1,
            ]);
            await network.provider.send('evm_mine', []);
            const res = await raffle.performUpkeep([])
            const receipt = await res.wait(1)
            const id = receipt.events[1].requestId
            const raffleState = await raffle.getRaffleState()
            assert(id.toNumber() > 0)
            assert(raffleState.toString() == '1')
        })
      });
    //   describe('FulfilRandom Words', () => {
    //     beforeEach(async ()=> {
    //         await raffle.enterRaffle({value:entranceFee})
    //         await network.provider.send('evm_increaseTime', [
    //             interval.toNumber() + 1,
    //           ]);
    //           await network.provider.send('evm_mine', []);
    //     })
    //   })
    it('Picks a winner, resets the lottery and sends money', async ()=> {
        
    })
    });
