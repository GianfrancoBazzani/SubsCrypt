require("dotenv").config();
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "./tasks";

const accounts = {
  mnemonic: `${process.env.OWNER}`,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts,
    },
    anvil: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      accounts,
    },
  },
};

export default config;
