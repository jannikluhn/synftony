require('dotenv').config()

require("@nomiclabs/hardhat-ethers");
const { ethers } = require('ethers');

task("deploy", "Deploy the contract")
  .addParam("price", "The bar price in xDai")
  .setAction(async (args) => {
    const signer = new ethers.Wallet(process.env.DEPLOY_KEY, hre.ethers.provider);
    const factory = await hre.ethers.getContractFactory("Synftony", signer);
    const price = ethers.utils.parseEther(args.price);
    const contract = await factory.deploy(price);
    console.log("Deploy tx:", contract.deployTransaction.hash);
    await contract.deployed();
    console.log("Contract adddress:", contract.address);
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.3",
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },

  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/cb47771bf3324acc895994de6752654b",
      accounts: [
      ],
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      accounts: [
      ],
    },
  },
};