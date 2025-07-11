const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleDexPair", function () {
  let tokenA, tokenB, dexPair, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    tokenA = await ERC20Mock.deploy("TokenA", "TKA", ethers.parseEther("1000000"));
    await tokenA.waitForDeployment();
    tokenB = await ERC20Mock.deploy("TokenB", "TKB", ethers.parseEther("1000000"));
    await tokenB.waitForDeployment();
    const SimpleDexPair = await ethers.getContractFactory("SimpleDexPair");
    dexPair = await SimpleDexPair.deploy(await tokenA.getAddress(), await tokenB.getAddress());
    await dexPair.waitForDeployment();
  });

  it("should add liquidity", async function () {
    await tokenA.approve(await dexPair.getAddress(), ethers.parseEther("1000"));
    await tokenB.approve(await dexPair.getAddress(), ethers.parseEther("1000"));
    await expect(dexPair.addLiquidity(ethers.parseEther("1000"), ethers.parseEther("1000")))
      .to.emit(dexPair, "LiquidityAdded");
    const [res0, res1] = await dexPair.getReserves();
    expect(res0).to.equal(ethers.parseEther("1000"));
    expect(res1).to.equal(ethers.parseEther("1000"));
  });

  it("should swap token0 for token1", async function () {
    await tokenA.approve(await dexPair.getAddress(), ethers.parseEther("1000"));
    await tokenB.approve(await dexPair.getAddress(), ethers.parseEther("1000"));
    await dexPair.addLiquidity(ethers.parseEther("1000"), ethers.parseEther("1000"));
    await tokenA.transfer(addr1.address, ethers.parseEther("100"));
    await tokenA.connect(addr1).approve(await dexPair.getAddress(), ethers.parseEther("100"));
    await expect(dexPair.connect(addr1).swapToken0ForToken1(ethers.parseEther("100")))
      .to.emit(dexPair, "Swapped");
    const [res0, res1] = await dexPair.getReserves();
    expect(res0).to.be.above(ethers.parseEther("1000"));
    expect(res1).to.be.below(ethers.parseEther("1000"));
  });
}); 