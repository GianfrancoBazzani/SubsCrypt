// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SubsCryptMarketplace is Ownable {
    // Types
    enum PaymentInterval {
        HOURLY,
        DAILY,
        WEEKLY,
        MONTHLY,
        YEARLY
    }

    struct ServiceOffer {
        //TODO iterate this struct
        address serviceProvider;
        address paymentRecipient;
        address paymentAsset;
        uint256 assetChainId;
        uint256 servicePrice; // in wei/hour
        PaymentInterval paymentInterval;
    }

    // Events
    event ServiceRegistered(
        address indexed paymentRecipient,
        uint256 serviceId,
        uint256 servicePrice, // in wei/hour
        PaymentInterval paymentInterval
    );

    // Errors
    error UnauthorizedVerifier();
    error UnauthorizedServiceProvider();
    error InvalidPaymentRecipient();
    error ServiceFeeMustBeGreaterThanZero();
    error ServiceNotRegistered();

    address public immutable verifier;
    address public immutable subsCryptSmartAccountDelegate;

    // State Variables
    uint256 public executionBountyPercentage;
    uint256 public serviceCount;
    mapping(uint256 serviceId => ServiceOffer) public serviceOffers;

    // Modifiers
    modifier onlyVerifier() {
        require(msg.sender == verifier, UnauthorizedVerifier());
        _;
    }

    constructor(
        address _owner,
        uint256 _executionBountyPercentage,
        address _verifier
    ) Ownable(_owner) {
        executionBountyPercentage = _executionBountyPercentage;
        verifier = _verifier;

        // TODO: Deploy SubsCryptSmartAccountDelegate
    }

    // Service provider marketplace functions
    function registerService(ServiceOffer memory serviceOffer) external {
        require(
            serviceOffer.serviceProvider == msg.sender,
            UnauthorizedServiceProvider()
        );
        require(
            serviceOffer.paymentRecipient != address(0),
            InvalidPaymentRecipient()
        );
        require(
            serviceOffer.servicePrice > 0,
            ServiceFeeMustBeGreaterThanZero()
        );

        serviceCount++;
        serviceOffers[serviceCount] = serviceOffer;

        emit ServiceRegistered(
            serviceOffer.paymentRecipient,
            serviceCount,
            serviceOffer.servicePrice,
            serviceOffer.paymentInterval
        );
    }

    function unregisterService(uint256 Id) external {
        ServiceOffer storage serviceOffer = serviceOffers[Id];
        require(
            serviceOffer.serviceProvider == msg.sender,
            UnauthorizedServiceProvider()
        );
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );
        delete serviceOffers[Id];
    }

    // Verifier functions
    function InitializeAccount(
        uint256 Id,
        address account
    ) external onlyVerifier {
        ServiceOffer storage serviceOffer = serviceOffers[Id];
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );
        // TODO: Check if account is EIP-7702 delegated to subsCryptSmartAccountDelegate
    }

    // Payment trigger logic
    function batchExecutePayments() external {}
    function _executePayment() internal {}

    // View functions
    function isServiceAvailable(uint256 Id) external view returns (bool) {
        return serviceOffers[Id].paymentRecipient != address(0);
    }

    // Owner functions
    function setExecutionBountyPercentage(
        uint256 newPercentage
    ) external onlyOwner {
        executionBountyPercentage = newPercentage;
    }
}
