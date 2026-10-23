const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const REPO_URL = 'https://github.com/POOJA141104/Mobileapp.git';
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

console.log('🚀 Starting GitHub Pages deployment...');

// 1. Verify dist/ exists
if (!fs.existsSync(DIST_DIR) || fs.readdirSync(DIST_DIR).length === 0) {
  console.error('❌ Error: dist/ directory is missing or empty. Please run "npm run predeploy" first!');
  process.exit(1);
}

// 2. Create isolated temp directory
const tempDir = path.join(os.tmpdir(), `gh-pages-${Date.now()}`);
fs.mkdirSync(tempDir, { recursive: true });
console.log(`📁 Created temp deploy workspace: ${tempDir}`);

try {
  // 3. Copy all files recursively from dist/ to tempDir
  fs.cpSync(DIST_DIR, tempDir, { recursive: true });
  console.log('📦 Copied all web export bundle files.');

  // 4. Create empty .nojekyll file to preserve _expo and hidden folders on GitHub Pages
  fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
  console.log('📄 Added .nojekyll file.');

  // 5. Ensure no rogue .gitignore skips icon fonts in node_modules path
  const tempGitignore = path.join(tempDir, '.gitignore');
  if (fs.existsSync(tempGitignore)) {
    fs.unlinkSync(tempGitignore);
  }

  // Helper to execute git commands inside temp directory
  const runGit = (cmd) => {
    console.log(`> git ${cmd}`);
    return execSync(`git ${cmd}`, { cwd: tempDir, stdio: 'inherit' });
  };

  // 6. Initialize git repo and commit
  runGit('init');
  runGit('checkout -B gh-pages');
  runGit('config user.name "POOJA141104"');
  runGit('config user.email "poojaunnikrishnan25@gmail.com"');
  runGit('add -A');
  runGit(`commit -m "Deploy FreshMart to GitHub Pages - ${new Date().toISOString()}"`);

  // 7. Push to GitHub gh-pages branch
  runGit(`remote add origin ${REPO_URL}`);
  console.log('📤 Pushing to remote branch "gh-pages"...');
  runGit('push --force origin gh-pages');

  console.log('\n🎉 SUCCESS! FreshMart has been deployed to the "gh-pages" branch!');
  console.log('🌐 Live GitHub Pages URL: https://pooja141104.github.io/Mobileapp/');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} finally {
  // Clean up temp dir
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    // ignore cleanup errors
  }
}

