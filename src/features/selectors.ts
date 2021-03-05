import { AppState } from "./store";
import { NormalizedPool } from "ethereum";
import { categoriesSelectors } from "./categories";
import { convert } from "helpers";
import { dailySnapshotsSelectors } from "./dailySnapshots";
import { formatDistance } from "date-fns";
import { indexPoolsSelectors } from "./indexPools";
import { settingsSelectors } from "./settings";
import { tokensSelectors } from "./tokens";

const MILLISECONDS_PER_SECOND = 1000;

type ModelKeys = "categories" | "indexPools" | "tokens";

const selectors = {
  ...categoriesSelectors,
  ...dailySnapshotsSelectors,
  ...indexPoolsSelectors,
  ...settingsSelectors,
  ...tokensSelectors,
  /**
   *
   * @param state -
   */
  selectMenuModels: (
    state: AppState
  ): Record<ModelKeys, Array<{ name: string; id: string }>> => {
    const categories = selectors
      .selectAllCategories(state)
      .map(({ id, name }) => ({
        name,
        id,
      }));
    const indexPools = selectors
      .selectAllPools(state)
      .map(({ name, id }) => ({ name: name.replace(/Tokens Index/g, ""), id }));
    const tokens = selectors.selectAppMenuTokens(state);

    return {
      categories,
      indexPools,
      tokens,
    };
  },
  /**
   *
   * @param state -
   * @param poolId -
   */
  selectFormattedCategory: (state: AppState, categoryId: string) => {
    const category = selectors.selectCategory(state, categoryId);
    const indexPoolLookup = selectors.selectPoolLookup(state);
    const tokenLookup = selectors.selectTokenLookup(state);

    if (category) {
      return {
        id: category.id,
        symbol: category.symbol,
        name: category.name,
        brief: category.brief,
        description: category.description,
        indexPools: category.indexPools
          .map((id) => indexPoolLookup[id])
          .filter(Boolean)
          .map((pool) => {
            const guaranteedPool = pool as NormalizedPool;
            const price = convert.toToken(
              convert
                .toBigNumber(guaranteedPool.totalValueLockedUSD)
                .dividedBy(convert.toBigNumber(guaranteedPool.totalSupply))
            );

            return {
              id: guaranteedPool.id,
              name: guaranteedPool.name,
              symbol: guaranteedPool.symbol,
              size: guaranteedPool.size.toString(),
              price: convert.toCurrency(price.toNumber()),
              supply: convert.toComma(
                parseFloat(convert.toBalance(guaranteedPool.totalSupply))
              ),
              marketCap: convert.toCurrency(guaranteedPool.totalValueLockedUSD),
              swapFee: convert.toPercent(guaranteedPool.swapFee),
              cumulativeFees: convert.toCurrency(guaranteedPool.feesTotalUSD),
              volume: convert.toCurrency(guaranteedPool.totalVolumeUSD),
            };
          }),
        tokens: category.tokens
          .map((id) => tokenLookup[id])
          .filter(Boolean)
          .map((token) => {
            const entry = token!.dataByCategory[categoryId];

            return entry
              ? {
                  name: entry.name,
                  symbol: entry.symbol,
                }
              : {
                  name: "",
                  symbol: "",
                };
          }),
      };
    } else {
      return null;
    }
  },
  /**
   *
   * @param state -
   */
  selectAllFormattedCategories: (state: AppState) => {
    return selectors
      .selectAllCategories(state)
      .map((category) => selectors.selectFormattedCategory(state, category.id))
      .filter(Boolean);
  },
  /**
   *
   * @param state -
   * @param poolId -
   */
  selectFormattedIndexPool: (
    state: AppState,
    poolId: string
  ): null | FormattedIndexPool => {
    const pool = selectors.selectPool(state, poolId);

    if (pool) {
      const tokens = selectors.selectTokenLookup(state);
      const stats = selectors.selectPoolStats(state, poolId);
      const withDisplayedSigns = { signDisplay: "always" };

      return {
        canStake: false,
        id: pool.id,
        symbol: pool.symbol,
        priceUsd: convert.toCurrency(stats.price),
        netChange: convert.toCurrency(
          stats.deltas.price.day.value,
          withDisplayedSigns
        ),
        netChangePercent: convert.toPercent(
          stats.deltas.price.day.percent,
          withDisplayedSigns
        ),
        isNegative: stats.deltas.price.day.value < 0,
        name: pool.name,
        volume: convert.toCurrency(stats.deltas.volume.day),
        totalValueLocked: convert.toCurrency(pool.totalValueLockedUSD),
        totalValueLockedPercent: convert.toPercent(
          stats.deltas.totalValueLockedUSD.day.percent
        ),
        swapFee: convert.toPercent(pool.swapFee),
        cumulativeFee: convert.toCurrency(pool.feesTotalUSD),
        recent: {
          swaps: pool.dataForTradesAndSwaps
            ? pool.dataForTradesAndSwaps.swaps.map((swap) => {
                const from = selectors.selectTokenSymbol(state, swap.tokenIn);
                const to = selectors.selectTokenSymbol(state, swap.tokenOut);
                const [transactionHash] = swap.id.split("-");

                return {
                  when: formatDistance(
                    new Date(swap.timestamp * MILLISECONDS_PER_SECOND),
                    new Date()
                  ),
                  from,
                  to,
                  transactionHash,
                };
              })
            : [],
          trades: pool.dataForTradesAndSwaps
            ? pool.dataForTradesAndSwaps.trades.map((trade) => ({
                when: formatDistance(
                  new Date(parseInt(trade.timestamp) * MILLISECONDS_PER_SECOND),
                  new Date()
                ),
                from: trade.pair.token0.symbol,
                to: trade.pair.token1.symbol,
                amount: convert.toCurrency(parseFloat(trade.amountUSD)),
                kind:
                  trade.pair.token0.symbol.toLowerCase() ===
                  pool.symbol.toLowerCase()
                    ? "sell"
                    : "buy",
                transactionHash: trade.transaction.id,
              }))
            : [],
        },
        assets: pool.tokens
          .map((poolTokenId) => {
            const token = tokens[poolTokenId]!;
            const categoryToken = token.dataByCategory[pool.category.id]!;
            const poolToken = token.dataByIndexPool[pool.id]!;
            const updateData = token.dataFromPoolUpdates;
            const coingeckoData = token.priceData || {};
            const { balance } = poolToken;
            const parsedBalance = parseFloat(balance.replace(/,/g, ""));
            const balanceUsd = coingeckoData.price
              ? convert.toBalance(
                  (coingeckoData.price * parsedBalance).toString()
                )
              : null;
            const tokenWeight =
              updateData && updateData[pool.id] && updateData[pool.id]!.weight;
            const weightPercentage = tokenWeight
              ? convert.toPercent(parseFloat(convert.toBalance(tokenWeight)))
              : "-";

            return {
              symbol: token.symbol,
              name: categoryToken.name,
              balance: convert.toBalance(poolToken.balance),
              balanceUsd,
              price: coingeckoData.price
                ? convert.toCurrency(coingeckoData.price)
                : "-",
              netChange: coingeckoData.change24Hours
                ? convert.toCurrency(
                    coingeckoData.change24Hours,
                    withDisplayedSigns
                  )
                : "-",
              netChangePercent: coingeckoData.percentChange24Hours
                ? convert.toPercent(
                    coingeckoData.percentChange24Hours / 100,
                    withDisplayedSigns
                  )
                : "-",
              isNegative: Boolean(
                coingeckoData.change24Hours && coingeckoData.change24Hours < 0
              ),
              weightPercentage,
            };
          })
          .sort(
            (left, right) =>
              parseFloat(right.weightPercentage) -
              parseFloat(left.weightPercentage)
          ),
      };
    } else {
      return null;
    }
  },
  /**
   *
   * @param state -
   */
  selectAllFormattedIndexPools: (state: AppState) => {
    return selectors
      .selectAllPools(state)
      .map((pool) => selectors.selectFormattedIndexPool(state, pool.id))
      .filter(Boolean);
  },
};

export default selectors;

export interface FormattedCategory {
  id: string;
  symbol: string;
  name: string;
  brief?: string;
  indexPools: Array<{
    name: string;
    symbol: string;
    size: string;
    price: string;
    supply: string;
    marketCap: string;
    swapFee: string;
    cumulativeFees: string;
    volume: string;
  }>;
  tokens: Array<{ name: string; symbol: string }>;
}

export interface FormattedIndexPool {
  canStake: boolean;
  id: string;
  symbol: string;
  priceUsd: string;
  netChange: string;
  netChangePercent: string;
  isNegative: boolean;
  name: string;
  volume: string;
  totalValueLocked: string;
  totalValueLockedPercent: string;
  swapFee: string;
  cumulativeFee: string;
  // chart data
  recent: {
    swaps: Array<{
      when: string;
      from: string;
      to: string;
      transactionHash: string;
    }>;
    trades: Array<{
      kind: "buy" | "sell";
      amount: string;
      when: string;
      from: string;
      to: string;
      transactionHash: string;
    }>;
  };
  assets: Array<{
    symbol: string;
    name: string;
    price: string;
    balance: string;
    balanceUsd: null | string;
    netChange: string;
    netChangePercent: string;
    isNegative: boolean;
    weightPercentage: string;
  }>;
}

export type Swap = FormattedIndexPool["recent"]["swaps"][0];
export type Trade = FormattedIndexPool["recent"]["trades"][0];
export type Asset = FormattedIndexPool["assets"][0];