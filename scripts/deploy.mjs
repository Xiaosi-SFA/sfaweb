#!/usr/bin/env node

/**
 * deploy.mjs
 * 一键自动化构建、提交、合并与发布脚本
 *
 * 用法：
 *   pnpm deploy
 *   pnpm deploy "feat: 发布新文章"
 *   pnpm deploy --skip-build "content: 更新活动"
 *
 * 执行流程：
 *   1. 运行 pnpm build 执行静态构建预检（确保无语法/编译错误）；
 *   2. 自动暂存并提交当前分支的未保存修改（如未传提交信息则自动生成带时间戳的说明）；
 *   3. 推送当前工作分支（如 dev）至远程仓库；
 *   4. 自动切换至 main 分支并合并 dev，推送到 origin/main 触发 GitHub Actions 自动部署；
 *   5. 自动切回原工作分支，无缝继续开发。
 */

import { execSync } from 'node:child_process'
import readline from 'node:readline'

const args = process.argv.slice(2)

// 解析命令行参数
const isHelp = args.includes('-h') || args.includes('--help')
const skipBuild = args.includes('-s') || args.includes('--skip-build')
const rawMessageArgs = args.filter((arg) => !arg.startsWith('-'))
let commitMessage = rawMessageArgs.join(' ').trim()

if (isHelp) {
  console.log(`
🚀 SFA Web 一键自动发布与部署工具

用法:
  pnpm deploy [提交说明] [选项]
  pnpm ship [提交说明] [选项]

示例:
  pnpm deploy
  pnpm deploy "feat: 添加社团新成员"
  pnpm deploy --skip-build "content: 修正错别字"

选项:
  -s, --skip-build   跳过本地 pnpm build 静态构建预检
  -h, --help         显示帮助信息
`)
  process.exit(0)
}

function logStep(step, total, message) {
  console.log(`\n\x1b[1;36m[${step}/${total}]\x1b[0m \x1b[1m${message}\x1b[0m`)
}

function logSuccess(message) {
  console.log(`\x1b[1;32m✔ ${message}\x1b[0m`)
}

function logWarn(message) {
  console.log(`\x1b[1;33m⚠ ${message}\x1b[0m`)
}

function logError(message) {
  console.error(`\x1b[1;31m✖ ${message}\x1b[0m`)
}

function run(command, options = {}) {
  return execSync(command, {
    stdio: options.silent ? 'pipe' : 'inherit',
    encoding: 'utf-8',
    ...options,
  })
}

function getOutput(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim()
  } catch {
    return ''
  }
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${y}-${m}-${d} ${h}:${min}`
}

async function promptMessage() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    const defaultMsg = `content: update site (${formatDate(new Date())})`
    rl.question(`\x1b[33m请输入本次提交信息 [默认: ${defaultMsg}]: \x1b[0m`, (answer) => {
      rl.close()
      resolve(answer.trim() || defaultMsg)
    })
  })
}

async function main() {
  const startTime = Date.now()
  const currentBranch = getOutput('git rev-parse --abbrev-ref HEAD')

  if (!currentBranch) {
    logError('无法识别当前 Git 仓库与分支！')
    process.exit(1)
  }

  console.log(`\x1b[1;35m========================================\x1b[0m`)
  console.log(`\x1b[1;35m   🌟 SFA Web 自动化部署流水线启动     \x1b[0m`)
  console.log(`\x1b[1;35m========================================\x1b[0m`)
  console.log(`当前分支: \x1b[1;33m${currentBranch}\x1b[0m\n`)

  const TOTAL_STEPS = currentBranch === 'main' ? 3 : 5

  // 1. 本地构建预检
  if (!skipBuild) {
    logStep(1, TOTAL_STEPS, '执行本地静态构建预检 (pnpm build)...')
    try {
      run('pnpm build')
      logSuccess('静态构建检查通过！')
    } catch (err) {
      logError('静态构建检查失败！请修复编译错误后再尝试部署。')
      process.exit(1)
    }
  } else {
    logWarn('已跳过本地构建预检 (--skip-build)')
  }

  // 2. 检查暂存区与未提交代码
  const status = getOutput('git status --porcelain')
  const hasChanges = status.length > 0

  if (hasChanges) {
    if (!commitMessage) {
      if (process.stdout.isTTY) {
        commitMessage = await promptMessage()
      } else {
        commitMessage = `content: update site (${formatDate(new Date())})`
      }
    }

    logStep(2, TOTAL_STEPS, `提交工作区更改: "${commitMessage}"...`)
    run('git add -A')
    run(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`)
    logSuccess('工作区修改已成功提交！')
  } else {
    logStep(2, TOTAL_STEPS, '工作区干净，无需创建新提交。')
  }

  // 3. 推送当前分支
  logStep(3, TOTAL_STEPS, `推送当前分支 [${currentBranch}] 到远程 origin...`)
  try {
    run(`git push origin ${currentBranch}`)
    logSuccess(`分支 [${currentBranch}] 推送成功！`)
  } catch (err) {
    logError(`推送分支 [${currentBranch}] 失败，请检查网络或冲突！`)
    process.exit(1)
  }

  // 4. 若当前在 dev 或非 main 分支，自动合并到 main 并推送
  if (currentBranch !== 'main') {
    logStep(4, TOTAL_STEPS, `合并 [${currentBranch}] 到 [main] 分支并部署...`)
    try {
      run('git checkout main')
      run('git pull origin main --rebase', { silent: true })
      run(`git merge ${currentBranch} --no-edit`)
      run('git push origin main')
      logSuccess('main 分支已同步推送！GitHub Pages 部署工作流已触发。')
    } catch (err) {
      logError('合并或推送 main 分支失败！请手动检查冲突。')
      // 尝试切回原分支
      try { run(`git checkout ${currentBranch}`); } catch (_) {}
      process.exit(1)
    } finally {
      // 5. 自动切回原开发分支
      logStep(5, TOTAL_STEPS, `切回工作分支 [${currentBranch}]...`)
      run(`git checkout ${currentBranch}`)
      logSuccess(`已安全切回分支 [${currentBranch}]，可无缝继续开发！`)
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n\x1b[1;32m========================================\x1b[0m`)
  console.log(`\x1b[1;32m   🎉 部署已全部就绪！总耗时: ${duration}s     \x1b[0m`)
  console.log(`\x1b[1;32m========================================\x1b[0m`)
  console.log(`\n📡 部署进度追踪: \x1b[4;36mhttps://github.com/Xiaosi-SFA/sfaweb/actions\x1b[0m`)
  console.log(`🌐 网站在线地址: \x1b[4;36mhttps://xiaosi-sfa.github.io/sfaweb/\x1b[0m\n`)
}

main().catch((err) => {
  logError(`执行异常: ${err.message}`)
  process.exit(1)
})
