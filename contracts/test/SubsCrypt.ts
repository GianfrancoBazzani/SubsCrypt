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
  createWalletClient,
  http,
  concat,
  toRlp,
  toHex,
  keccak256,
} from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { sepolia } from "viem/chains";

const DEFAULT_EXECUTION_BOUNTY_PERCENTAGE = 5_000;
const DUMMY_HASH =
  "0x1000000000000000000000000000000000000000000000000000000000000001";

describe("SubsCrypt", function () {
  async function deploySubsCrypt() {
    const [
      owner,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      verifier,
      bot,
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
      bot,
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

    const serviceCount = await subsCryptMarketplace.read.serviceCount();

    expect(
      await subsCryptMarketplace.read.isServiceAvailable([serviceCount + 1n])
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
      await subsCryptMarketplace.read.isServiceAvailable([serviceCount + 1n])
    ).to.be.true;

    await expect(
      subsCryptMarketplace.write.unregisterService([serviceCount + 1n], {
        account: user.account.address,
      })
    ).to.be.rejectedWith("UnauthorizedServiceProvider()");

    await subsCryptMarketplace.write.unregisterService([serviceCount + 1n], {
      account: serviceProvider.account.address,
    });
    expect(
      await subsCryptMarketplace.read.isServiceAvailable([serviceCount + 1n])
    ).to.be.false;
  });

  it("Only verifier can initialize accounts", async function () {
    const { subsCryptMarketplace, serviceProvider, user } = await loadFixture(
      deploySubsCrypt
    );

    await expect(
      subsCryptMarketplace.write.initializeAccount(
        [1n, user.account.address, DUMMY_HASH],
        {
          account: serviceProvider.account.address,
        }
      )
    ).to.be.rejectedWith("UnauthorizedVerifier()");
  });

  it("Accounts can't be initialized to an unavaliable service", async function () {
    const { subsCryptMarketplace, verifier, user } = await loadFixture(
      deploySubsCrypt
    );

    await expect(
      subsCryptMarketplace.write.initializeAccount(
        [1n, user.account.address, DUMMY_HASH],
        {
          account: verifier.account.address,
        }
      )
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
      publicClient,
      user,
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

    const privateKey = generatePrivateKey();
    const burnerEOA = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account: burnerEOA,
      chain: mainnet,
      transport: http(),
    });
    let authorization = await walletClient.signAuthorization({
      account: burnerEOA,
      contractAddress:
        await subsCryptMarketplace.read.subsCryptSmartAccountDelegate(),
      chainId: 0,
      nonce: 0,
    });

    await expect(
      subsCryptMarketplace.write.initializeAccount(
        [1n, burnerEOA.address, DUMMY_HASH],
        {
          account: verifier.account.address,
        }
      )
    ).to.be.rejectedWith("AccountNotEIP7702Delegated()");

    expect(await publicClient.getCode({ address: burnerEOA.address })).to.be
      .undefined;

    await user.sendTransaction({
      authorizationList: [authorization],
      data: "0xdeadbeef",
      to: user.account.address,
    });

    expect(await publicClient.getCode({ address: burnerEOA.address })).not.to.be
      .undefined;

    await subsCryptMarketplace.write.initializeAccount(
      [1n, burnerEOA.address, DUMMY_HASH],
      {
        account: verifier.account.address,
      }
    );

    const burnerEOAContract = await hre.viem.getContractAt(
      "SubsCryptSmartAccountDelegate",
      burnerEOA.address
    );
    expect(await burnerEOAContract.read.marketplace()).to.be.equal(
      getAddress(subsCryptMarketplace.address)
    );
    expect(await burnerEOAContract.read.paymentInterval()).to.be.equal(3600n);
    expect(await burnerEOAContract.read.servicePrice()).to.be.equal(1000n);
    expect(await burnerEOAContract.read.lastPullTimestamp()).to.be.equal(0n);
  });

  it("Payments can be triggered ETH", async function () {
    const {
      subsCryptMarketplace,
      serviceProvider,
      paymentRecipient,
      paymentAsset,
      verifier,
      publicClient,
      bot,
      user,
    } = await loadFixture(deploySubsCrypt);

    await subsCryptMarketplace.write.registerService(
      [
        {
          serviceProvider: serviceProvider.account.address,
          paymentRecipient: paymentRecipient.account.address,
          paymentAsset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          assetChainId: 31337n,
          servicePrice: 10n,
          paymentInterval: 1000n,
        },
      ],
      {
        account: serviceProvider.account.address,
      }
    );

    const privateKey = generatePrivateKey();
    const burnerEOA = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account: burnerEOA,
      chain: mainnet,
      transport: http(),
    });
    let authorization = await walletClient.signAuthorization({
      account: burnerEOA,
      contractAddress:
        await subsCryptMarketplace.read.subsCryptSmartAccountDelegate(),
      chainId: 0,
      nonce: 0,
    });
    await user.sendTransaction({
      authorizationList: [authorization],
      data: "0xdeadbeef",
      to: user.account.address,
    });

    await subsCryptMarketplace.write.initializeAccount(
      [1n, burnerEOA.address, DUMMY_HASH],
      {
        account: verifier.account.address,
      }
    );

    await setBalance(burnerEOA.address, parseEther("100"));
    const botBalanceBefore = await publicClient.getBalance({
      address: bot.account.address,
    });
    const recipientBalanceBefore = await publicClient.getBalance({
      address: paymentRecipient.account.address,
    });

    const tx = await subsCryptMarketplace.write.batchExecutePayments(
      [
        [
          {
            account: burnerEOA.address,
            assetAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            feeReceiverAddress: bot.account.address,
          },
        ],
      ],
      {
        account: bot.account.address,
      }
    );
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    expect(
      await publicClient.getBalance({
        address: burnerEOA.address,
      })
    ).to.be.equal(parseEther("100") - 10_000n);

    expect(
      await publicClient.getBalance({
        address: bot.account.address,
      })
    ).to.be.equal(
      botBalanceBefore + 500n - receipt.gasUsed * receipt.effectiveGasPrice
    );

    expect(
      await publicClient.getBalance({
        address: paymentRecipient.account.address,
      })
    ).to.be.equal(recipientBalanceBefore + 9_500n);

    time.increase(999n);

    await expect(
      subsCryptMarketplace.write.batchExecutePayments(
        [
          [
            {
              account: burnerEOA.address,
              assetAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              feeReceiverAddress: bot.account.address,
            },
          ],
        ],
        {
          account: bot.account.address,
        }
      )
    ).to.be.rejectedWith("0xd1d32b8b");

    time.increase(1000n);

    const burnerEOABalanceBefore1 = await publicClient.getBalance({
      address: burnerEOA.address,
    });
    const botBalanceBefore1 = await publicClient.getBalance({
      address: bot.account.address,
    });
    const recipientBalanceBefore1 = await publicClient.getBalance({
      address: paymentRecipient.account.address,
    });

    await subsCryptMarketplace.write.batchExecutePayments(
      [
        [
          {
            account: burnerEOA.address,
            assetAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            feeReceiverAddress: bot.account.address,
          },
        ],
      ],
      {
        account: bot.account.address,
      }
    );

  });

  describe("DUMMY", function () {
    it("DUMMY", async function () {
      // TODO
    });
  });
});
