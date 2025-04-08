/*
Copyright 2025 NTT DATA Group Corporation.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const dataDir = path.join(__dirname, 'data');

app.use(express.raw({ type: '*/*' }));

app.get('/', (req, res) => {
  res.redirect('/ui');
});

app.get('/ui', (req, res) => {
  const role = req.query.role || process.env.DEFAULT_ROLE || 'unknown';
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  fs.readdir(dataDir, (err, files) => {
    if (err) {
      console.error(`❌ Failed to read data dir (${dataDir}):`, err);
      return res.status(500).send('Unable to read files');
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>${capitalizedRole} Data Server</title></head>
        <body>
          <h1>📂 ${capitalizedRole} Data</h1>
          <ul>
            ${files.map(file => `<li><a href="/files/${file}" target="_blank">${file}</a></li>`).join('')}
          </ul>
        </body>
      </html>
    `;
    res.send(html);
  });
});

app.get('/files', (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) return res.status(500).send('Failed to read directory');
    res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  const filePath = path.join(dataDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.post('/upload', (req, res) => {
  try {
    const filename = `file-${Date.now()}`;
    const dest = path.join(dataDir, filename);
    fs.writeFileSync(dest, req.body);
    console.log(`✅ Received and saved: ${filename}`);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Failed to save file:', err);
    res.status(500).send('Failed to save file');
  }
});

// ✅ サーバ起動
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Data server running on port ${PORT}`);
});
