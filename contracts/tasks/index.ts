import { task } from "hardhat/config";
import { hexToString, toHex, parseAbiParameters } from "viem";

task("deploy-subscrypt-smart-account-delegate").setAction(async (_args, hre) => {
  const subsCryptSmartAccountDelegate = await hre.viem.deployContract("SubsCryptSmartAccountDelegate", []); // TODO Set constructor arguments if needed
  const subsCryptSmartAccountDelegateAddr = await subsCryptSmartAccountDelegate.address;
 // TODO From here
  console.log(`SubsCryptSmartAccountDelegate address: ${subsCryptSmartAccountDelegateAddr}`);
  return subsCryptSmartAccountDelegateAddr;
});

task("deploy-subscrypt-entry-point").setAction(async (_args, hre) => {
  const subsCryptEntryPoint = await hre.viem.deployContract("SubsCryptEntryPoint", []); // TODO Set constructor arguments if needed
  const subsCryptEntryPointAddr = await subsCryptEntryPoint.address;
 // TODO From here
  console.log(`SubsCryptSmartAccountDelegate address: ${subsCryptEntryPointAddr}`);
  return subsCryptEntryPointAddr;
});