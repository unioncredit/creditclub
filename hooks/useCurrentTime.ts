export const useCurrentTime = () => {
  const todayTimestamp = Math.floor(Date.now() / 1000);

  const hasPassed = (timestamp: number | bigint) => {
    return Number(timestamp) < todayTimestamp;
  }

  return {
    timestamp: todayTimestamp,
    hasPassed,
  }
};