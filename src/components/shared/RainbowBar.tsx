import "./RainbowBar.scss";

// @ts-ignore
import { Box } from "@unioncredit/ui";

export const RainbowBar = ({
  percentage,
  ...props
}: {
  percentage: number;
  [_: string]: any;
}) => {

  if (percentage < 0 || percentage > 100) {
    throw new Error("RainbowBar percentage is not valid: " + percentage);
  }

  return (
    <Box className="RainbowBar" {...props}>
      <span
        className="RainbowBar__progress"
        style={{ width: `${100 - percentage}%` }}
      />
    </Box>
  )
}