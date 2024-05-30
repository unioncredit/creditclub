import "./ClubDebtRow.scss";

import {
  Button,
  RepayIcon,
} from "@unioncredit/ui";

import { IconCube } from "@/components/shared/IconCube.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { format } from "@/utils/format.ts";

export const ClubDebtRow = () => {
  const { data: member } = useMember();
  const { owed } = member;

  return (
    <div className="ClubDebtRow flex justify-between mt-4">
      <div className="ClubDebtStat flex flex-1 justify-between items-center mr-2">
        <p className="text-gray-500 font-bold">Club Debt</p>
        <p className="text-gray-800 font-bold">${format(owed)}</p>
      </div>

      <Button
        onClick={() => window.open("https://app.union.finance", "_blank").focus()}
        label={
          <span className="flex items-center">
            <IconCube color="#CEDCFF" icon={RepayIcon} width={24} height={24} />
            <p className="ml-2 text-md" style={{ color: "#4F79FF" }}>Repay</p>
          </span>
        }
        color="secondary"
        variant="light"
        disabled={owed <= 0}
      />
    </div>
  );
}