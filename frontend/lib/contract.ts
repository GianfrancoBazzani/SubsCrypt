export const SUBSCRYPT_MARKETPLACE_ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_executionBountyPercentage",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_verifier",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "InvalidPaymentRecipient",
      type: "error",
    },
    {
      inputs: [],
      name: "ServiceFeeMustBeGreaterThanZero",
      type: "error",
    },
    {
      inputs: [],
      name: "ServiceNotRegistered",
      type: "error",
    },
    {
      inputs: [],
      name: "UnauthorizedServiceProvider",
      type: "error",
    },
    {
      inputs: [],
      name: "UnauthorizedVerifier",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "paymentRecipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "servicePrice",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum SubsCryptMarketplace.PaymentInterval",
          name: "paymentInterval",
          type: "uint8",
        },
      ],
      name: "ServiceRegistered",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "Id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "InitializeAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "batchExecutePayments",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "executionBountyPercentage",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "Id",
          type: "uint256",
        },
      ],
      name: "isServiceAvailable",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "serviceProvider",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentRecipient",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentAsset",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "assetChainId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "servicePrice",
              type: "uint256",
            },
            {
              internalType: "enum SubsCryptMarketplace.PaymentInterval",
              name: "paymentInterval",
              type: "uint8",
            },
          ],
          internalType: "struct SubsCryptMarketplace.ServiceOffer",
          name: "serviceOffer",
          type: "tuple",
        },
      ],
      name: "registerService",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "serviceCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
      ],
      name: "serviceOffers",
      outputs: [
        {
          internalType: "address",
          name: "serviceProvider",
          type: "address",
        },
        {
          internalType: "address",
          name: "paymentRecipient",
          type: "address",
        },
        {
          internalType: "address",
          name: "paymentAsset",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "assetChainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "servicePrice",
          type: "uint256",
        },
        {
          internalType: "enum SubsCryptMarketplace.PaymentInterval",
          name: "paymentInterval",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newPercentage",
          type: "uint256",
        },
      ],
      name: "setExecutionBountyPercentage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "subsCryptSmartAccountDelegate",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "Id",
          type: "uint256",
        },
      ],
      name: "unregisterService",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "verifier",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const
  
  // Contract address - replace with your deployed contract address
  export const SUBSCRYPT_MARKETPLACE_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" as const
  
  // Payment interval enum values
  export const PAYMENT_INTERVALS = {
    DAILY: 0,
    WEEKLY: 1,
    MONTHLY: 2,
    YEARLY: 3,
  } as const
  
  export const PAYMENT_INTERVAL_LABELS = {
    [PAYMENT_INTERVALS.DAILY]: "Daily",
    [PAYMENT_INTERVALS.WEEKLY]: "Weekly",
    [PAYMENT_INTERVALS.MONTHLY]: "Monthly",
    [PAYMENT_INTERVALS.YEARLY]: "Yearly",
  } as const
  