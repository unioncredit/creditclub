import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
import { useAccount } from "wagmi";

export const ClubDebug = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);

  const { 
    isPublic, 
    isActivated, 
    isTokenEnabled, 
    stakedBalance,
    stakingAddress,
    totalAssets,
    totalSupply
  } = clubData;
  
  const { isMember } = clubMember;

  return (
    <div className="mb-4 p-4 border rounded-2xl bg-yellow-50 border-yellow-200">
      <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug Info</h3>
      <div className="text-sm space-y-1">
        <div>
          <span className="font-medium">isActivated:</span> 
          <span className={isActivated ? "text-green-600" : "text-red-600"}>
            {isActivated ? "✅ true" : "❌ false"}
          </span>
        </div>
        <div>
          <span className="font-medium">isTokenEnabled:</span> 
          <span className={isTokenEnabled ? "text-green-600" : "text-red-600"}>
            {isTokenEnabled ? "✅ true" : "❌ false"}
          </span>
        </div>
        <div>
          <span className="font-medium">isPublic:</span> 
          <span className={isPublic ? "text-green-600" : "text-red-600"}>
            {isPublic ? "✅ true" : "❌ false"}
          </span>
        </div>
        <div>
          <span className="font-medium">isMember:</span> 
          <span className={isMember ? "text-green-600" : "text-red-600"}>
            {isMember ? "✅ true" : "❌ false"}
          </span>
        </div>
        <div>
          <span className="font-medium">stakedBalance:</span> 
          <span className={stakedBalance > 0n ? "text-green-600" : "text-red-600"}>
            {stakedBalance.toString()}
          </span>
        </div>
        <div>
          <span className="font-medium">stakingAddress:</span> 
          <span className="text-blue-600 font-mono">
            {stakingAddress}
          </span>
        </div>
        <div>
          <span className="font-medium">totalAssets:</span> 
          <span>{totalAssets.toString()}</span>
        </div>
        <div>
          <span className="font-medium">totalSupply:</span> 
          <span>{totalSupply.toString()}</span>
        </div>
      </div>
      
      <div className="mt-3 text-sm">
        <div className="font-medium text-yellow-800">Conditions for stake component:</div>
        <div className="ml-2">
          <div>
            BuyRedeemPanel shows when: <span className="font-mono">isTokenEnabled && isActivated</span>
            <span className={isTokenEnabled && isActivated ? "text-green-600" : "text-red-600"}>
              {isTokenEnabled && isActivated ? " ✅" : " ❌"}
            </span>
          </div>
          <div>
            ClubStats shows when: <span className="font-mono">stakedBalance > 0n</span>
            <span className={stakedBalance > 0n ? "text-green-600" : "text-red-600"}>
              {stakedBalance > 0n ? " ✅" : " ❌"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 