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
const VERIFIER_ADDRESS = "0x0000000000000000000000000000000000000001"

describe("SubsCrypt", function () {
  async function deploySubsCrypt() {
    const [owner, serviceProvider, paymentRecipient, paymentAsset, user] =
      await hre.viem.getWalletClients();
    const subsCryptMarketplace = await hre.viem.deployContract(
      "SubsCryptMarketplace",
      [owner.account.address, DEFAULT_EXECUTION_BOUNTY_PERCENTAGE, VERIFIER_ADDRESS]
    );
    

    const publicClient = await hre.viem.getPublicClient();

    return {
      subsCryptMarketplace,
      publicClient,
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
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
        paymentRecipient,
        paymentAsset,
        user,
      } = await loadFixture(deploySubsCrypt);

      expect(await subsCryptMarketplace.read.owner()).to.be.equal(
        getAddress(owner.account.address)
      );
      expect(await subsCryptMarketplace.read.verifier()).to.be.equal(
        getAddress(VERIFIER_ADDRESS)
      );
      // TODO Assert deployment
    });
  });

  it("Non service providers should't be able to register a service", async function () {
    const {
      subsCryptMarketplace,
      //  subsScryptSmartAccount,
      publicClient,
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      user,
    } = await loadFixture(deploySubsCrypt);

    await expect(
      subsCryptMarketplace.write.registerService(
        [
          {
            serviceProvider: user.account.address,
            paymentRecipient: paymentRecipient.account.address,
            paymentAsset: paymentAsset.account.address,
            assetChainId: 1n, // corrected key name from 'assetChainIs'
            servicePrice: 1000n, // 10%
            paymentInterval: 1n, // ensure BigInt type for paymentInterval
          },
        ],
        {
          account: serviceProvider.account.address,
        }
      )
    ).to.be.rejectedWith("UnauthorizedServiceProvider()");
  });

  it("Service providers should be able to register a service", async function () {
    const {
      subsCryptMarketplace,
      //  subsScryptSmartAccount,
      publicClient,
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      user,
    } = await loadFixture(deploySubsCrypt);

    const serviceCountBefore = await subsCryptMarketplace.read.serviceCount();

    expect(
      await subsCryptMarketplace.read.isServiceAvailable([
        serviceCountBefore + 1n,
      ])
    ).to.be.false;

    const tx = await subsCryptMarketplace.write.registerService(
      [
        {
          serviceProvider: serviceProvider.account.address,
          paymentRecipient: paymentRecipient.account.address,
          paymentAsset: paymentAsset.account.address,
          assetChainId: 1n,
          servicePrice: 1000n,
          paymentInterval: 1n,
        },
      ],
      {
        account: serviceProvider.account.address,
      }
    );

    expect(
      await subsCryptMarketplace.read.isServiceAvailable([
        serviceCountBefore + 1n,
      ])
    ).to.be.true;
  });

    it("Accounts should be initialized", async function () {
      // TODO
    });

  describe("DUMMY", function () {
    it("DUMMY", async function () {
      // TODO
    });
  });
});
