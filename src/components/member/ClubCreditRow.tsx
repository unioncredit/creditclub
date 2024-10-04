import "./ClubCreditRow.scss";

import {
  Button,
  WithdrawIcon
  // @ts-ignore
} from "@unioncredit/ui";

import { IconCube } from "@/components/shared/IconCube.tsx";
import { format } from "@/utils/format.ts";
import { useWrite } from "@/hooks/useWrite.ts";
import { clubPluginContract } from "@/contracts/optimism.ts";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import cn from "classnames";

export const ClubCreditRow = () => {
  const { data: member } = useClubMember();
  const { current: currentCredit, difference: changeInCredit } = useMemberCredit();

  const { isMember, tokenId } = member;

  const updateTrustButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "setMemberTrust",
    args: [tokenId],
    disabled: !tokenId,
  });

  return (
    <div className={cn("ClubCreditRow flex justify-between mt-6 sm:flex-col", {
      "blur-sm pointer-events-none": !isMember,
    })}>
      <div className="ClubCreditStat flex flex-1 justify-between items-center mr-2 sm:mr-0 sm:mb-2">
        <p className="text-gray-500 font-medium">Club Credit</p>

        <div>
          <p className="ClubCreditStat__stat">${format(currentCredit)}</p>
          <p className="ClubCreditStat__highlight mt-1">{changeInCredit}</p>
        </div>
      </div>

      <Button
        {...updateTrustButtonProps}
        label={
          <span className="flex items-center">
            <IconCube color="#C4EBD5" icon={WithdrawIcon} width={24} height={24} />
            <p className="ml-2 text-md" style={{ color: "#068940" }}>Update Trust</p>
          </span>
        }
        color="secondary"
        variant="light"
      />
    </div>
  );
}