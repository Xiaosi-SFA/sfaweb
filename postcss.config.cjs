module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 生产构建时移除注释并进一步压缩 CSS
    // cssnano 会在 dev 下保持关闭（由构建环境决定），在 build 中启用
    cssnano: process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: { removeAll: true },
      }]
    } : false,
  },
}
