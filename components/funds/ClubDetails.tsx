import {
  LinkOutIcon,
  ManageIcon,
  TwitterIcon,
  TelegramIcon,
  DelegateIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import BlackBear from "@/assets/black-bear.svg";

import { IconCube } from "@/components/shared/IconCube";
import { Badge } from "@/components/ui/Badge";

export const ClubDetails = () => {
  const clubBadges = [
    {
      label: "CA:0x0000...0000",
      url: "https://google.com",
    },
    {
      label: "BY:kingjacob.eth",
      url: "https://google.com",
    }
  ];

  const detailBadges = [
    {
      label: "username",
      url: "https://x.com",
      icon: TwitterIcon,
    },
    {
      label: "/base-builder",
      url: "https://telegram.com",
      icon: TelegramIcon,
    },
    {
      label: "14 Members",
      url: "https://google.com",
      icon: DelegateIcon,
    }
  ];

  return (
    <div>
      <div className="flex items-between pb-4 border-b border-gray-200">
        <IconCube width={42} height={42} icon={BlackBear} color="#F4F4F6"/>

        <div className="pl-3">
          <h1 className="font-sans text-2xl font-medium">CreditCub.Club (CUB00)</h1>

          <ul className="flex gap-1">
            {clubBadges.map(({ label, url }) => (
              <li key={label}>
                <Badge
                  onClick={() => open(url)}
                  className="whitespace-nowrap"
                >
                  {label}
                  <LinkOutIcon width={16} height={16} className="ml-0.5"/>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 gap-2">
        <p className="flex items-center gap-1 font-sans font-medium text-lg">
          <ManageIcon width={24} height={24}/>
          Details
        </p>

        <ul className="flex gap-1">
          {detailBadges.map(({ label, url, icon: Icon }) => (
            <li key={label} className="flex items-center gap-1">
              <Badge variant="outline" onClick={() => open(url)}>
                <Icon width={16} height={16} className="ml-0.5"/>
                <span className="text-blue-600 font-sans font-normal">{label}</span>
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-stone-500 font-light mt-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </p>
    </div>
  )
};