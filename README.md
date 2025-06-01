# SubsCrypt - Anonymous On-Chain Subscription Payments
> ETH Global Prague 2025 hackathon project

## Introduction
SubsCrypt is an innovative platform that leverages EIP-7702 and Vlayer ZK-proofs to create an on-chain private subscription payment marketplace.

Name morphological analysis:
   - Subs: Short for “Subscription”, highlighting recurring payments.
   - Crypt: From the Greek “kryptós”, meaning “hidden” or “secret”, emphasizing user privacy.

In most Web2 SaaS applications, users' emails are used as the service consumer profiles, allowing users to authenticate themselves in web apps and consume the specific service. In the case of paid services, payments should be routed through a conventional payment gateway (PayPal, Stripe...) to which the identity of the user must be disclosed (email, payment information, service consumed, price paid) to a third-party payment gateway. The advantage is that for subscription payments, the user should only set up the payment method once, and the service provider will periodically pull the funds throw the payment gateway from the user's payment methods automatically without requiring any user interaction. We can now mimic that flow efficiently by implementing delegate logic to EOAs thanks to the EIP-7702 introduced in the Ethereum Pectra upgrade.

## Main Features

### Hidden Email as a Service Consumer Identity
Using **Vlayer Email Proof**, we can authenticate a user's email off-chain within the service provider application and have it verified and bound to a specific "payment" EOA controlled by the user (service consumer) without needing to disclose any user data to third-party payment applications. In this schema, the email address is only shared with the service provider. Additionally, the user can authenticate and trigger actions in the wallet by sending simple emails, abstracting any key management on their part. 

### P2P Privacy-Preserving Payments
The "payment" EOA can be created solely for the subscription payment purpose and can be funded using privacy-preserving funding systems to guarantee that the service consumer  account remains completely anonymous. To bind this "payment" EOA to the email of the user a commitment of the email (hash + salt) is stored on chain in order to allow the consumer provider in the future to proof through his email that he is the owner of that specific "payment" EOA (Email authentication in the delegated EOA).

### Non-interactive Recursive Payments Leveraging EIP-7702
We can leverage EIP-7702 to enable non-interactive payments, meaning that only an initial signature from the "payment" EOA private key is required to set up the subscription. This signature will be used to sign the authorization tuple that is submitted on-chain by the service provider backend to delegate the smart contracts which allow the service provider to periodically pull funds from the EOA, mimicking conventional Web2 subscription systems. The signature will be sent through email to bind the "payment" EOA to a specific email address. After the delegation, the private key of the "payment" EOA can be destroyed without the risk of losing the EOA funds since recovery logic with email authentication is implemented in its code thanks to the delegation. This flow allows one to completely abstract private key management from the users.

### Ephemeral "Payment" EOA Private Key Abstracts Key Management From User
Since once the EIP-7702 delegation is activated we can control de implementation code of the EOA programatically there is not need for the user to hold the private key of the EOA, as we can implement email authentication mechanism to allow the user to recover the funds from the address.

### Granular Payment Stream
The service provider can pull the funds whenever he wants since we implement a stream payment that accrues the paid amount per unit of time. Ideally, the service provider will periodically pull funds from the payment EOA. The periodicity and the price per unit of time are properties of each specific service provided and are completely customizable.

### Auto-executable Payments with fee-incentivized triggers
In order to incentivize the execution of the payments semi-automatically, a fee auction is implemented to incentivize anyone to pay for the gas of payment triggering transactions, obtaining a fee percentage in exchange.

### Multi-currency and Multi-chain Payments with 1inch Fusion+
The service provider is free to trigger a bridge and/or swap atomically when pulling funds from the EOA with built-in integration with **1inch Fusion+**.


## App Flow

### Service Provider
1. Service providers can announce their services by submitting a transaction to `SubsCryptMarketplace.registerService` specifying all the properties of the service through `ServiceOffer` struct. This can be easily done through the service provider admin dashboard.
```solidity
    struct ServiceOffer {
        address serviceProvider;
        address paymentRecipient;
        address paymentAsset;
        uint256 assetChainId;
        uint256 servicePrice; // in wei/seconds
        uint256 paymentInterval; // seconds
    }
```

### User
2. Users can visualize all offered services from different services providers in the same aggregated frontend.
3. If an user is interested in a specific service, he can start the subscription initialization through cling a simple button in the frontend.
4. Transparently to the user a "payment" EOA private key is randomly generated and is used to sign a delegation to the `SubsCryptSmartAccountDelegate` implementation.
5. At the end of the button click handler action, an email window opens, indicating to the user that they need to send an email to the service provider with the delegation payload. The email is automatically generated following a template; the user only has to send it.

### Email Reception Automation
6. The email is received in the service provider inbox and is automatically processed by an email automation build with n8n.
7. From the email content following data is parsed:
   - The service id that the user wants to subscribe to.
   - The email sender.
   - The email receiver.
   - The EIP-7702 authorization tuple.
8. The service provider backend submits an Ethereum v4 transaction to the blockchain with the given authorization tuple, effectively setting up the SubsCryptSmartAccountDelegate to the "payment" EOA.

### Vlayer Email Proofs
9. The email's `.eml` file content is submitted to our custom prover and all private inputs constrains are checked. As output we obtain the address of the "payment" EOA and a hidden commitment of the user email.
10. The proof is then passed on-chain to the verifier contract along with the public outputs.

### On-Chain logic
11. If the verification succeeds  the verifier contract itself will call the access controlled `SubsCryptMarketplace.initializeAccount` to initialize the state of the EOA. The wallet is now ready to be funded.

### Wallet Funding and Bots
12. The users knows the address of the wallet and is its his duty to add funds to it in order to trigger the first payment of the subscription. Privacy preserving funding methods can be used to completely anonymize the payments of the subscription.

13. After each period of `paymentInterval` the bots will be incentivized to trigger the payment transactions mimicking an automatic execution of the payments. The payments can be triggered selectively in batches  through calling the `SubsCryptMarketplace.batchExecutePayments`.


## Architecture

### Smart Contracts
- [`SubsCryptSmartAccountDelegate.sol`](/contracts/contracts/SubsCryptMarketplace.sol): This contract manages the delegated smart account, enabling controlled fund withdrawals based on periodic payment intervals.
- [`SubsCryptMarketplace.sol`](/contracts/contracts/SubsCryptMarketplace.sol): This contract facilitates the marketplace operations by handling service registration, account initialization, and automated batch payment executions.

### Service Provider Admin Dashboard
A dedicated dashboard where service providers can efficiently manage and monitor their offered services.

### Service Provider Backend
This microservice handles email automation reception and executes the **Vlayer** prover and verifier logic calls to trigger subscription initialization.

### User Facing Front End
This interface aggregates all marketplace services and provides an intuitive subscription flow for users to easily enroll with their chosen service providers.

### Vlayer Email Contracts
Custom implementations of the email prover and verifier contracts, enabling on-chain validation of email proofs.


![System Schema](img/system-schema.png)


## Resources and Definitions

### Vlayer Email Proof
- [Vlayer how it works](https://book.vlayer.xyz/getting-started/how-it-works.html)
- [Vlayer contract execution](https://book.vlayer.xyz/getting-started/how-it-works.html#vlayer-contract-execution)

Prover inputs:
- Email

Prover outputs:
- Hash of the email to initialize the account

Email format:
-  \_\_AUTHORIZATION\_\_\<Authorization Tuple\>\_\_AUTHORIZATION\_\_
-  \_\_SALT\_\_\<Salt to add randomness to the email\>\_\_SALT\_\_


### EIP-7702 
authorization tuple: `[chain_id, address, nonce, y_parity, r, s]`
