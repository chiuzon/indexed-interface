import { AppState, VAULTS_CALLER, selectors } from "features";
import { RegisteredCall, convert } from "helpers";
import { useCallRegistrar } from "./use-call-registrar";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useAllVaults() {
  const vaults = useSelector(selectors.selectAllVaults);

  return vaults;
}

export function useVaultAPR(id: string) {
  return useSelector((state: AppState) =>
    selectors.selectVaultAPR(state, id)
  );
}

export function useVaultAdapterAPRs(id: string): { name:string; apr:number; }[] {
  const vault = useVault(id)
  return vault?.adapters.reduce(
    (prev, next) => ([
      ...prev,
      {
        name: next.protocol.name,
        apr: next.revenueAPRs?.reduce((t, n) => t + convert.toBalanceNumber(n), 0) ?? 0
      }
    ]),
    [] as { name:string; apr:number; }[]
  ) ?? []
}

export function useVault(id: string) {
  const vault = useSelector((state: AppState) =>
    selectors.selectVault(state, id)
  );

  return vault;
}

export function useVaultDeposit(id: string) {
  // Pass
}

export function useVaultWithdrawal(id: string) {
  // Pass
}

export function useVaultUserBalance(id: string) {
  // Pass
  // Returns { balance: _, value: _ }
}

export function useVaultTvl(id: string) {
  const vault = useVault(id);

  if (vault) {
    // return vault.;
    return "";
  } else {
    return null;
  }
}

export function useVaultTokens(id: string) {
  const vault = useVault(id);

  if (vault) {
    // vault.adapters
  } else {
    return null;
  }
}

export function createVaultCalls(id: string, adapterIds: string[]) {
  const target = id;
  const interfaceKind = "NirnVault";
  const baseCalls: RegisteredCall[] = [
    {
      interfaceKind,
      target,
      function: "balance",
    },
    {
      interfaceKind,
      target,
      function: "getPricePerFullShareWithFee",
    },
    {
      interfaceKind: "IERC20",
      target,
      function: "totalSupply",
    }
  ];
  const adapterCalls = adapterIds.reduce((prev, next) => {
    prev.push({
      interfaceKind: "Erc20Adapter",
      target: next,
      function: "getRevenueBreakdown",
    });

    prev.push();

    return prev;
  }, [] as RegisteredCall[]);

  // TheGraph calls go here as off-chain calls.
  return {
    onChainCalls: [...baseCalls, ...adapterCalls],
    offChainCalls: [],
  };
}

export function useVaultRegistrar(id: string) {
  const vault = useVault(id);
  const caller = VAULTS_CALLER;
  const { onChainCalls, offChainCalls } = useMemo(
    () =>
      id
        ? createVaultCalls(
            id,
            vault!.adapters.map((each) => each.id)
          )
        : {
            onChainCalls: [],
            offChainCalls: [],
          },
    [id, vault]
  );

  useCallRegistrar({
    caller,
    onChainCalls,
    offChainCalls,
  });
}


export function useAllVaultsRegistrar() {
  const vaults = useAllVaults()
  const caller = VAULTS_CALLER;
  const { onChainCalls, offChainCalls } = useMemo(
    () =>
    vaults.reduce((prev, next) => {
      const {onChainCalls, offChainCalls} = createVaultCalls(
        next.id,
        next.adapters.map(a => a.id)
      )
      prev.onChainCalls.push(...onChainCalls)
      prev.offChainCalls.push(...offChainCalls)
      return prev
    }, {
      onChainCalls: [] as RegisteredCall[],
      offChainCalls: [] as RegisteredCall[],
    }),
    [vaults]
  );

  useCallRegistrar({
    caller,
    onChainCalls,
    offChainCalls,
  });
}