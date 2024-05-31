import { ClubStats } from "@/components/ClubStats.tsx";
import { IconCube } from "@/components/shared/IconCube.tsx";
import BlackGlasses from "@/assets/glasses-black.svg";
import { ActionsPanel } from "@/components/member/ActionsPanel.tsx";
import { ClubActivity } from "@/components/ClubActivity.tsx";
import { ContactsTable } from "@/components/table/ContactsTable.tsx";

export const Homepage = () => {
  return (
    <div className="mt-8 p-6 flex flex-col items-center bg-white rounded-2xl outline outline-1 outline-gray-100 sm:p-4">
      <div className="flex w-full mb-8 lg:flex-col">
        <div className="flex flex-col justify-between flex-1 text-left">
          <div>
            <IconCube width={42} height={42} icon={BlackGlasses} color="#FFDFE8" />
            <h1 className="mt-4 text-2xl font-medium">Credit Club: BCC</h1>
            <p className="mt-2 mb-6 text-xl text-gray-400">OG Credit Club Beta Testers. This is additional text to fill
              in the space to see what it will look like.</p>

            <p className="mt-2 mb-6 text-xl text-gray-400">Secret Link to Group Chat: <a href="#" className="text-gray-400 underline">Link</a></p>
          </div>

          <ClubStats />
        </div>

        <div className="flex-1 pl-6 lg:pl-0 lg:mt-6">
          <ActionsPanel />
          <ClubActivity />
        </div>
      </div>

      <ContactsTable />
    </div>
  )
};