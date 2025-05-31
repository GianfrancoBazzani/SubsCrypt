// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SubsCryptSmartAccountDelegate} from "./SubsCryptSmartAccountDelegate.sol";

contract SubsCryptMarketplace is Ownable {
    // Types
    struct ServiceOffer {
        //TODO iterate this struct
        address serviceProvider;
        address paymentRecipient;
        address paymentAsset;
        uint256 assetChainId;
        uint256 servicePrice; // in wei/seconds
        uint256 paymentInterval; // seconds
    }

    // Events
    event ServiceRegistered(
        address indexed paymentRecipient,
        uint256 serviceId,
        uint256 servicePrice, // in wei/secons
        uint256 paymentInterval // seconds
    );

    event AccountInitialized(
        uint256 indexed serviceId,
        address indexed account
    );

    // Errors
    error UnauthorizedVerifier();
    error UnauthorizedServiceProvider();
    error InvalidPaymentRecipient();
    error ServiceFeeMustBeGreaterThanZero();
    error ServiceNotRegistered();
    error AccountNotEIP7702Delegated();

    address public immutable verifier;
    address public immutable subsCryptSmartAccountDelegate;

    // State Variables
    uint256 public executionBountyPercentage;
    uint256 public serviceCount;
    mapping(uint256 serviceId => ServiceOffer) public serviceOffers;
    mapping(address account => uint256 serviceId) public accountToServices;

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
        subsCryptSmartAccountDelegate = address(
            new SubsCryptSmartAccountDelegate()
        );
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

        serviceOffers[serviceCount] = serviceOffer;
        serviceCount++;

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
    function initializeAccount(
        uint256 Id,
        address account,
        bytes32 emailHash
    ) external onlyVerifier {
        ServiceOffer storage serviceOffer = serviceOffers[Id];
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );
        require(
            keccak256(account.code) ==
                keccak256(
                    abi.encodePacked(
                        hex'ef0100',
                        subsCryptSmartAccountDelegate
                    )
                ),
            AccountNotEIP7702Delegated()
        );

        SubsCryptSmartAccountDelegate(account).initialize(emailHash, serviceOffer.paymentInterval, serviceOffer.servicePrice);
        

        emit AccountInitialized(Id, account);
    }

    // Payment trigger logic
    function batchExecutePayments() external {}
    function _executePayment() internal {
        // Check if the service is available
        // TODO
        // account.pullFunds(accountAssetInBalance).
        // if assetChainId != this chainId , swap and bridge.
        // if paymentAsset != accountAssetInBalance swap.
    }

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
