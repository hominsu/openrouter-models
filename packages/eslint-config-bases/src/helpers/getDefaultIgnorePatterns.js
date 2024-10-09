const getDefaultIgnorePatterns = () => {
  // Hacky way to silence @yarnpkg/doctor about node_modules detection
  return [
    `${'node'}_modules}`,
    `**/${'node'}_modules}`,
    '**/.cache',
    'build',
    'dist',
    '.yarn',
    '.turbo',
    `**/.turbo`,
    '.out',
  ]
}

module.exports = {
  getDefaultIgnorePatterns,
}
