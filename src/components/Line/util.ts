export function canConnect(connections, start, end) {
  // 创建邻接表
  const graph = {};
  for (const [from, to] of connections) {
    if (!graph[from]) graph[from] = [];
    graph[from].push(to);
  }

  // 深度优先搜索函数
  function dfs(current, visited = new Set()) {
    if (current === end) return true;
    if (visited.has(current)) return false;

    visited.add(current);

    if (graph[current]) {
      for (const neighbor of graph[current]) {
        if (dfs(neighbor, visited)) return true;
      }
    }

    return false;
  }

  // 开始搜索
  return dfs(start);
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

export function animateLines(ctx: CanvasRenderingContext2D, testLightLines: any[], children: any[], lightRect: DOMRect, boxRect: DOMRect, lightTop) {
    let currentLineIndex = 0;
    let progress = 0;
  
    function drawLine(startX: number, startY: number, endX: number, endY: number, progress: number) {
      ctx.beginPath();
      ctx.strokeStyle = '';
      ctx.moveTo(endX, endY);
      const currentEndX = endX + (startX - endX) * ((currentLineIndex === testLightLines.length - 1) ? progress : 1);
      const currentEndY = endY + (startY - endY) * ((currentLineIndex === testLightLines.length - 1) ? progress : 1);
      ctx.lineTo(currentEndX, currentEndY);
      ctx.stroke();
    }
  
    function animate() {
        if (currentLineIndex >= testLightLines.length) {
        return; // 所有线都画完了
      }
  
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 清除画布
  
      // 重新绘制之前的线
      for (let i = 0; i < currentLineIndex; i++) {
        const light = testLightLines[i];
        const start = children[light].getBoundingClientRect();
        drawLine(
          lightRect.left - boxRect.left + 200,
          lightRect.top - boxRect.top + 50 + lightTop,
          start.left - boxRect.left + 66,
          start.top - boxRect.top + 50 + lightTop,
          1
        );
      }
  
      // 绘制当前正在动画的线
      const light = testLightLines[currentLineIndex];
      const start = children[light].getBoundingClientRect();
      drawLine(
        lightRect.left - boxRect.left + 200,
        lightRect.top - boxRect.top + 50 + lightTop,
        start.left - boxRect.left + 66,
        start.top - boxRect.top + 50 + lightTop,
        progress
      );
  
      progress += 0.02; // 控制动画速度
  
      if (progress >= 1) {
        currentLineIndex++;
        progress = 0;
      }
  
      requestAnimationFrame(animate);
    }
  
    animate();
  }