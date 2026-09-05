#!/usr/bin/env node

/**
 * sync-github-member.mjs
 * 自动从 GitHub 主页获取成员信息并生成/更新 content/members/{department}/{username}.md
 *
 * 用法：
 *   node scripts/sync-github-member.mjs <github-url-or-username> [department] [custom-label] [position]
 *
 * 示例：
 *   node scripts/sync-github-member.mjs https://github.com/Visio-Vanitas newmedia "SFA 官网核心开发者" minister
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')

const [,, targetInput, deptInput = 'newmedia', labelInput, positionInput = 'member'] = process.argv

if (!targetInput) {
  console.error('❌ 请提供 GitHub 用户名或主页 URL！')
  console.error('用法: node scripts/sync-github-member.mjs <github-url-or-username> [department] [custom-label] [position]')
  process.exit(1)
}

const username = targetInput.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '')

async function fetchGitHubUser(user) {
  const url = `https://api.github.com/users/${user}`
  const headers = {
    'User-Agent': 'SFA-Website-Member-Sync',
    'Accept': 'application/vnd.github.v3+json',
  }

  // 若本地有 GITHUB_TOKEN 或 GH_TOKEN 则自动携带，避免 API 限流
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  console.log(`🌐 正在从 GitHub 获取用户 [${user}] 资料...`)
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`GitHub API 请求失败: HTTP ${res.status} ${res.statusText}`)
  }
  return await res.json()
}

async function main() {
  try {
    const data = await fetchGitHubUser(username)
    const displayName = data.name || data.login
    const avatar = data.avatar_url || `https://github.com/${username}.png`
    const bio = (data.bio || '').replace(/\r?\n/g, ' ').trim()
    const quote = data.company ? `${data.company}` : ''
    const department = deptInput.toLowerCase()
    const position = positionInput || 'member'
    const label = labelInput || ''

    const targetDir = path.join(ROOT_DIR, 'src', 'content', 'members', department)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const targetFile = path.join(targetDir, `${username.toLowerCase()}.md`)

    const lines = [
      '---',
      `name: ${displayName}`,
      `github: https://github.com/${username}`,
      `avatar: ${avatar}`,
      `position: ${position}`,
    ]

    if (label) {
      lines.push(`label: ${label}`)
    }
    if (quote) {
      lines.push(`quote: ${quote}`)
    }
    if (bio) {
      lines.push(`bio: ${bio}`)
    }
    lines.push('---', '')

    fs.writeFileSync(targetFile, lines.join('\n'), 'utf-8')
    console.log(`✅ 成员卡片已成功同步并写入: ${targetFile}`)
    console.log(`   - 姓名: ${displayName}`)
    console.log(`   - GitHub: https://github.com/${username}`)
    console.log(`   - 部门: ${department}`)
    if (label) console.log(`   - 职位标签: ${label}`)
    if (bio) console.log(`   - 简介: ${bio}`)
  } catch (err) {
    console.error(`❌ 同步失败:`, err.message)
    process.exit(1)
  }
}

main()
