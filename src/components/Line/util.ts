export const canConnect = (a, b) => {
  if (!a.length || !b.length) {
    return false;
  }
  function dfs(start, target, visited) {
      if (start === target) {
          return true;
      }
      for (let i = 0; i < b.length; i++) {
          if (!visited.has(i) && b[i].includes(start)) {
              const other = b[i][0] === start ? b[i][1] : b[i][0];
              visited.add(i);
              if (dfs(other, target, visited)) {
                  return true;
              }
          }
      }
      return false;
  }
  return dfs(a[0], a[1], new Set()) || dfs(a[1], a[0], new Set());
}

export const isSame = (arr1, arr2) => {
    // 检查数组长度是否相等
    if (arr1.length !== arr2.length) {
        return false;
    }

    // 辅助函数：将子数组转换为字符串
    const subArrayToString = subArr => subArr.slice().sort((a, b) => a - b).join(',');

    // 将每个数组转换为Set，其中每个元素是排序后的子数组的字符串表示
    const set1 = new Set(arr1.map(subArrayToString));
    const set2 = new Set(arr2.map(subArrayToString));

    // 比较两个Set是否相等
    if (set1.size !== set2.size) {
        return false;
    }

    for (let item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }

    return true;
}