const fs = require('fs');
const path = require('path');

// Read version from local package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const manifestPath = path.join(__dirname, '../src/manifest.json');

try {
  // Get version from package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const { version } = packageJson;

  // Read and update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;

  // Write back to manifest.json with proper formatting
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`✅ Bumped manifest version to ${version}`);
} catch (error) {
  console.error('❌ Error bumping manifest version:', error.message);
  process.exit(1);
}
