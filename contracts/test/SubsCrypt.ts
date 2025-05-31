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
    const [
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      verifier,
      user,
    ] = await hre.viem.getWalletClients();
    const subsCryptMarketplace = await hre.viem.deployContract(
      "SubsCryptMarketplace",
      [
        owner.account.address,
        DEFAULT_EXECUTION_BOUNTY_PERCENTAGE,
        verifier.account.address,
      ]
    );

    const publicClient = await hre.viem.getPublicClient();

    return {
      subsCryptMarketplace,
      publicClient,
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      verifier,
      user,
    };
  }

  describe("Deployment", function () {
    it("SubsCrypt contracts should be deployed properly", async function () {
      const { subsCryptMarketplace, owner, verifier } = await loadFixture(
        deploySubsCrypt
      );

      expect(await subsCryptMarketplace.read.owner()).to.be.equal(
        getAddress(owner.account.address)
      );
      expect(await subsCryptMarketplace.read.verifier()).to.be.equal(
        getAddress(verifier.account.address)
      );
      expect(
        await subsCryptMarketplace.read.subsCryptSmartAccountDelegate()
      ).not.to.be.equal(getAddress(verifier.account.address));
    });
  });

  it("Non service providers should't be able to register a service", async function () {
    const {
      subsCryptMarketplace,
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
            paymentInterval: 3600n, // ensure BigInt type for paymentInterval
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

    await subsCryptMarketplace.write.registerService(
      [
        {
          serviceProvider: serviceProvider.account.address,
          paymentRecipient: paymentRecipient.account.address,
          paymentAsset: paymentAsset.account.address,
          assetChainId: 1n,
          servicePrice: 1000n,
          paymentInterval: 3600n,
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

    await expect(
      subsCryptMarketplace.write.unregisterService([serviceCountBefore + 1n], {
        account: user.account.address,
      })
    ).to.be.rejectedWith("UnauthorizedServiceProvider()");

    await subsCryptMarketplace.write.unregisterService(
      [serviceCountBefore + 1n],
      {
        account: serviceProvider.account.address,
      }
    );
    expect(
      await subsCryptMarketplace.read.isServiceAvailable([
        serviceCountBefore + 1n,
      ])
    ).to.be.false;
  });

  it("Only verifier can initialize accounts", async function () {
    const { subsCryptMarketplace, serviceProvider, user } = await loadFixture(
      deploySubsCrypt
    );

    await expect(
      subsCryptMarketplace.write.initializeAccount([1n, user.account.address], {
        account: serviceProvider.account.address,
      })
    ).to.be.rejectedWith("UnauthorizedVerifier()");
  });

  it("Accounts can't be initialized to an unavaliable service", async function () {
    const { subsCryptMarketplace, verifier, user } = await loadFixture(
      deploySubsCrypt
    );

    await expect(
      subsCryptMarketplace.write.initializeAccount([1n, user.account.address], {
        account: verifier.account.address,
      })
    ).to.be.rejectedWith("ServiceNotRegistered()");

    // TODO: Impersonate the verifier account
  });

  it("Accounts can be initialized properly", async function () {
    const {
      subsCryptMarketplace,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      verifier,
      user,
      publicClient,
    } = await loadFixture(deploySubsCrypt);

    await subsCryptMarketplace.write.registerService(
      [
        {
          serviceProvider: serviceProvider.account.address,
          paymentRecipient: paymentRecipient.account.address,
          paymentAsset: paymentAsset.account.address,
          assetChainId: 1n,
          servicePrice: 1000n,
          paymentInterval: 3600n,
        },
      ],
      {
        account: serviceProvider.account.address,
      }
    );

    const authorization = await user.signAuthorization({
      account: user.account,
      contractAddress:
        await subsCryptMarketplace.read.subsCryptSmartAccountDelegate(),
      chainId: 0,
    });

    const hash = await user.sendTransaction({
      authorizationList: [authorization],
      data: "0xdeadbeef",
      to: user.account.address,
    });

    await subsCryptMarketplace.write.initializeAccount(
      [1n, user.account.address],
      {
        account: verifier.account.address,
      }
    );

    // TODO: Impersonate the verifier account
  });

  describe("DUMMY", function () {
    it("DUMMY", async function () {
      // TODO
    });
  });
});
