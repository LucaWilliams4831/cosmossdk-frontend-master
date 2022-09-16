import { ChainGetter, ObservableChainQuery } from "@keplr-wallet/stores";
import { EpochProvisions } from "./types";
import { KVStore } from "@keplr-wallet/common";
import { computed, makeObservable } from "mobx";
import { CoinPretty, Dec } from "@keplr-wallet/unit";
import { ObservableQueryMintParmas } from "./params";

export class ObservableQueryEpochProvisions extends ObservableChainQuery<EpochProvisions> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected readonly queryMintParmas: ObservableQueryMintParmas
  ) {
    super(
      kvStore,
      chainId,
      chainGetter,
      `/osmosis/mint/v1beta1/epoch_provisions`
    );

    makeObservable(this);
  }

  @computed
  get epochProvisions(): CoinPretty | undefined {
    if (!this.response || !this.queryMintParmas.mintDenom) {
      return;
    }

    const chainInfo = this.chainGetter.getChain(this.chainId);
    const currency = chainInfo.findCurrency(this.queryMintParmas.mintDenom);
    if (!currency) {
      throw new Error("Unknown currency");
    }

    return new CoinPretty(
      currency,
      new Dec(this.response.data.epoch_provisions)
    );
  }
}
