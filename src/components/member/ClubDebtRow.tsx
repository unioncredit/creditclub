import "./ClubDebtRow.scss";

import {
  Button,
  RepayIcon,
  LinkOutIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { IconCube } from "@/components/shared/IconCube.tsx";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import cn from "classnames";

export const ClubDebtRow = () => {
  const { data: member } = useClubMember();

  const { isMember, owed } = member;

  return (
    <div className={cn("ClubDebtRow flex justify-between mt-4 sm:flex-col", {
      "blur-sm pointer-events-none": !isMember,
    })}>
      <div className="ClubDebtStat flex flex-1 justify-between items-center mr-2 sm:mr-0 sm:mb-2">
        <p className="text-gray-500 font-medium">Club Debt</p>
        <p className="text-gray-800 font-medium">${format(owed)}</p>
      </div>

      <Button
        // @ts-ignore
        onClick={() => window.open("https://app.union.finance", "_blank").focus()}
        label={
          <span className="flex items-center">
            <IconCube color="#CEDCFF" icon={RepayIcon} width={24} height={24} />
            <p className="ml-2 text-md mr-1" style={{ color: "#4F79FF" }}>Repay</p>
            <LinkOutIcon width={24} height={24} />
          </span>
        }
        color="secondary"
        variant="light"
        disabled={owed <= 0}
      />
    </div>
  );
}