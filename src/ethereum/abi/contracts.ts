import type {
	IERC20,
	IIndexedUniswapV2Oracle,
	IPool,
	IPoolInitializer,
	IndexedNarwhalRouter,
	IndexedUniswapRouterBurner,
	IndexedUniswapRouterMinter,
	MasterChef,
	MultiCall2,
	MultiTokenStaking,
	Pair,
	RewardsSchedule,
	StakingRewards,
	StakingRewardsFactory,
	UniswapV2Router,
} from "./types";

import { Contract } from "@ethersproject/contracts";

import { InterfaceKind, interfaceLookup } from "./interfaces";

import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";

export type ContractTypeLookup = {
	IERC20: IERC20,
	IIndexedUniswapV2Oracle: IIndexedUniswapV2Oracle,
	IndexedNarwhalRouter: IndexedNarwhalRouter,
	IndexedUniswapRouterBurner: IndexedUniswapRouterBurner,
	IndexedUniswapRouterMinter: IndexedUniswapRouterMinter,
	IPool: IPool,
	IPoolInitializer: IPoolInitializer,
	MasterChef: MasterChef,
	MultiCall2: MultiCall2,
	MultiTokenStaking: MultiTokenStaking,
	Pair: Pair,
	RewardsSchedule: RewardsSchedule,
	StakingRewards: StakingRewards,
	StakingRewardsFactory: StakingRewardsFactory,
	UniswapV2Router: UniswapV2Router,
}

export function getContract<K extends InterfaceKind>(
  address: string,
  name: K,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner
): ContractTypeLookup[K] {
  // Cast to any because the return type is more specific than Contract
  return new Contract(address, interfaceLookup[name], signerOrProvider) as any;
}