import "./EnableNotificationsBanner.scss";

// @ts-ignore
import { Box, Button, InfoBanner, CalendarIcon, CloseIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";

import { usePushNotifications } from "@/hooks/usePushNotifications.ts";
import { SETTINGS, useSettings } from "@/providers/SettingsProvider.tsx";

export const EnableNotificationsBanner = () => {
  const { address } = useAccount();
  const { isSubscribed, subscribe } = usePushNotifications();
  const { settings, setSetting } = useSettings();

  const shouldShowBanner = !settings[SETTINGS.HIDE_NOTIFICATION_BANNER] && address && !isSubscribed;

  return shouldShowBanner && (
    <Box mt="8px" className="EnableNotificationsBanner">
      <InfoBanner
        icon={CalendarIcon}
        variant="info"
        label={
          <>
            Enable notifications to track when your payments are due

            <Box>
              <Button
                size="small"
                label="Enable notifications"
                onClick={() => subscribe(address)}
              />

              <Button
                icon={CloseIcon}
                variant="outlined"
                className="CloseButton"
                onClick={() => setSetting(SETTINGS.HIDE_NOTIFICATION_BANNER, "true")}
              />
            </Box>
          </>
        }
      />
    </Box>
  )
}