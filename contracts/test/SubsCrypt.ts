import {
  time,
  loadFixture,
  impersonateAccount,
  setBalance,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";
import { expect } from "chai";
import hre from "hardhat";
import { bigint } from "hardhat/internal/core/params/argumentTypes";
import {
  getAddress,
  parseGwei,
  encodePacked,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  parseEther,
} from "viem";

describe("SubsCrypt", function () {
  async function deploySubsCrypt() {
    const SubsCryptEntryPoint = await hre.viem.deployContract(
      "SubsCryptEntryPoint"
    );
    const subsScryptSmartAccount = await hre.viem.deployContract(
      "SubsCryptSmartAccountDelegate",
      [SubsCryptEntryPoint.address]
    );

    const publicClient = await hre.viem.getPublicClient();
    const [relayer, user] = await hre.viem.getWalletClients();

    return {
      SubsCryptEntryPoint,
      subsScryptSmartAccount,
      publicClient,
      relayer,
      user,
    };
  }

  describe("Deployment", function () {
    it("SubsCrypt contracts should be deployed properly", async function () {
      const {
        SubsCryptEntryPoint,
        subsScryptSmartAccount,
        publicClient,
        relayer,
        user,
      } = await loadFixture(deploySubsCrypt);

      console.log(
        `SubsCryptEntryPoint deployed at: ${getAddress(
          SubsCryptEntryPoint.address
        )}`
      );
      console.log(
        `SubsCryptSmartAccount deployed at: ${getAddress(
          subsScryptSmartAccount.address
        )}`
      );
      // TODO Assert deployment
    });
  });

  describe("DUMMY", function () {
    it("DUMMY", async function () {
      // TODO
    });
  });
});
