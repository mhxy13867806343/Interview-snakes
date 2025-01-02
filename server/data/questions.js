export const frontendQuestions = [
  {
    id: 1,
    title: '[js] 第2085天 如何使用WebRTC实现录音功能?',
    category: 'JavaScript',
    difficulty: '中等',
    description: '请详细解释如何使用WebRTC实现浏览器端的录音功能，包括音频采集、编码和保存等步骤。',
    answer: 'WebRTC实现录音功能的步骤如下：\n\n1. 获取音频流：\n```javascript\nasync function getAudioStream() {\n  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });\n  return stream;\n}\n```\n\n2. 创建MediaRecorder：\n```javascript\nconst mediaRecorder = new MediaRecorder(stream);\n```\n\n3. 监听数据：\n```javascript\nconst audioChunks = [];\nmediaRecorder.ondataavailable = (event) => {\n  audioChunks.push(event.data);\n};\n```\n\n4. 开始和停止录音：\n```javascript\nmediaRecorder.start();\n// 停止录音\nmediaRecorder.stop();\n```\n\n5. 生成音频文件：\n```javascript\nmediaRecorder.onstop = () => {\n  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });\n  const audioUrl = URL.createObjectURL(audioBlob);\n  // 可以创建audio元素播放\n  const audio = new Audio(audioUrl);\n};\n```\n\n注意事项：\n1. 需要请求用户授权\n2. 考虑浏览器兼容性\n3. 注意内存管理，及时释放资源\n\n更多参考：\nhttp://www.h-camel.com/index.html\nhttp://www.h-camel.com/contribution.html'
  },
  {
    id: 2,
    title: '[Vue3] Composition API与Options API的区别和使用场景',
    category: 'Vue',
    difficulty: '中等',
    description: '详细对比Vue3的Composition API和Options API的优缺点，并说明各自适用的场景。',
    answer: '1. Composition API优点：\n- 更好的代码组织\n- 更好的类型推导\n- 更好的代码复用\n- 更小的打包体积\n\n2. Options API优点：\n- 更直观易懂\n- 适合小型组件\n- 学习成本低\n\n3. 使用场景：\nComposition API适合：\n- 大型组件\n- 需要复用逻辑的场景\n- TypeScript项目\n\nOptions API适合：\n- 简单组件\n- 学习阶段\n- 快速开发原型'
  },
  {
    id: 3,
    title: '[性能] 前端性能优化的关键指标和优化策略',
    category: '性能优化',
    difficulty: '困难',
    description: '请详细说明前端性能优化的关键指标（Core Web Vitals）以及相应的优化策略。',
    answer: '关键指标：\n1. LCP (Largest Contentful Paint)\n2. FID (First Input Delay)\n3. CLS (Cumulative Layout Shift)\n\n优化策略：\n1. 加载性能：\n- 资源压缩\n- 懒加载\n- CDN加速\n- HTTP缓存\n\n2. 运行时性能：\n- 代码分割\n- Tree Shaking\n- 虚拟列表\n- Web Workers\n\n3. 渲染性能：\n- SSR/SSG\n- 骨架屏\n- 图片优化\n- CSS优化'
  },
  {
    id: 4,
    title: '[TypeScript] 高级类型和类型体操',
    category: 'TypeScript',
    difficulty: '困难',
    description: '请解释TypeScript中的高级类型用法，包括条件类型、映射类型、工具类型等。',
    answer: '1. 条件类型：\n```typescript\ntype IsString<T> = T extends string ? true : false;\n```\n\n2. 映射类型：\n```typescript\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n```\n\n3. 工具类型：\n```typescript\ntype Pick<T, K extends keyof T> = {\n  [P in K]: T[P];\n};\n```\n\n4. 实战示例：\n```typescript\ntype DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object\n    ? DeepReadonly<T[P]>\n    : T[P];\n};\n```'
  },
  {
    id: 5,
    title: '[工程化] Monorepo项目的最佳实践',
    category: '工程化',
    difficulty: '中等',
    description: '如何使用pnpm/yarn workspace搭建和管理Monorepo项目？包括依赖管理、构建优化等方面。',
    answer: '1. 工具选择：\n- pnpm workspace\n- turborepo\n- nx\n\n2. 项目结构：\n```\n├── packages/\n│   ├── pkg1/\n│   ├── pkg2/\n│   └── pkg3/\n├── pnpm-workspace.yaml\n└── package.json\n```\n\n3. 依赖管理：\n```json\n{\n  "dependencies": {\n    "@scope/pkg1": "workspace:*"\n  }\n}\n```\n\n4. 构建优化：\n- 构建缓存\n- 并行构建\n- 增量构建'
  },
  {
    id: 6,
    title: '[React] React 18新特性及其使用',
    category: 'React',
    difficulty: '中等',
    description: 'React 18带来了哪些重要的新特性？如何在项目中合理使用这些特性？',
    answer: '主要特性：\n\n1. Concurrent Mode：\n```jsx\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);\n```\n\n2. Automatic Batching：\n```jsx\nsetTimeout(() => {\n  setCount(c => c + 1); // 不会重新渲染\n  setFlag(f => !f);    // 不会重新渲染\n  // React 只会在这里重新渲染一次\n}, 1000);\n```\n\n3. Suspense：\n```jsx\n<Suspense fallback={<Loading />}>\n  <SomeComponent />\n</Suspense>\n```\n\n4. useTransition：\n```jsx\nconst [isPending, startTransition] = useTransition();\n\nstartTransition(() => {\n  setCount(count + 1);\n});\n```'
  },
  {
    id: 7,
    title: '[网络] HTTP/3和QUIC协议',
    category: '网络',
    difficulty: '中等',
    description: 'HTTP/3和QUIC协议的特点是什么？与HTTP/2相比有哪些优势？',
    answer: '1. QUIC特点：\n- 基于UDP\n- 内置加密\n- 0-RTT连接\n- 多路复用\n\n2. HTTP/3优势：\n- 改善了队头阻塞\n- 更好的移动支持\n- 更快的连接建立\n- 改进的拥塞控制\n\n3. 与HTTP/2对比：\n- 传输层协议不同\n- 连接建立更快\n- 更好的丢包处理'
  },
  {
    id: 8,
    title: '[构建] Vite原理及优化实践',
    category: '构建工具',
    difficulty: '中等',
    description: 'Vite的核心原理是什么？如何优化Vite项目的构建性能？',
    answer: '1. 核心原理：\n- 开发环境：原生ESM\n- 生产环境：Rollup\n- 预构建：esbuild\n\n2. 性能优化：\n```js\n// vite.config.js\nexport default {\n  build: {\n    target: "es2015",\n    minify: "terser",\n    cssCodeSplit: true,\n    rollupOptions: {\n      output: {\n        manualChunks: {}\n      }\n    }\n  }\n}\n```\n\n3. 最佳实践：\n- 合理使用动态导入\n- 优化依赖预构建\n- CSS代码分割\n- 使用现代浏览器特性'
  },
  {
    id: 9,
    title: '[安全] 前端安全最佳实践',
    category: '安全',
    difficulty: '困难',
    description: '如何防范常见的前端安全问题？包括XSS、CSRF、点击劫持等。',
    answer: '1. XSS防范：\n```js\n// 转义HTML\nfunction escapeHtml(str) {\n  return str.replace(/[&<>"\']/g, m => ({\n    "&": "&amp;",\n    "<": "&lt;",\n    ">": "&gt;",\n    \'"\': "&quot;",\n    "\'": "&#39;"\n  })[m]);\n}\n```\n\n2. CSRF防范：\n- 验证码\n- Token验证\n- Same-site Cookie\n\n3. 点击劫持：\n```http\nX-Frame-Options: SAMEORIGIN\n```\n\n4. 其他措施：\n- CSP\n- HTTPS\n- 输入验证\n- 密码安全'
  },
  {
    id: 10,
    title: '[ES6+] 异步编程的演进',
    category: 'JavaScript',
    difficulty: '中等',
    description: '从回调到Promise，再到async/await，JavaScript异步编程的发展历程是怎样的？',
    answer: '1. 回调时代：\n```js\nfs.readFile("file.txt", (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\n```\n\n2. Promise：\n```js\nfetch("/api/data")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n```\n\n3. async/await：\n```js\nasync function getData() {\n  try {\n    const res = await fetch("/api/data");\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```'
  }
];

export const backendQuestions = [
  {
    id: 1,
    title: '什么是RESTful API？',
    category: '后端架构',
    difficulty: '简单',
    description: '请解释RESTful API的概念和设计原则。',
    answer: 'RESTful API是一种软件架构风格：\n1. 使用HTTP动词（GET/POST/PUT/DELETE）\n2. 无状态\n3. 资源的合理URL设计\n4. 正确使用HTTP状态码\n5. 数据的序列化（通常使用JSON）'
  },
  {
    id: 2,
    title: '数据库索引原理',
    category: '数据库',
    difficulty: '中等',
    description: '请详细说明数据库索引的工作原理和使用注意事项。',
    answer: '数据库索引原理：\n1. B+树的数据结构\n2. 提高查询效率\n3. 降低写入性能\n\n使用注意：\n1. 适合经常查询的字段\n2. 避免过多索引\n3. 考虑组合索引\n4. 维护索引的成本'
  },
  {
    id: 3,
    title: '分布式系统的CAP理论',
    category: '分布式系统',
    difficulty: '困难',
    description: '请解释CAP理论，以及在分布式系统设计中如何权衡。',
    answer: 'CAP理论：\n1. 一致性（Consistency）\n2. 可用性（Availability）\n3. 分区容错性（Partition tolerance）\n\n实际应用：\n- CP：强一致性系统（如分布式数据库）\n- AP：高可用系统（如CDN）\n- 不可能同时满足CAP三个特性'
  }
];

export const algorithmQuestions = [
  {
    id: 1,
    title: '两数之和',
    category: '数组',
    difficulty: '简单',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
    answer: '解题思路：\n1. 使用哈希表存储遍历过的数字和索引\n2. 遍历数组，对于每个数x，查找target-x是否在哈希表中\n3. 时间复杂度O(n)，空间复杂度O(n)'
  },
  {
    id: 2,
    title: '反转链表',
    category: '链表',
    difficulty: '简单',
    description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
    answer: '解题思路：\n1. 迭代方法：使用三个指针prev、curr、next\n2. 递归方法：先反转后续节点，再处理当前节点\n3. 时间复杂度O(n)，空间复杂度O(1)'
  },
  {
    id: 3,
    title: '二叉树的层序遍历',
    category: '树',
    difficulty: '中等',
    description: '给你二叉树的根节点 root ，返回其节点值的层序遍历。',
    answer: '解题思路：\n1. 使用队列进行BFS\n2. 每一层单独处理\n3. 时间复杂度O(n)，空间复杂度O(n)'
  }
];
