import { defineChain } from "thirdweb/chains";

/**
 * @chain
 */
export const etherlink_testnet = /*@__PURE__*/ defineChain({
  id: 1001,
  name: "Taiko Testnet",
  rpc: "https://kaia-kairos.blockpi.network/v1/rpc/public",
  nativeCurrency: { name: "Taiko", symbol: "KAIA", decimals: 18 },
  blockExplorers: [
    {
      name: "Taiko Testnet explorer",
      url: "https://kairos.kaiascope.com/",
    },
  ],
  testnet: true,
});

export const etherlink_mainnet = /*@__PURE__*/ defineChain({
  id: 42793,
  name: "Etherlink Mainnet",
  rpc: "https://node.mainnet.etherlink.com",
  nativeCurrency: { name: "Etherlink", symbol: "XTZ", decimals: 18 },
  blockExplorers: [
    {
      name: "Etherlink Mainnet beta explorer",
      url: "https://explorer.etherlink.com/",
    },
  ],
  testnet: false,
});