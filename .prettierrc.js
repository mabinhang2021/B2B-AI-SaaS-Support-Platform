// .prettierrc.js
/** @type {import("prettier").Config} */
module.exports = {
  // 核心样式规则
  // 使用单引号代替双引号。 (因为在 JSX 中经常要用双引号，JS 部分用单引号可避免转义)
  singleQuote: true,

  // 语句末尾添加分号。
  semi: true,

  // 缩进宽度为 2 个空格（这是 JavaScript 的标准惯例）。
  tabWidth: 2,

  // 对象、数组等的多行结构中，末尾始终添加逗号 (ES5, 尤其利于 Git diff)。
  trailingComma: "all",

  // 箭头函数只有一个参数时，也使用括号包住参数。
  arrowParens: "always",

  // 强制单行代码的最大长度，超出则换行。
  printWidth: 80,

  // 尖括号是否换行：将多行 HTML/JSX 元素的 > 放在最后一行末尾。
  bracketSameLine: false,
};
