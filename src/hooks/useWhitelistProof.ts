import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";

const whitelist = [
  "0xb8150a1b6945e75d05769d685b127b41e6335bbc",
  "0xDD470917C52a25179a6B5260eAA9609230Be4ce0",
  "0xCbD1c32A1b3961cC43868B8bae431Ab0dA65beEb",
  "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4"
];

export const useWhitelistProof = () => {
  const { address } = useAccount();
  const [proof, setProof] = useState<any[]>([]);

  const tree = useMemo(() => StandardMerkleTree.of(whitelist.map(addr => [addr]), ["address"]), [whitelist]);

  useEffect(() => {
    if (address) {
      for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
          setProof(tree.getProof(i));
          break;
        }
      }
    }
  }, [address, tree]);

  return { proof };
};