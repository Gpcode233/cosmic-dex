// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDexPair {
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;

    event LiquidityAdded(address indexed provider, uint amount0, uint amount1);
    event LiquidityRemoved(address indexed provider, uint amount0, uint amount1);
    event Swapped(address indexed user, address tokenIn, uint amountIn, address tokenOut, uint amountOut);

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    // Add liquidity to the pool
    function addLiquidity(uint amount0, uint amount1) external {
        require(amount0 > 0 && amount1 > 0, "Amounts must be > 0");
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        reserve0 += uint112(amount0);
        reserve1 += uint112(amount1);
        emit LiquidityAdded(msg.sender, amount0, amount1);
    }

    // Remove liquidity from the pool
    function removeLiquidity(uint amount0, uint amount1) external {
        require(amount0 <= reserve0 && amount1 <= reserve1, "Insufficient reserves");
        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
        reserve0 -= uint112(amount0);
        reserve1 -= uint112(amount1);
        emit LiquidityRemoved(msg.sender, amount0, amount1);
    }

    // Swap token0 for token1
    function swapToken0ForToken1(uint amountIn) external {
        require(amountIn > 0, "Amount must be > 0");
        uint amountOut = getAmountOut(amountIn, reserve0, reserve1);
        require(amountOut > 0 && amountOut < reserve1, "Insufficient output amount");
        IERC20(token0).transferFrom(msg.sender, address(this), amountIn);
        IERC20(token1).transfer(msg.sender, amountOut);
        reserve0 += uint112(amountIn);
        reserve1 -= uint112(amountOut);
        emit Swapped(msg.sender, token0, amountIn, token1, amountOut);
    }

    // Swap token1 for token0
    function swapToken1ForToken0(uint amountIn) external {
        require(amountIn > 0, "Amount must be > 0");
        uint amountOut = getAmountOut(amountIn, reserve1, reserve0);
        require(amountOut > 0 && amountOut < reserve0, "Insufficient output amount");
        IERC20(token1).transferFrom(msg.sender, address(this), amountIn);
        IERC20(token0).transfer(msg.sender, amountOut);
        reserve1 += uint112(amountIn);
        reserve0 -= uint112(amountOut);
        emit Swapped(msg.sender, token1, amountIn, token0, amountOut);
    }

    // Constant product formula (x * y = k), 0.3% fee
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        uint amountInWithFee = amountIn * 997; // 0.3% fee
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = reserveIn * 1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function getReserves() external view returns (uint112, uint112) {
        return (reserve0, reserve1);
    }
} 