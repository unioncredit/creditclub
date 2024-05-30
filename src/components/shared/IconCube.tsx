export const IconCube = ({
  icon: Icon,
  color,
  width,
  height
}: {
  icon: string;
  color: string;
  width: number;
  height: number;
}) => {
  return (
    <div className="IconCube p-2 rounded-lg inline-block" style={{ backgroundColor: color }}>
      {/* @ts-ignore */}
      <Icon width={width} height={height} />
    </div>
  )
};