interface User {
  id: string;
  progress: number;
  isHost: boolean;
}

interface SyncResult {
  userId: string;
  speedAdjustment: number;
  syncTime: number;
}

function calculateOptimalSync(
  users: User[],
  maxSpeedDifference: number = 0.2
): SyncResult[] {
  if (users.length < 2) {
    throw new Error("At least two users are required for synchronization");
  }

  // 找出进度最快和最慢的用户
  const fastestUser = users.reduce((fastest, user) =>
    user.progress > fastest.progress ? user : fastest
  );
  const slowestUser = users.reduce((slowest, user) =>
    user.progress < slowest.progress ? user : slowest
  );

  // 计算最大时间差
  const maxTimeDifference = fastestUser.progress - slowestUser.progress;

  // 如果时间差很小，不需要调整
  if (maxTimeDifference < 0.1) {
    return users.map((user) => ({
      userId: user.id,
      speedAdjustment: 0,
      syncTime: 0,
    }));
  }

  // 计算最优同步时间
  const optimalSyncTime = maxTimeDifference / (2 * maxSpeedDifference);

  // 计算每个用户需要的速度调整
  const results: SyncResult[] = users.map((user) => {
    const progressDifference = fastestUser.progress - user.progress;
    const speedAdjustment =
      (progressDifference / maxTimeDifference) * (2 * maxSpeedDifference) -
      maxSpeedDifference;

    return {
      userId: user.id,
      speedAdjustment: Math.round(speedAdjustment * 1000) / 1000, // 四舍五入到小数点后三位
      syncTime: Math.round(optimalSyncTime * 100) / 100, // 四舍五入到小数点后两位
    };
  });

  return results;
}

// 使用示例
const users: User[] = [
  { id: "A", progress: 100, isHost: true },
  { id: "B", progress: 98, isHost: false },
  { id: "C", progress: 103, isHost: false },
  { id: "D", progress: 97, isHost: false },
];

const syncResults = calculateOptimalSync(users, 0.1);
console.log(syncResults);
