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

const DEFAULT_EXECUTION_BOUNTY_PERCENTAGE = 5_000;

describe("SubsCrypt", function () {
  async function deploySubsCrypt() {
    const [owner, serviceProvider, user] = await hre.viem.getWalletClients();
    const subsCryptMarketplace = await hre.viem.deployContract(
      "SubsCryptMarketplace",
      [owner.account.address, DEFAULT_EXECUTION_BOUNTY_PERCENTAGE]
    );
    // TODO: check proover deployment
    // TODO: check user deployment delegation
    //const subsScryptSmartAccount = await hre.viem.deployContract(
    //  "SubsCryptSmartAccountDelegate",
    //  [subsCryptMarketplace.address]
    //);

    const publicClient = await hre.viem.getPublicClient();

    return {
      subsCryptMarketplace,
      publicClient,
      owner,
      serviceProvider,
      user,
    };
  }

  describe("Deployment", function () {
    it("SubsCrypt contracts should be deployed properly", async function () {
      const {
        subsCryptMarketplace,
        //  subsScryptSmartAccount,
        publicClient,
        owner,
        serviceProvider,
        user,
      } = await loadFixture(deploySubsCrypt);

      expect(await subsCryptMarketplace.read.owner()).to.be.equal(
        getAddress(owner.account.address)
      );
      // TODO Assert deployment
    });
  });

  it("Service providers should be able to register a service", async function () {
    const {
      subsCryptMarketplace,
      //  subsScryptSmartAccount,
      publicClient,
      owner,
      serviceProvider,
      user,
    } = await loadFixture(deploySubsCrypt);

     
    // TODO Assert deployment
  });

  describe("DUMMY", function () {
    it("DUMMY", async function () {
      // TODO
    });
  });
});
