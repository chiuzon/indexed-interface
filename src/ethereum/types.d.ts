import {
  Category,
  IndexPool,
  PoolUnderlyingToken,
  Swap,
  Token,
} from "indexed-types";
import { Swap as Trade } from "uniswap-types";

export type PoolTokenUpdate = {
  address: string;
  balance: string;
  minimumBalance: string;
  usedBalance: string;
  weight?: string;
  denorm: string;
  usedDenorm: string;
  usedWeight: string;
};

export type PoolUpdate = {
  $blockNumber: string;
  totalDenorm: string;
  totalSupply: string;
  swapFee: string;
  tokens: PoolTokenUpdate[];
};

export type NormalizedEntity<T> = {
  ids: string[];
  entities: Record<string, T>;
};

export interface NormalizedCategory {
  id: string;
  name: string;
  symbol: string;
  brief: string;
  description: string;
  indexPools: string[];
  tokens: {
    ids: string[];
    entities: Record<string, Token>;
  };
}

export interface NormalizedPool
  extends Omit<IndexPool, "dailySnapshots" | "tokens"> {
  dailySnapshots: string[];
  trades: Trade[];
  swaps: Swap[];
  tokens: {
    ids: string[];
    entities: Record<string, PoolTokenUpdate & PoolUnderlyingToken>;
  };
  totalDenorm: string;
  totalSupply: string;
  maxTotalSupply: string;
  swapFee: string;
}

export interface NormalizedPairSide {
  token: string;
  reserves: string;
}

export interface NormalizedPair {
  id: string; // Uniswap pair address
  tokenZero: NormalizedPairSide;
  tokenOne: NormalizedPairSide;
}

export interface NormalizedToken {
  id: string;
  decimals: number;
  name?: string;
  symbol: string;
  coingeckoId: string;
  priceData?: {
    price?: number;
    change24Hours?: number;
    percentChange24Hours?: number;
  };
}

export type NormalizedInitialData = {
  categories: NormalizedEntity<
    Pick<NormalizedCategory, "tokens" | "indexPools">
  >;
  dailySnapshots: NormalizedEntity<NormalizedDailySnapshot>;
  pools: NormalizedEntity<NormalizedPool>;
  tokens: NormalizedEntity<NormalizedToken>;
};

export interface NormalizedUser {
  address: string;
  allowances: Record<
    string /* <poolId>-<tokenId> */,
    string /* Token Balance */
  >;
  balances: Record<string /* <tokenId> */, string /* Token Balance */>;
}
