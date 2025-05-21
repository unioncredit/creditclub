export const factoryAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ASSET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "LIQUIDITY_MANAGER",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "REGISTER_HELPER",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "REWARD_MANAGER",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UNION_TOKEN",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "USER_MANAGER",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "U_TOKEN",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "auctionImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "authImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "create",
    "inputs": [
      {
        "name": "params",
        "type": "tuple",
        "internalType": "struct Factory.CreateParams",
        "components": [
          {
            "name": "clubName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "image",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "membershipName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "raiseMinTarget",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "raiseMaxTarget",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "raisePeriod",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "vaultRatio",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "assetRatio",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "withdrawPeriod",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lockupPeriod",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "fixedBidPrice",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "membershipCost",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "inviteCost",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "withdrawFeeBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "feeRecipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "maxMembers",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "minMembers",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "vestingDuration",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "startingPercentTrust",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gatingToken",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "gatingTokenAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isClosedEndFund",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isInviteEnabled",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isSoulBound",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isPublic",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isTokenEnabled",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      },
      {
        "name": "authParams",
        "type": "tuple",
        "internalType": "struct Factory.AuthParams",
        "components": [
          {
            "name": "creditManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "manager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feeManager",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "name": "initialInvited",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Factory.Deployment",
        "components": [
          {
            "name": "vault",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "auction",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "memberNFT",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "staking",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "withdrawBucket",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "auth",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "createCost",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "init",
    "inputs": [
      {
        "name": "implementations",
        "type": "tuple",
        "internalType": "struct Factory.Implementations",
        "components": [
          {
            "name": "vault",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "auction",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "memberNFT",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "staking",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "withdrawBucket",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "auth",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "name": "union",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "userManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "registerHelper",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "uToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "asset",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "uniswapPoolManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "uniswapPositionManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "uniswapPermit2",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "liquidityManagerFeeRecipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "unitOfCreditPerUnion",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_createCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "memberNFTImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCreateCost",
    "inputs": [
      {
        "name": "_createCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setLiquidityManager",
    "inputs": [
      {
        "name": "_liquidityManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stakingImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "vaultImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdrawBucketImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Create",
    "inputs": [
      {
        "name": "vault",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "auction",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "memberNFT",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "staking",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetCreateCost",
    "inputs": [
      {
        "name": "_createCost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetLiquidityManager",
    "inputs": [
      {
        "name": "liquidityManager",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CreateCost",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidParams",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;