export enum TabEnum { 
  home = 'home',
  test = 'test',
  result = 'result'
}

export function generateRandomConnections(n, m) {
  // 创建所有可能的有效连线
  const validConnections = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      // 如果i和j都小于4（在同一直线上），则只添加相邻的连线
      if (i < 3 && j < 4) {
        if (j - i === 1) {
          validConnections.push([i, j]);
        }
      } else {
        // 如果至少有一个点是4，或者是相邻的点，则添加连线
        validConnections.push([i, j]);
      }
    }
  }

  // 打乱有效连线
  for (let i = validConnections.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validConnections[i], validConnections[j]] = [validConnections[j], validConnections[i]];
  }

  // 取前m个连线
  return validConnections.slice(0, m);
}

export const pmyma = 'pmyxhwgtdtbs'