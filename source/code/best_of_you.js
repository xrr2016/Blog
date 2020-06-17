/**
 * @param {number[]} A
 * @return {number}
 */
const bestOfYou = (A) => {
  // 过去，你一无所有
  let prev = 0
  // 现在，你轻装上阵
  let current = 0
  // 向着未来迈出了第一步
  for (let i = 1; i < A.length; i++) {
    // 经历，选择，成长
    // 每个决定都让你成为更好的自己
    prev = Math.max(prev, A[i - 1] + i - 1)
    // 用最好的自己迎接未来，你会发现
    current = Math.max(current, prev + A[i] - i)
  }
  // 现在的你，是最好的你
  return current
};

