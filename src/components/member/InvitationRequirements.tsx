import {
  Box,
  Text,
  Skeleton,
  // @ts-ignore
} from "@unioncredit/ui";

import CheckIcon from "@/assets/check-icon.svg";
import { useAccount } from "wagmi";
import { useReceivedInvitation } from "@/hooks/useReceivedInvitation.ts";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel.ts";

export const InvitationRequirements = () => {
  const { address: connectedAddress } = useAccount();
  const { data: invitation, loading } = useReceivedInvitation({
    receiver: connectedAddress,
  });
  const { data: name } = usePrimaryLabel({
    address: invitation?.sender,
  });

  return loading ? (
    <Box m="24px 0" justify="center" align="center">
      <Skeleton width={300} height={28} grey={200} shimmer />
    </Box>
  ) : invitation ? (
      <Box m="24px 0" justify="center" align="center">
        <CheckIcon />
        <Text m={0} ml="2px" weight="medium" color="indigo500">Invited by {name || invitation.sender}</Text>
      </Box>
    ) : (
      <>
        <Text color="indigo500" size="medium">Who can mint a membership?</Text>
        <Box align="center">
          <CheckIcon />
          <Text m={0} ml="2px" weight="medium">Invited by member</Text>
        </Box>
      </>
    )
};