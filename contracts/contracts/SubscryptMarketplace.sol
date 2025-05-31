// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SubsCryptMarketplace is Ownable {
    // Types
    enum PaymentInterval {
        HURLY,
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
        uint256 serviceFee;
        PaymentInterval paymentInterval;
    }

    // Events
    event ServiceRegistered(
        address indexed paymentRecipient,
        uint256 serviceId,
        uint256 serviceFee, // in wei/hour
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
        uint256 _executionBountyPercentage
    ) Ownable(_owner) {
        executionBountyPercentage = _executionBountyPercentage;
        // TODO: Deploy SubsCryptSmartAccountDelegate
        // TODO: Deploy Verifier
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
        require(serviceOffer.serviceFee > 0, ServiceFeeMustBeGreaterThanZero());

        serviceCount++;
        serviceOffers[serviceCount] = serviceOffer;

        emit ServiceRegistered(
            serviceOffer.paymentRecipient,
            serviceCount,
            serviceOffer.serviceFee,
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

    // Payment trigger logic
    function batchExecutePayments() external {}
    function _executePayment() internal {}

    // View functions
    function isServiceAvailable(uint256 Id) external view returns (bool) {
        return serviceOffers[Id].paymentRecipient != address(0);
    }

    // Owner functions
    function initializeSmartAccount() external onlyVerifier {}
}
