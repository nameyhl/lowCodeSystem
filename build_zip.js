// 只打印npm run build输出的文件内容,不答应过程内容,使用的execSync同步方法
// 因为浏览器使用的是es模块，所以需要使用import引入模块
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// 在es模块中没有__dirname和__filename，所以需要使用fileURLToPath和path.dirname来获取当前目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 先运行npm run build
try {
  console.log('开始构建项目...')
  // 使用execSync同步执行npm run build命令
  const stdout = execSync('pnpm run build', { encoding: 'utf-8' })
  // 打印构建内容
  console.log(stdout)
} catch (error) {
  console.error(`构建失败: ${error.message}`)
  console.log('请在控制台输入')
  console.log('pnpm run build检查问题')
  // 为了忽略eslint报错
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// 打包后的dist文件路径
const distDir = path.join(__dirname, 'dist') // 打包后可能不是dist文件，可能是自定义的，如果是自定义的，将dist改成自定义文件名

// 检查__dirname路径下是否存在dist目录打包后的文件
try {
  // 获取__dirname路径下所有文件
  const items = fs.readdirSync(__dirname)
  // 检查items中是否包含以前打包的.zip的文件
  const oldFiles = items.filter((item) => item.startsWith('lowcodesystem_'))
  if (oldFiles.length > 0) {
    console.warn(`警告: 存在以前打包的文件: ${oldFiles.join(', ')}, 自动将文件备份到backup目录`)
    // 存在文件，将文件移动到备份目录
    const backupDir = path.join(__dirname, 'backup')
    // 检查是否存在backupDir目录，不存在则创建
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }
    // 将以前打包的文件放入备份文件中
    oldFiles.forEach((file) => {
      fs.renameSync(path.join(__dirname, file), path.join(backupDir, file))
    })
  }
} catch (error) {
  console.error(`读取__dirname路径下文件失败: ${error.message}`)
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// 定义打包压缩后的文件名
const outputPath = path.join(
  __dirname,
  `lowcodesystem_${new Date().toISOString().split('T')[0]}.zip`,
)

console.log('开始打包压缩...')

// 检查dist目录是否存在，如果不存在则提醒用户npm run build打包未成功
if (!fs.existsSync(distDir)) {
  console.error('错误: dist目录不存在，请先运行 pnpm run build')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// 创建输出文件
const output = fs.createWriteStream(outputPath)
const archive = archiver('zip', {
  zlib: { level: 9 }, // 设置压缩级别
})

// 处理错误事件
archive.on('error', (err) => {
  console.error('压缩过程中出错:', err.message)
  // eslint-disable-next-line no-undef
  process.exit(1)
})

// 处理完成事件
output.on('close', () => {
  console.log(`压缩成功！共压缩了 ${archive.pointer()} 字节`)
  console.log(`打包文件已生成: ${outputPath}`)
})

// 连接管道
archive.pipe(output)

// 添加dist目录下的所有文件到压缩包
archive.directory(distDir, false)

// 执行打包
archive
  .finalize()
  .then(() => {
    console.log('打包任务完成！')
  })
  .catch((err) => {
    console.error('打包失败:', err.message)
    // eslint-disable-next-line no-undef
    process.exit(1)
  })
