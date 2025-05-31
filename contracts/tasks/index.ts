import { task } from "hardhat/config";
import { hexToString, toHex, parseAbiParameters } from "viem";

task("deploy-subscrypt-smart-account-delegate").setAction(
  async (_args, hre) => {
    const subsCryptSmartAccountDelegate = await hre.viem.deployContract(
      "SubsCryptSmartAccountDelegate",
      []
    ); // TODO Set constructor arguments if needed
    const subsCryptSmartAccountDelegateAddr =
      await subsCryptSmartAccountDelegate.address;

    console.log(
      `SubsCryptSmartAccountDelegate address: ${subsCryptSmartAccountDelegateAddr}`
    );
    return subsCryptSmartAccountDelegateAddr;
  }
);

task("deploy-subscrypt-marketplace").setAction(async (_args, hre) => {
    const ownerAddress = "0x2dd6b5d872047976E3f7938a748fc48f9D6b9520"
    const executionBountyPercentage = 5000; // 5%
    const verifierAddress = "0x2dd6b5d872047976E3f7938a748fc48f9D6b9520"; // Replace with actual verifier address
    
    const SubsCryptMarketplace = await hre.viem.deployContract(
    "SubsCryptMarketplace",
    [
        ownerAddress,  
        executionBountyPercentage,
        verifierAddress,
    ]
  );
  const SubsCryptMarketplaceAddr = await SubsCryptMarketplace.address;

  console.log(`SubsCryptMarketplace address: ${SubsCryptMarketplaceAddr}`);
  return SubsCryptMarketplaceAddr;
});
