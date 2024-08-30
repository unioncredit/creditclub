import "./StatRow.scss";
// @ts-ignore
import { Text } from "@unioncredit/ui";
import React from "react";

export const StatRow = ({
  percentage,
  title,
  content,
  amount,
  color,
  token,
}: {
  percentage?: string;
  title: string;
  content?: string | React.ReactNode;
  amount: string;
  color?: string;
  token: React.ReactNode;
}) => {
  return (
    <div className="StatRow">
      {percentage && (
        <div className="StatRow__cube" style={{ background: color }}>
          {percentage}
        </div>
      )}

      <div className="StatRow__content">
        <h3>{title}</h3>
        {content && <p>{content}</p>}
      </div>

      <Text className="StatRow__value" size="large" weight="medium">
        {amount}
        {token}
      </Text>
    </div>
  );
};