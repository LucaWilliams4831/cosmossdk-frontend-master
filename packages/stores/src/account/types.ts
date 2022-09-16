import { MsgOpt } from "@keplr-wallet/stores";

export interface OsmosisMsgOpts {
  readonly createPool: MsgOpt;
  readonly joinPool: MsgOpt & {
    shareCoinDecimals: number;
  };
  readonly joinSwapExternAmountIn: MsgOpt & {
    shareCoinDecimals: number;
  };
  readonly exitPool: MsgOpt & {
    shareCoinDecimals: number;
  };
  readonly swapExactAmountIn: MsgOpt;
  readonly swapExactAmountOut: MsgOpt;
  readonly lockTokens: MsgOpt;
  readonly superfluidDelegate: MsgOpt;
  readonly lockAndSuperfluidDelegate: MsgOpt;
  readonly beginUnlocking: MsgOpt;
  readonly superfluidUndelegate: MsgOpt;
  readonly superfluidUnbondLock: MsgOpt;
  readonly unlockPeriodLock: MsgOpt;
  readonly unPoolWhitelistedPool: MsgOpt;
}

export const defaultMsgOpts: OsmosisMsgOpts = {
  createPool: {
    type: "osmosis/gamm/create-balancer-pool",
    gas: 350000,
  },
  joinPool: {
    type: "osmosis/gamm/join-pool",
    gas: 240000,
    shareCoinDecimals: 18,
  },
  joinSwapExternAmountIn: {
    type: "osmosis/gamm/join-swap-extern-amount-in",
    gas: 140000,
    shareCoinDecimals: 18,
  },
  exitPool: {
    type: "osmosis/gamm/exit-pool",
    gas: 280000,
    shareCoinDecimals: 18,
  },
  swapExactAmountIn: {
    type: "osmosis/gamm/swap-exact-amount-in",
    gas: 250000,
  },
  swapExactAmountOut: {
    type: "osmosis/gamm/swap-exact-amount-out",
    gas: 250000,
  },
  lockTokens: {
    type: "osmosis/lockup/lock-tokens",
    gas: 450000,
  },
  superfluidDelegate: {
    type: "osmosis/superfluid-delegate",
    gas: 500000,
  },
  lockAndSuperfluidDelegate: {
    type: "osmosis/lock-and-superfluid-delegate",
    gas: 500000,
  },
  beginUnlocking: {
    type: "osmosis/lockup/begin-unlock-period-lock",
    // Gas per msg
    gas: 140000,
  },
  superfluidUndelegate: {
    type: "osmosis/superfluid-undelegate",
    gas: 300000,
  },
  superfluidUnbondLock: {
    type: "osmosis/superfluid-unbond-lock",
    // Gas per msg
    gas: 300000,
  },
  unlockPeriodLock: {
    type: "osmosis/lockup/unlock-period-lock",
    // Gas per msg
    gas: 140000,
  },
  unPoolWhitelistedPool: {
    type: "osmosis/unpool-whitelisted-pool",
    gas: 3000000,
  },
};
