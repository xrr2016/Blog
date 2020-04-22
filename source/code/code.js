

/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // 最大利润
  let max = 0;
  // 记录今天之前买入的最小值
  let min = prices[0];

  for (let i = 1; i < prices.length; i++) {
    // 比较每天的最大利润，保存最大值
    max = Math.max(max, prices[i] - min);
    // 计算今天卖出的获利
    min = Math.min(min, prices[i]);
  }

  return max
}
