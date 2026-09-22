#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const sanitize = (name) =>
  name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim() || 'assignment';

const htmlTemplate = (n, name) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name} - Question ${n}</title>
</head>
<body>
  <h1>Question ${n}</h1>
  <input id="input" placeholder="Your answer">
  <button onclick="processInput()">Submit</button>
  <p id="output"></p>
  <script src="js-question-${n}.js"></script>
</body>
</html>
`;

const jsTemplate = (n) => `function processInput() {
  const value = document.getElementById('input').value;
  // TODO: process the input for question ${n}
  document.getElementById('output').textContent = value;
}
`;

async function main() {
  const name = await ask('Assignment name: ');
  const count = parseInt(await ask('Number of questions: '), 10);

  if (isNaN(count) || count <= 0) {
    console.error('Number of questions must be a positive integer.');
    rl.close();
    return;
  }

  const folder = path.join(process.cwd(), sanitize(name));
  fs.mkdirSync(folder, { recursive: true });

  for (let i = 1; i <= count; i++) {
    fs.writeFileSync(path.join(folder, `html-question-${i}.html`), htmlTemplate(i, name));
    fs.writeFileSync(path.join(folder, `js-question-${i}.js`), jsTemplate(i));
  }

  console.log(`Created ${count * 2} files in ${folder}`);
  rl.close();
}

main();