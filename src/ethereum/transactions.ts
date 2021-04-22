import * as balancerMath from "./utils/balancer-math";
import { BigNumber } from "./utils/balancer-math";
import { convert } from "helpers";
import type { NormalizedIndexPool } from "features";

export function calculateGasMargin(value: string): string {
  return convert.toBigNumber(value).times(1.1).integerValue().toString(10);
}

export function calcSwapAmountIn(
  inputToken: PoolTokenData,
  outputToken: PoolTokenData,
  amountOut: BigNumber,
  swapFee: BigNumber
): { error?: string; amountIn?: BigNumber; spotPriceAfter?: BigNumber } {
  const [balanceIn, weightIn, balanceOut, weightOut] = [
    inputToken.usedBalance,
    inputToken.usedDenorm,
    outputToken.usedBalance,
    outputToken.usedDenorm,
  ].map(convert.toBigNumber);

  if (amountOut.isGreaterThan(balanceOut.div(3))) {
    return { error: "Output can not be more than 1/3 of the pool's balance." };
  }
  if (amountOut.eq(0)) {
    return { error: "Input can not be zero." };
  }

  const amountIn = balancerMath.calcInGivenOut(
    balanceIn,
    weightIn,
    balanceOut,
    weightOut,
    amountOut,
    swapFee
  );

  if (amountIn.isGreaterThan(balanceIn.div(2))) {
    return {
      amountIn,
      error: "Input must be less than 1/2 the pool's balance.",
    };
  }

  const spotPriceAfter = balancerMath.calcSpotPrice(
    balanceIn.plus(amountIn),
    weightIn,
    balanceOut.minus(amountOut),
    weightOut,
    swapFee
  );

  return {
    amountIn,
    spotPriceAfter,
  };
}

export function calcSwapAmountOut(
  inputToken: PoolTokenData,
  outputToken: PoolTokenData,
  amountIn: BigNumber,
  swapFee: BigNumber
): { error?: string; amountOut?: BigNumber; spotPriceAfter?: BigNumber } {
  const [balanceIn, weightIn, balanceOut, weightOut] = [
    inputToken.usedBalance,
    inputToken.usedDenorm,
    outputToken.usedBalance,
    outputToken.usedDenorm,
  ].map(convert.toBigNumber);
  if (amountIn.eq(0)) {
    return { error: "Input can not be zero." };
  }
  if (amountIn.isGreaterThan(balanceIn.div(2))) {
    return { error: "Input must be less than 1/2 the pool's balance." };
  }

  const amountOut = balancerMath.calcOutGivenIn(
    balanceIn,
    weightIn,
    balanceOut,
    weightOut,
    amountIn,
    swapFee
  );
  if (amountOut.isGreaterThan(balanceOut.div(3))) {
    return {
      amountOut,
      error: "Output can not be more than 1/3 of the pool's balance.",
    };
  }

  const spotPriceAfter = balancerMath.calcSpotPrice(
    balanceIn.plus(amountIn),
    weightIn,
    balanceOut.minus(amountOut),
    weightOut,
    swapFee
  );

  return {
    amountOut,
    spotPriceAfter,
  };
}

export function calcPoolOutGivenSingleIn(
  pool: NormalizedIndexPool,
  inputToken: PoolTokenData,
  tokenAmountIn: BigNumber
) {
  const [balanceIn, weightIn, totalWeight, totalSupply, swapFee] = [
    inputToken.usedBalance,
    inputToken.usedDenorm,
    pool.totalDenorm,
    pool.totalSupply,
    pool.swapFee,
  ].map(convert.toBigNumber);

  if (tokenAmountIn.eq(0)) {
    return { error: "Input cannot be zero." };
  }
  if (tokenAmountIn.isGreaterThan(balanceIn.div(2))) {
    return { error: "Input must be less than 1/2 the pool's balance." };
  }

  const poolAmountOut = balancerMath._calcPoolOutGivenSingleIn(
    balanceIn,
    weightIn,
    totalSupply,
    totalWeight,
    tokenAmountIn,
    swapFee
  );

  return { poolAmountOut };
}

export function calcSingleInGivenPoolOut(
  pool: NormalizedIndexPool,
  inputToken: PoolTokenData,
  poolAmountOut: BigNumber
) {
  const [balanceIn, weightIn, totalWeight, totalSupply, swapFee] = [
    inputToken.usedBalance,
    inputToken.usedDenorm,
    pool.totalDenorm,
    pool.totalSupply,
    pool.swapFee,
  ].map(convert.toBigNumber);

  if (poolAmountOut.eq(0)) {
    return { error: "Input cannot be zero." };
  }

  const tokenAmountIn = balancerMath._calcSingleInGivenPoolOut(
    balanceIn,
    weightIn,
    totalSupply,
    totalWeight,
    poolAmountOut,
    swapFee
  );
  if (tokenAmountIn.isGreaterThan(balanceIn.div(2))) {
    return {
      error: "Input must be less than 1/2 the pool's balance.",
      tokenAmountIn,
    };
  }
  return { tokenAmountIn };
}

export function calcPoolInGivenSingleOut(
  pool: NormalizedIndexPool,
  outputToken: PoolTokenData,
  tokenAmountOut: BigNumber
) {
  const [balanceOut, weightOut, totalWeight, totalSupply, swapFee] = [
    outputToken.usedBalance,
    outputToken.usedDenorm,
    pool.totalDenorm,
    pool.totalSupply,
    pool.swapFee,
  ].map(convert.toBigNumber);

  if (tokenAmountOut.eq(0)) {
    return { error: "Output cannot be zero." };
  }
  if (tokenAmountOut.isGreaterThan(balanceOut.div(3))) {
    return {
      tokenAmountOut,
      error: "Output must be less than 1/3 the pool's balance.",
    };
  }

  const poolAmountIn = balancerMath._calcPoolInGivenSingleOut(
    balanceOut,
    weightOut,
    totalSupply,
    totalWeight,
    tokenAmountOut,
    swapFee
  );
  return { poolAmountIn };
}

export function calcSingleOutGivenPoolIn(
  pool: NormalizedIndexPool,
  outputToken: PoolTokenData,
  poolAmountIn: BigNumber
) {
  const [balanceOut, weightOut, totalWeight, totalSupply, swapFee] = [
    outputToken.usedBalance,
    outputToken.usedDenorm,
    pool.totalDenorm,
    pool.totalSupply,
    pool.swapFee,
  ].map(convert.toBigNumber);

  if (poolAmountIn.eq(0)) {
    return { error: "Input cannot be zero." };
  }

  const tokenAmountOut = balancerMath._calcSingleOutGivenPoolIn(
    balanceOut,
    weightOut,
    totalSupply,
    totalWeight,
    poolAmountIn,
    swapFee
  );
  if (tokenAmountOut.isGreaterThan(balanceOut.div(3))) {
    return {
      tokenAmountOut,
      error: "Output must be less than 1/3 the pool's balance.",
    };
  }
  return { tokenAmountOut };
}

type PoolTokenData = {
  usedDenorm: string;
  usedBalance: string;
};
