import { ChainGetter } from "@keplr-wallet/stores";
import { ObservableQuerySuperfluidParams } from "../superfluid-pools/params";
import { ObservableQuerySuperfluidAssetMultiplier } from "../superfluid-pools/asset-multiplier";
import { CoinPretty, Dec, DecUtils } from "@keplr-wallet/unit";
import { AppCurrency } from "@keplr-wallet/types";
import { computedFn } from "mobx-utils";
import { ObservableQueryPools } from "../pools";

export class ObservableQuerySuperfluidOsmoEquivalent {
  constructor(
    protected readonly chainId: string,
    protected readonly chainGetter: ChainGetter,
    protected readonly _querySuperfluidParams: ObservableQuerySuperfluidParams,
    protected readonly _querySuperfluidAssetMultiplier: ObservableQuerySuperfluidAssetMultiplier,
    protected readonly _queryPools: ObservableQueryPools
  ) {}

  readonly calculateOsmoEquivalent = computedFn(
    (coinPretty: CoinPretty): CoinPretty => {
      const multiplier = this.calculateOsmoEquivalentMultiplier(
        coinPretty.currency
      );

      const stakeCurrency = this.chainGetter.getChain(
        this.chainId
      ).stakeCurrency;

      return new CoinPretty(
        stakeCurrency,
        coinPretty
          .mul(multiplier)
          .mul(DecUtils.getTenExponentN(stakeCurrency.coinDecimals))
      );
    }
  );

  readonly calculateOsmoEquivalentMultiplier = computedFn(
    (currency: AppCurrency): Dec => {
      const minimumRiskFactor = this._querySuperfluidParams.minimumRiskFactor;
      const assetMultiplier = this._querySuperfluidAssetMultiplier.getDenom(
        currency.coinMinimalDenom
      ).multiplier;

      const osmoCurrency = this.chainGetter.getChain(
        this.chainId
      ).stakeCurrency;

      const multipication = DecUtils.getTenExponentN(
        currency.coinDecimals - osmoCurrency.coinDecimals
      );

      return assetMultiplier
        .mul(new Dec(1).sub(minimumRiskFactor))
        .mul(multipication);
    }
  );

  /**
   * Estimate the multiplication value to compute the superfluid's APR. We assume that arbitrage trading is going well, not the exact value on the current chain, and estimate only by looking at the pool weight.
   */
  readonly estimatePoolAPROsmoEquivalentMultiplier = computedFn(
    (poolId: string): Dec => {
      const pool = this._queryPools.getPool(poolId);
      if (pool) {
        const osmoCurrency = this.chainGetter.getChain(
          this.chainId
        ).stakeCurrency;

        const poolAsset = pool.poolAssets.find(
          (asset) =>
            asset.amount.currency.coinMinimalDenom ===
            osmoCurrency.coinMinimalDenom
        );
        if (poolAsset && pool.totalWeight.toDec().gt(new Dec(0))) {
          const ratio = poolAsset.weight.quo(pool.totalWeight);

          const minimumRiskFactor =
            this._querySuperfluidParams.minimumRiskFactor;

          return ratio.toDec().mul(new Dec(1).sub(minimumRiskFactor));
        }
      }
      return new Dec(0);
    }
  );
}
