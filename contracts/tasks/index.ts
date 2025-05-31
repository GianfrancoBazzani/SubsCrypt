import { task } from "hardhat/config";
import { hexToString, toHex, parseAbiParameters } from "viem";

task("deploy-subscrypt-smart-account-delegate").setAction(async (_args, hre) => {
  const subsCryptSmartAccountDelegate = await hre.viem.deployContract("SubsCryptSmartAccountDelegate", []); // TODO Set constructor arguments if needed
  const subsCryptSmartAccountDelegateAddr = await subsCryptSmartAccountDelegate.address;
 // TODO From here
  console.log(`SubsCryptSmartAccountDelegate address: ${subsCryptSmartAccountDelegateAddr}`);
  return subsCryptSmartAccountDelegateAddr;
});

task("deploy-subscrypt-marketplace").setAction(async (_args, hre) => {
  const SubsCryptMarketplace = await hre.viem.deployContract("SubsCryptMarketplace", []); // TODO Set constructor arguments if needed
  const SubsCryptMarketplaceAddr = await SubsCryptMarketplace.address;
 // TODO From here
  console.log(`SubsCryptMarketplace address: ${SubsCryptMarketplaceAddr}`);
  return SubsCryptMarketplaceAddr;
});