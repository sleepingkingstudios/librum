const express = require('express');
const path = require('path');
const app = express();
const port = 5200;

if (process.env.NODE_ENV === 'production') {
  console.log('serving static files!');
}

app.get('/*', function (req, res) {
  res.sendFile(
    path.join(
      __dirname,
      'index.dev.html'
    )
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
