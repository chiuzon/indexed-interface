import { BURN_ROUTER_ADDRESS, MINT_ROUTER_ADDRESS, MULTI_TOKEN_STAKING_ADDRESS, UNISWAP_ROUTER_ADDRESS } from "config";

import { ContractTypeLookup, InterfaceKind, getContract } from "ethereum";

import { useSigner } from "features";

export function useContractWithSigner<T extends InterfaceKind>(address: string, name: T): ContractTypeLookup[T] | undefined {
  const signer = useSigner();
  if (signer && address) {
    return getContract(address, name, signer);
  }
}

export function useTokenContract(address: string) {
	return useContractWithSigner(address, "IERC20");
}

export function useIIndexedUniswapV2OracleContract(address: string) {
	return useContractWithSigner(address, "IIndexedUniswapV2Oracle");
}

export function useBurnRouterContract() {
	return useContractWithSigner(BURN_ROUTER_ADDRESS, "IndexedUniswapRouterBurner");
}

export function useMintRouterContract() {
	return useContractWithSigner(MINT_ROUTER_ADDRESS, "IndexedUniswapRouterMinter");
}

export function useIndexPoolContract(address: string) {
	return useContractWithSigner(address, "IPool");
}

export function useIPoolInitializerContract(address: string) {
	return useContractWithSigner(address, "IPoolInitializer");
}

export function useMultiCall2Contract(address: string) {
	return useContractWithSigner(address, "MultiCall2");
}

export function useMultiTokenStakingContract() {
	return useContractWithSigner(MULTI_TOKEN_STAKING_ADDRESS, "MultiTokenStaking");
}

export function usePairContract(address: string) {
	return useContractWithSigner(address, "Pair");
}

export function useRewardsScheduleContract(address: string) {
	return useContractWithSigner(address, "RewardsSchedule");
}

export function useStakingRewardsContract(address: string) {
	return useContractWithSigner(address, "StakingRewards");
}

export function useStakingRewardsFactoryContract(address: string) {
	return useContractWithSigner(address, "StakingRewardsFactory");
}

export function useUniswapRouterContract() {
	return useContractWithSigner(UNISWAP_ROUTER_ADDRESS, "UniswapV2Router");
}