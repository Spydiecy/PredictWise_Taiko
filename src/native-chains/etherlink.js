import { defineChain } from "thirdweb/chains";

/**
 * @chain
 */
export const etherlink_testnet = /*@__PURE__*/ defineChain({
  id: 167009,
  name: "Taiko Testnet",
  rpc: "https://rpc.hekla.taiko.xyz/",
  nativeCurrency: { name: "Taiko", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Taiko Testnet explorer",
      url: "hekla.taikoscan.network",
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