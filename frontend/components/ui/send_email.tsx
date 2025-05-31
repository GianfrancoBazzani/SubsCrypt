import { Button } from "@/components/ui/button"

const SendAuthorizationEmailButton = ({ authorizationTuple, serviceID, salt }: { authorizationTuple: string, serviceID: string, salt: string }) => {
  const serviceProviderEmail = "gordi2015ferrai@gmail.com";
  const subject = `Authorization for Subscription Payment – SubsCrypt - serviceID: ${serviceID}`;

  const body = `Hello,

I authorize the subscription payment for the service I am subscribing to via SubsCrypt.

The authorization tuple below represents my signed delegation, which binds this email to the designated "payment" EOA under the SubsCrypt protocol. This signature confirms my consent to the smart contract delegation required for non-interactive, privacy-preserving recurring payments.

__AUTHORIZATION__${authorizationTuple}__AUTHORIZATION__
__SALT__${salt}__SALT

By submitting this email, I confirm that I understand:
- My email identity has been verified off-chain using Vlayer ZK-proofs.
- The linked EOA is generated and controlled specifically for subscription payments.
- The EOA has been delegated under EIP-7702 to allow non-interactive streaming of funds.
- The service provider is authorized to periodically pull subscription fees according to the agreed-upon schedule.

This process ensures a secure, private, and transparent subscription payment experience.`;

  const mailtoLink = `mailto:${encodeURIComponent(serviceProviderEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a href={mailtoLink} className="w-full">
      <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
        Send Authorization Email
      </Button>
    </a>
  );
};

export default SendAuthorizationEmailButton;