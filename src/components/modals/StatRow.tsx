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
  content: string;
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
        <p>{content}</p>
      </div>

      <Text size="large" weight="medium">
        {amount}
        {token}
      </Text>
    </div>
  );
};