import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";

const whitelist = [
         "0xb8150a1b6945e75d05769d685b127b41e6335bbc",
        "0xDD470917C52a25179a6B5260eAA9609230Be4ce0",
        "0xCbD1c32A1b3961cC43868B8bae431Ab0dA65beEb",
        "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4",
        "0xD2d8E34Fa5BafA8E7903baBEf5fD9101Df45CE04",
        "0xC3edCBe0F93a6258c3933e86fFaA3bcF12F8D695",
        "0x96e1D9132e9Dee088cd79cc664316a16dFe490C6",
        "0xA7860E99e3ce0752D1ac53b974E309fFf80277C6",
        "0x5B93FF82faaF241c15997ea3975419DDDd8362c5",
        "0x8a333a18B924554D6e83EF9E9944DE6260f61D3B",
        "0xcc0C1A655C87752Ab57859c3A161770fC99cE4C3",
        "0x95a52074D9c28043c7D890d31f648612B7dd45A0",
        "0x99C5968eEccd940fB35aAeBAF31c3035Cfa71d66",
        "0x1C92efDB6C924cB2aCF7DcEec29B7aBB69aB58BC",
        "0xd0f46a5d48596409264d4eFc1f3B229878fFf743",
        "0x2BB5B5f11b35ACeadd4cc35eCdC20410e9E6A981",
        "0x3b12b46Ea59f30e3012701221A0635F394afc246"
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
