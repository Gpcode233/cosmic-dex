const { ethers } = require("hardhat");

async function main() {
  // Deploy two mock tokens
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const tokenA = await ERC20Mock.deploy("TokenA", "TKA", ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();
  const tokenB = await ERC20Mock.deploy("TokenB", "TKB", ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();

  // Deploy the DEX pair contract
  const SimpleDexPair = await ethers.getContractFactory("SimpleDexPair");
  const dexPair = await SimpleDexPair.deploy(await tokenA.getAddress(), await tokenB.getAddress());
  await dexPair.waitForDeployment();

  console.log("TokenA deployed to:", await tokenA.getAddress());
  console.log("TokenB deployed to:", await tokenB.getAddress());
  console.log("SimpleDexPair deployed to:", await dexPair.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 