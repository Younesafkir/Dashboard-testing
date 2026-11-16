const fs = require('fs');
const { execSync } = require('child_process');

const html = fs.readFileSync('src/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

if (scripts.length === 0) {
  throw new Error('No <script> blocks found in src/index.html');
}

let output = html;
scripts.forEach((match, i) => {
  const jsCode = match[1];
  const tempFile = temp_${i}.js;
  fs.writeFileSync(tempFile, jsCode);
  execSync(javascript-obfuscator ${tempFile} --output ${tempFile}.out --compact true --control-flow-flattening true --string-array true --rename-globals false);
  const obfuscated = fs.readFileSync(${tempFile}.out, 'utf8');
  output = output.replace(match[0], <script>${obfuscated}</script>);
  fs.unlinkSync(tempFile);
  fs.unlinkSync(${tempFile}.out);
});

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', output);
console.log(Obfuscated ${scripts.length} script block(s) into dist/index.html);
