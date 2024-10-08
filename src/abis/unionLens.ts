export const unionLensAbi = [
  {
    "inputs": [
      {
        "internalType": "contract IMarketRegistry",
        "name": "_marketRegistry",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      }
    ],
    "name": "getRelatedInfo",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "trust",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "vouch",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "locked",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastUpdated",
                "type": "uint256"
              }
            ],
            "internalType": "struct UnionLens.VouchInfo",
            "name": "voucher",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "trust",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "vouch",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "locked",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastUpdated",
                "type": "uint256"
              }
            ],
            "internalType": "struct UnionLens.VouchInfo",
            "name": "vouchee",
            "type": "tuple"
          }
        ],
        "internalType": "struct UnionLens.RelatedInfo",
        "name": "related",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isMember",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isOverdue",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "memberFrozen",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "locked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voucherCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voucheeCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "accountBorrow",
            "type": "uint256"
          }
        ],
        "internalType": "struct UnionLens.UserInfo",
        "name": "userInfo",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketRegistry",
    "outputs": [
      {
        "internalType": "contract IMarketRegistry",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;