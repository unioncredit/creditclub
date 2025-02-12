// @ts-ignore
import { Dot, DistributionBar } from "@unioncredit/ui";

export interface DistributionBarItem {
  value: number;
  label: string;
  title: string;
  color: string;
}

export const DistributionBarValues = ({
  items,
}: {
  items: DistributionBarItem[];
}) => (
  <div>
    <DistributionBar
      m="24px 0"
      items={items.map(({ value, color }) => ({ value, color }))}
    />

    <ul className="flex items-center justify-between gap-2">
      {items.map(({ label, title, color }, index) => (
        <li key={index}>
          <p className="text-lg font-medium font-mono">{label}</p>
          <p className="flex gap-1 items-center text-xs text-stone-400">
            <Dot color={color} size={6} />
            {title}
          </p>
        </li>
      ))}
    </ul>
  </div>
);