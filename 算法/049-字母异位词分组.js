/**
 * 49. 字母异位词分组 · 中等 · 哈希表 + 字符串
 * https://leetcode.cn/problems/group-anagrams/
 *
 * 本地运行: node "算法/049-字母异位词分组.js"
 */

/* ============================================================
 * 解法 1(推荐):独立输出数组 + Map
 * ------------------------------------------------------------
 * 核心:排序后的字符串当「分组钥匙」,哈希表只负责记住
 *      「这个钥匙的组在结果数组里的下标」。
 * 关键点:结果放进新数组 groups,绝不改动入参 strs。
 * ============================================================ */
var groupAnagrams = function (strs) {
  const groups = [];          // 输出用新数组,和输入分开
  const keyToIndex = new Map(); // 钥匙 -> groups 里的下标

  for (let i = 0; i < strs.length; i++) {
    const key = [...strs[i]].sort().join(''); // 'eat' -> 'aet'

    if (keyToIndex.has(key)) {
      // 已经有这一组了:取下标,往里追加
      groups[keyToIndex.get(key)].push(strs[i]);
    } else {
      // 新的一组:记下它的下标,再建组
      keyToIndex.set(key, groups.length);
      groups.push([strs[i]]);
    }
  }

  return groups;
};

/* ============================================================
 * 解法 2:最小改动版(保留你原来的变量名和思路)
 * ------------------------------------------------------------
 * 和你原来的代码只差两处:
 *   ① 用 push 追加,不再用 [strs[j], ...] 拼接;
 *   ② 最后 filter(Boolean) 把 null 占位删掉。
 *   (strs[j] = null 这句必须留着,否则重复的字符串会留在数组里)
 * 能过,但「在入参上原地改写」在面试里是减分项,只作对照。
 * ============================================================ */
var groupAnagramsMinFix = function (strs) {
  let string = [];
  for (let i = 0; i < strs.length; i++) {
    string[i] = [...strs[i]].sort().join('');
  }

  const myMap = {};
  for (let j = 0; j < string.length; j++) {
    if (myMap[string[j]] !== undefined) {
      strs[myMap[string[j]]].push(strs[j]); // ← 原版这里是 [strs[j], ...strs[...]]
      strs[j] = null;                       // ← 留占位,最后统一删
    } else {
      strs[j] = [strs[j]];
      myMap[string[j]] = j;
    }
  }

  return strs.filter(Boolean); // ← 干掉 null 占位
};

/* ============================================================
 * 本地自测(LeetCode 上没有这段,本地跑必须自己写)
 * ============================================================ */

// 组内顺序、组间顺序都不重要,先归一化再比
function normalize(groups) {
  return groups
    .map((g) => [...g].sort())
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

const cases = [
  { input: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], expect: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
  { input: [''], expect: [['']] },
  { input: ['a'], expect: [['a']] },
  { input: ['', ''], expect: [['', '']] },                 // 都是空串 -> 同一组
  { input: ['ab', 'ba', 'abc', 'cba', 'bca', 'xx'], expect: [['ab', 'ba'], ['abc', 'cba', 'bca'], ['xx']] },
  { input: ['aaa', 'bbb', 'aaa'], expect: [['aaa', 'aaa'], ['bbb']] }, // 重复串
];

function run(name, fn) {
  console.log(`\n===== ${name} =====`);
  let pass = 0;

  cases.forEach((c, idx) => {
    const inputCopy = [...c.input];            // 备份,用来检查有没有改坏入参
    let actual, err = null;
    try {
      actual = fn([...c.input]);
    } catch (e) {
      err = e;
    }

    const ok =
      !err &&
      JSON.stringify(normalize(actual)) === JSON.stringify(normalize(c.expect));
    if (ok) pass++;

    // 顺带检查:入参有没有被就地改写
    const mutated = JSON.stringify(c.input) !== JSON.stringify(inputCopy);

    console.log(
      `${ok ? '✅' : '❌'} 用例${idx + 1} 输入=${JSON.stringify(inputCopy)}` +
        (err ? `\n     抛错: ${err.message}` : `\n     得到=${JSON.stringify(actual)}`) +
        `\n     期望=${JSON.stringify(c.expect)}` +
        (mutated ? `\n     ⚠️  入参被就地改写了: ${JSON.stringify(c.input)}` : '')
    );
  });

  console.log(`结果: ${pass}/${cases.length} 通过`);
}

run('解法 1 · 独立输出数组 + Map(推荐)', groupAnagrams);
run('解法 2 · 最小改动版(保留原思路)', groupAnagramsMinFix);

/* ============================================================
 * 复杂度
 *   n = 字符串个数,k = 最长字符串长度
 *   时间 O(n · k log k)  —— 每个串排序一次
 *   空间 O(n · k)        —— 存结果 + 哈希表
 * 进阶:用 26 位字母计数(数组当钥匙)替掉排序,
 *      时间可降到 O(n · k),等这题复习时再试。
 * ============================================================ */
