// @ts-ignore
import { AddressBookIcon } from "@unioncredit/ui";

import CheckIcon from "@/assets/check-icon.svg";
import BlackBearIcon from "@/assets/black-bear.svg";
import { cn } from "@/lib/utils";
import { RoundedButton } from "@/components/ui/RoundedButton";

export const MembershipClaim = () => {
  const requirements = [
    {
      label: "Holder of XX DAI",
      completed: true,
    },
    {
      label: "Invited by a member or creator",
      completed: true,
    }
  ]

  return (
    <div className="p-4 border rounded-2xl">
      <header className="flex justify-between gap-2 border-b pb-4">
        <h2 className="text-lg text-stone-500 font-medium">Membership Claim</h2>

        <div className="flex items-center gap-1">
          <AddressBookIcon width={24} height={24} />
          <p className="text-sm text-blue-600">150 Remaining</p>
        </div>
      </header>

      <div className="mt-4 flex items-center justify-center gap-3 py-3 px-5 bg-stone-100 rounded-2xl border">
        <BlackBearIcon width={48} height={48} className="opacity-10" />
        <p className="text-lg">You are not qualifed</p>
      </div>

      <h3 className="mt-4 font-light text-blue-600">Who can mint a membership?</h3>
      <ul className="mt-1.5">
        {requirements.map(({ label, completed }) => (
          <li key={label} className="flex gap-1 items-center text-xs mt-1">
            <CheckIcon width={24} height={24} className={cn("fill text-stone-400", {
              "text-blue-600": completed,
            })} />
            {label}
          </li>
        ))}
      </ul>

      <RoundedButton
        size="large"
        variant="dark"
        className="mt-4 w-full"
      >
        Claim Credit from XXXX Credit
      </RoundedButton>
    </div>
  )
};