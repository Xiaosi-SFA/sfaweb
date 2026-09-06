#!/usr/bin/env node

/**
 * deploy.mjs
 * SFA Web 一键自动化构建、合并与发布脚本（含仓库管理员权限控制）
 *
 * 用法：
 *   pnpm deploy
 *   pnpm deploy "feat: 发布新文章"
 *   pnpm deploy --skip-build "content: 更新活动"
 */

import { execSync } from 'node:child_process'
import readline from 'node:readline'

const args = process.argv.slice(2)
const isHelp = args.includes('-h') || args.includes('--help')
const skipBuild = args.includes('-s') || args.includes('--skip-build')
const allowWriteRole = args.includes('--allow-write')
const rawMessageArgs = args.filter((arg) => !arg.startsWith('-'))
let commitMessage = rawMessageArgs.join(' ').trim()

if (isHelp) {
  console.log(`
🚀 SFA Web 自动化部署工具（管理员专用）

用法:
  pnpm ship [提交说明] [选项]
  pnpm release [提交说明] [选项]
  pnpm run deploy [提交说明] [选项]

示例:
  pnpm ship
  pnpm ship "feat: 添加社团新成员"
  pnpm ship --skip-build "content: 修正错别字"

选项:
  -s, --skip-build   跳过本地 pnpm build 静态构建预检
  --allow-write      允许具有写权限的协作者发布（默认仅限 ADMIN 仓库管理员）
  -h, --help         显示帮助信息

说明:
  本脚本受权限控制，执行前会自动校验当前用户的 GitHub 仓库管理员权限。
  非管理员创作者请通过 Pull Request 向 dev 分支提交稿件。
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
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
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

function checkAdminPermission() {
  const remoteUrl = getOutput('git remote get-url origin') || 'Xiaosi-SFA/xiaosi-sfa.github.io'
  const isUpstream = remoteUrl.includes('Xiaosi-SFA/xiaosi-sfa.github.io') || remoteUrl.includes('Xiaosi-SFA/sfaweb')

  try {
    const out = getOutput('gh repo view Xiaosi-SFA/xiaosi-sfa.github.io --json viewerPermission') ||
                getOutput('gh repo view Xiaosi-SFA/sfaweb --json viewerPermission')
    if (out) {
      const parsed = JSON.parse(out)
      const role = parsed.viewerPermission

      if (role === 'ADMIN') {
        return { allowed: true, role: 'ADMIN', detail: '仓库所有者/管理员' }
      }
      if (allowWriteRole && role === 'WRITE') {
        return { allowed: true, role: 'WRITE', detail: '仓库协作者（写权限）' }
      }
      return {
        allowed: false,
        role: role || 'UNKNOWN',
        detail: role === 'WRITE' ? '协作者（写权限，非管理员）' : '普通用户/无管理权限',
      }
    }
  } catch {
    // gh CLI 未配置或不可用时进入降级检测
  }

  if (!isUpstream) {
    return {
      allowed: false,
      role: 'FORK_USER',
      detail: '当前位于个人 Fork 仓库，无法直接向官方主仓库发布',
    }
  }

  try {
    execSync('git push --dry-run origin main', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return { allowed: true, role: 'GIT_PUSH_ACCESS', detail: '已验证主仓库直推权限' }
  } catch {
    return { allowed: false, role: 'NO_WRITE_ACCESS', detail: '无官方仓库直推权限' }
  }
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

function ensureAdminAccess() {
  process.stdout.write('🔒 正在校验仓库管理员身份...')
  const auth = checkAdminPermission()

  if (!auth.allowed) {
    console.log(`\n`)
    logError(`权限校验未通过：当前身份为【${auth.detail}】`)
    console.log(`
\x1b[1;33m──────────────────────────────────────────────────────────\x1b[0m
📌 \x1b[1m权限限制说明：\x1b[0m
   一键发布脚本 (\x1b[36mpnpm deploy\x1b[0m) 会直接同步并推送主分支 \x1b[32mmain\x1b[0m 触发生产部署，
   该操作严格限定为 \x1b[1m四川大学科幻协会官方仓库管理员 (ADMIN)\x1b[0m。

💡 \x1b[1m贡献者投稿指南：\x1b[0m
   1. 请将修改推送到个人 Fork 仓库的 \x1b[36mdev\x1b[0m 分支；
   2. 在 GitHub 上向官方仓库发起指向 \x1b[36mdev\x1b[0m 的 Pull Request；
   3. 经管理员审阅合并后，将自动触发构建并部署上线。
\x1b[1;33m──────────────────────────────────────────────────────────\x1b[0m
`)
    process.exit(1)
  }

  logSuccess(`管理员身份验证通过 (${auth.detail})`)
}

function runPreflightBuild(totalSteps) {
  if (!skipBuild) {
    logStep(1, totalSteps, '执行本地静态构建预检 (pnpm build)...')
    try {
      run('pnpm build')
      logSuccess('静态构建检查通过！')
    } catch {
      logError('静态构建检查失败！请修复编译错误后再尝试部署。')
      process.exit(1)
    }
  } else {
    logWarn('已跳过本地构建预检 (--skip-build)')
  }
}

async function handleWorkingTreeCommit(totalSteps) {
  const status = getOutput('git status --porcelain')
  if (!status.length) {
    logStep(2, totalSteps, '工作区干净，无需创建新提交。')
    return
  }

  if (!commitMessage) {
    commitMessage = process.stdout.isTTY
      ? await promptMessage()
      : `content: update site (${formatDate(new Date())})`
  }

  logStep(2, totalSteps, `提交工作区更改: "${commitMessage}"...`)
  run('git add -A')
  const safeMsg = commitMessage.replaceAll('"', String.raw`\"`)
  run(`git commit -m "${safeMsg}"`)
  logSuccess('工作区修改已成功提交！')
}

function deployMergeAndPush(currentBranch, totalSteps) {
  logStep(3, totalSteps, `推送当前分支 [${currentBranch}] 到远程 origin...`)
  try {
    run(`git push origin ${currentBranch}`)
    logSuccess(`分支 [${currentBranch}] 推送成功！`)
  } catch {
    logError(`推送分支 [${currentBranch}] 失败，请检查网络或分支冲突！`)
    process.exit(1)
  }

  if (currentBranch === 'main') return

  logStep(4, totalSteps, `合并 [${currentBranch}] 到 [main] 分支并部署...`)
  try {
    run('git checkout main')
    run('git pull origin main --rebase', { silent: true })
    run(`git merge ${currentBranch} --no-edit`)
    run('git push origin main')
    logSuccess('main 分支已同步推送！GitHub Pages 部署工作流已触发。')
  } catch {
    logError('合并或推送 main 分支失败！请手动检查冲突。')
    try {
      run(`git checkout ${currentBranch}`)
    } catch {
      // 容错忽略
    }
    process.exit(1)
  } finally {
    logStep(5, totalSteps, `切回工作分支 [${currentBranch}]...`)
    run(`git checkout ${currentBranch}`)
    logSuccess(`已安全切回分支 [${currentBranch}]，可无缝继续开发！`)
  }
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
  console.log(`\x1b[1;35m========================================\x1b[0m\n`)

  ensureAdminAccess()
  console.log(`当前工作分支: \x1b[1;33m${currentBranch}\x1b[0m`)

  const TOTAL_STEPS = currentBranch === 'main' ? 3 : 5

  runPreflightBuild(TOTAL_STEPS)
  await handleWorkingTreeCommit(TOTAL_STEPS)
  deployMergeAndPush(currentBranch, TOTAL_STEPS)

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n\x1b[1;32m========================================\x1b[0m`)
  console.log(`\x1b[1;32m   🎉 部署已全部就绪！总耗时: ${duration}s     \x1b[0m`)
  console.log(`\x1b[1;32m========================================\x1b[0m`)
  console.log(`\n📡 部署进度追踪: \x1b[4;36mhttps://github.com/Xiaosi-SFA/xiaosi-sfa.github.io/actions\x1b[0m`)
  console.log(`🌐 网站在线地址: \x1b[4;36mhttps://xiaosi-sfa.github.io/\x1b[0m\n`)
}

main().catch((err) => {
  logError(`执行异常: ${err.message}`)
  process.exit(1)
})
