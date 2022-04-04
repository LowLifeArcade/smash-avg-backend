const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

const numCpu = os.cpus().length;

app.get('/', (req, res) => {
  setTimeout(() => {
    // codeStuff
    console.log('long process', process.pid);
  }, 2000);
  res.send('ok');
  cluster.worker.kill(); 
});

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker${worker.process.pid} died`);
    cluster.fork()
  });
} else {
  app.listen(3000, () =>
    console.log(
      `💨🚀 server started ${
        process.pid ? process.pid : ''
      } http://localhost:3000`
    )
  );
}
