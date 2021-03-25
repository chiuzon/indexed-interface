import { DEFAULT_DECIMAL_COUNT } from "config";
import { NormalizedPool } from "ethereum";
import { adapter } from "./slice";
import { categoriesSelectors } from "../categories";
import { convert } from "helpers";
import { createSelector } from "reselect";
import { tokensSelectors } from "features/tokens";
import S from "string";
import type { AppState } from "features/store";

function formatName(from: string) {
  return S(from).camelize().s.toLowerCase();
}

const baseSelectors = {
  ...adapter.getSelectors((state: AppState) => state.indexPools),
};

const selectAllPools = (state: AppState) => baseSelectors.selectAll(state);

const selectPool = (state: AppState, poolId: string) =>
  baseSelectors.selectById(state, poolId);

const selectAllPoolIds = (state: AppState) => baseSelectors.selectIds(state);

const selectNameForPool = (state: AppState, poolId: string) => {
  const pool = selectPool(state, poolId);
  return pool ? formatName(pool.name) : "";
};

const selectPoolLookUpByName = createSelector([selectAllPools], (pools) => {
  const formatName = (from: string) => S(from).camelize().s.toLowerCase();
  return pools.reduce((prev, next) => {
    prev[formatName(next.name)] = next;
    return prev;
  }, {} as Record<string, NormalizedPool>);
});

/**
 * @returns undefined if no pools are loaded yet;
 * pool ID if a pool is found for the provided name;
 * empty string if no pool is found for the provided name
 */
const selectPoolIdByName = (state: AppState, name: string) => {
  const poolsByName = selectPoolLookUpByName(state);
  if (Object.keys(poolsByName).length === 0) {
    return undefined;
  }
  const formattedName = formatName(name);
  const pool = poolsByName[formattedName];
  if (pool) {
    return pool.id;
  }
  return "";
};

const selectPoolByName = (state: AppState, name: string) => {
  const poolsByName = selectPoolLookUpByName(state);
  const formattedName = formatName(name);

  return poolsByName[formattedName] ?? null;
};

const selectPoolLookup = (state: AppState) =>
  baseSelectors.selectEntities(state);

const selectPoolTokenIds = (state: AppState, poolId: string) => {
  const pool = selectPool(state, poolId);
  return pool?.tokens.ids ?? [];
};

const selectPoolTokenSymbols = (state: AppState, poolId: string) => {
  const tokenIds = selectPoolTokenIds(state, poolId);
  const tokenLookup = tokensSelectors.selectEntities(state);
  const symbols = tokenIds.map((id) => tokenLookup[id]?.symbol ?? "");

  return symbols;
};

const selectSwapFee = (state: AppState, poolId: string) => {
  const pool = selectPool(state, poolId);
  return pool ? convert.toBigNumber(pool.swapFee) : null;
};

const selectFormattedSwapFee = (state: AppState, poolId: string) => {
  const fee = selectSwapFee(state, poolId);

  return fee ? convert.toPercent(parseFloat(convert.toBalance(fee))) : "";
};

const selectPoolInitializerAddress = (state: AppState, poolId: string) => {
  const pool = selectPool(state, poolId);
  return pool?.poolInitializer?.id ?? null;
};

const selectCategoryImage = (state: AppState, poolId: string) => {
  const pool = selectPool(state, poolId);

  if (pool) {
    const { id } = pool.category;
    const categoryLookup = categoriesSelectors.selectEntities(state);
    const category = categoryLookup[id];

    return category?.symbol ?? "";
  } else {
    return "";
  }
};

const selectCategoryImagesByPoolIds = (state: AppState) =>
  selectAllPools(state)
    .map((pool) => ({
      id: pool.id,
      image: selectCategoryImage(state, pool.id),
    }))
    .reduce((prev, next) => {
      prev[next.id] = next.image;
      return prev;
    }, {} as Record<string, string>);

const selectPoolTokenEntities = (state: AppState, poolId: string) =>
  state.indexPools.entities[poolId.toLowerCase()]?.tokens.entities;

const selectPoolUnderlyingTokens = createSelector(
  [selectPoolTokenEntities],
  (tokens) => (tokens ? Object.values(tokens) : [])
);

const selectPoolTokenAddresses = (state: AppState, poolId: string) =>
  state.indexPools.entities[poolId.toString()]?.tokens.ids ?? [];

const selectTokenWeights = (
  state: AppState,
  poolId: string,
  tokenIds: string[]
) => {
  const pool = selectPool(state, poolId);
  const weights = tokenIds.reduce((prev, next) => {
    prev[next] = "";
    return prev;
  }, {} as Record<string, string>);

  try {
    if (pool) {
      for (const tokenId of tokenIds) {
        const denorm = convert.toBigNumber(
          pool.tokens.entities[tokenId].denorm
        );
        const totalWeight = convert.toBigNumber(pool.totalWeight);
        const prescaled = denorm.dividedBy(totalWeight);
        const scalePower = convert.toBigNumber(
          DEFAULT_DECIMAL_COUNT.toString()
        );
        const scaleMultiplier = convert.toBigNumber("10").pow(scalePower);
        const weight = prescaled.multipliedBy(scaleMultiplier);

        weights[tokenId] = weight.toString();
      }
    }
  } catch {}

  return weights;
};

const selectors = {
  ...baseSelectors,
  selectAllPools,
  selectPool,
  selectAllPoolIds,
  selectNameForPool,
  selectPoolLookUpByName,
  selectPoolIdByName,
  selectPoolByName,
  selectPoolLookup,
  selectPoolTokenIds,
  selectPoolTokenSymbols,
  selectSwapFee,
  selectFormattedSwapFee,
  selectPoolInitializerAddress,
  selectCategoryImage,
  selectCategoryImagesByPoolIds,
  selectPoolUnderlyingTokens,
  selectPoolTokenAddresses,
  selectTokenWeights,
};

export default selectors;
