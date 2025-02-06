// @ts-ignore
import { ClaimIcon, CalendarIcon, ChevronIcon, ManageIcon, RepayIcon } from "@unioncredit/ui";
import { TextCube } from "@/components/shared/TextCube";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { IconCube } from "@/components/shared/IconCube";

export const ClubActions = () => {

  return (
    <div className="p-4 border rounded-2xl bg-stone-50">
      <header className="flex justify-between gap-2 border-b pb-4">
        <h2 className="text-lg text-stone-500 font-medium">Club Member Actions</h2>

        <div className="flex items-center">
          <ManageIcon width={24} height={24} />
          <ChevronIcon width={24} height={24} className="-ml-1.5" />
        </div>
      </header>

      <div className="mt-4 flex items-center justify-center gap-3 py-3 px-5 bg-stone-100 rounded-2xl border">
        <TextCube width={48} height={48} background="#1F1D29" foreground="white">
          CUB
        </TextCube>
        <p className="text-lg">Credit Cub Member #X</p>
      </div>

      <div className="flex items-center justify-center gap-0.5 mt-2">
        <CalendarIcon width={24} height={24} />
        <p className="text-xs text-blue-600">Vesting: X of X days vested</p>
      </div>

      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center justify-between bg-white py-2 px-3 border rounded-lg">
            <p>Club Credit</p>

            <div>
              <p className="text-sm font-medium">$202,243.67</p>
              <p className="text-xs text-stone-400">+$232.23</p>
            </div>
          </div>

          <RoundedButton
            icon={(
              <IconCube
                width={18}
                height={18}
                icon={ClaimIcon}
                color="#C4EBD5"
                className="p-1"
              />
            )}
            className="bg-[#E3F6EC] hover:bg-[#E3F6EC] hover:opacity-90 h-[54px] text-[#1C9451] w-[156px] justify-start"
            onClick={() => alert(0)}
          >
            Claim Credit
          </RoundedButton>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-1 items-center justify-between bg-white py-2 px-3 border rounded-lg">
            <p>Club Debt</p>

            <div>
              <p className="text-sm font-medium">$8,243.67</p>
            </div>
          </div>

          <RoundedButton
            icon={(
              <IconCube
                width={18}
                height={18}
                icon={RepayIcon}
                color="#CEDCFF"
                className="p-1"
              />
            )}
            className="bg-[#EEF2FF] hover:bg-[#EEF2FF] hover:opacity-90 h-[54px] text-[#5F85FF] w-[156px] justify-start"
            onClick={() => alert(0)}
          >
            Repay
          </RoundedButton>
        </div>
      </div>
    </div>
  )
};