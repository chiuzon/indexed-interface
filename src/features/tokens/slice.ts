import { COMMON_BASE_TOKENS } from "config";
import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { createMulticallDataParser } from "helpers";
import { fetchInitialData, fetchVaultsData } from "../requests"; // Circular dependency.
import { fetchMulticallData } from "../batcher/requests";
import { fetchTokenPriceData } from "./requests";
import { mirroredServerState, restartedDueToError } from "../actions";
import { pairsActions } from "../pairs";
import type { NormalizedToken } from "./types";

export const tokensAdapter = createEntityAdapter<NormalizedToken>({
  selectId: (entry) => entry.id.toLowerCase(),
});

type TokenLike = {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
};

const slice = createSlice({
  name: "tokens",
  initialState: tokensAdapter.getInitialState(),
  reducers: {
    totalSuppliesUpdated(
      state,
      action: PayloadAction<Array<{ token: string; totalSupply: string }>>
    ) {
      for (const { token, totalSupply } of action.payload) {
        const entity = state.entities[token.toLowerCase()];

        if (entity) {
          entity.totalSupply = totalSupply;
        }
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchMulticallData.fulfilled, (state, action) => {
        const relevantMulticallData = totalSuppliesMulticallDataParser(
          action.payload
        );

        if (relevantMulticallData) {
          for (const [tokenAddress, result] of Object.entries(
            relevantMulticallData
          )) {
            const entry = state.entities[tokenAddress];

            if (entry) {
              if (result) entry.totalSupply = result;
            }
          }
        }

        return state;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        if (action.payload) {
          const { tokens } = action.payload;
          const fullTokens = tokens.ids.map((id) => tokens.entities[id]);

          for (const commonToken of COMMON_BASE_TOKENS) {
            if (!tokens.entities[commonToken.id.toLowerCase()]) {
              fullTokens.push({
                ...commonToken,
                id: commonToken.id.toLowerCase(),
              });
            }
          }

          tokensAdapter.upsertMany(state, fullTokens);
        }
      })
      .addCase(fetchVaultsData.fulfilled, (state, action) => {
        const newTokens: NormalizedToken[] = [];
        if (action.payload) {
          const vaults = action.payload;
          const tokenLike: TokenLike[] = [
            ...vaults,
            ...(vaults.reduce((arr, v) => ([
              ...arr,
              ...v.adapters.map(a => a.underlying),
              ...v.adapters.map(a => a.wrapper),
            ]), [] as TokenLike[]))
          ].map(({ id, name, symbol, decimals }) => ({ id, name, symbol, decimals }));
          for (const token of tokenLike) {
            if (!state.entities[token.id.toLowerCase()]) {
              newTokens.push(token)
            }
          }
          tokensAdapter.upsertMany(state, newTokens)
        }
      })
      .addCase(fetchTokenPriceData.fulfilled, (state, action) => {
        if (action.payload) {
          for (const [address, value] of Object.entries(action.payload)) {
            if (value) {
              const { price, change24Hours, percentChange24Hours } = value;
              const entry = state.entities[address.toLowerCase()];

              if (entry) {
                state.entities[address.toLowerCase()]!.priceData = {
                  price,
                  change24Hours,
                  percentChange24Hours,
                };
              }
            } else {
              // TODO: Put data here anyway when waiting for data to come in.
            }
          }
        }
      })
      .addCase(pairsActions.uniswapPairsRegistered, (state, action) => {
        for (const pair of action.payload) {
          if (!state.entities[pair.id.toLowerCase()]) {
            let t0 = pair.token0
              ? state.entities[pair.token0.toLowerCase()]?.symbol
              : "";
            if (t0 === "WETH") t0 = "ETH";
            let t1 = pair.token1
              ? state.entities[pair.token1.toLowerCase()]?.symbol
              : "";
            if (t1 === "WETH") t1 = "ETH";
            if (
              pair.id.toLowerCase() ===
              "0x8911fce375a8414b1b578be66ee691a8d2d4dbf7"
            ) {
              t0 = "NDX";
              t1 = "ETH";
            }
            const [symbolPrefix, namePrefix] = pair.sushiswap
              ? ["SUSHI", "Sushiswap"]
              : ["UNIV2", "UniswapV2"];
            const [symbol, name] =
              t0 && t1
                ? [`${t0}-${t1}`, `${namePrefix}:${t0}-${t1}`]
                : [symbolPrefix, `${namePrefix} LP Token`];
            state.ids.push(pair.id.toLowerCase());
            state.entities[pair.id.toLowerCase()] = {
              id: pair.id.toLowerCase(),
              symbol,
              name,
              decimals: 18,
            };
          }
        }
      })
      .addCase(mirroredServerState, (state, action) => {
        // action.payload.tokens
        for (const id of action.payload.tokens.ids) {
          const token: NormalizedToken = action.payload.tokens.entities[id];
          const entry = state.entities[id.toLowerCase()];
          if (entry) {
            if (token.priceData) {
              entry.priceData = {
                ...(entry.priceData || {}),
                ...token.priceData,
              };
            }

            if (token.totalSupply) {
              entry.totalSupply = token.totalSupply;
            }
          } else {
            tokensAdapter.addOne(state, token);
          }
        }
      })
      .addCase(restartedDueToError, () => tokensAdapter.getInitialState()),
});

export const { actions: tokensActions, reducer: tokensReducer } = slice;

// #region Helpers
const totalSuppliesMulticallDataParser = createMulticallDataParser(
  "Total Supplies",
  (calls) => {
    const formattedTotalSupplies = calls.reduce((prev, next) => {
      const [tokenAddress, functions] = next;
      const totalSupplies = functions.totalSupply;

      for (const totalSupply of totalSupplies) {
        if (totalSupply.result) {
          prev[tokenAddress] = totalSupply.result[0];
        }
      }

      return prev;
    }, {} as Record<string, string>);

    return formattedTotalSupplies;
  }
);
// #endregion
