const fan = document.getElementById('fan');
const statusEl = document.getElementById('status');
const hashrateEl = document.getElementById('hashrate');
const btn = document.getElementById('fanBtn');
const balanceEl = document.getElementById('balance');

let mining = false;
let worker = null;
let totalHashes = 0;
let lastTime = performance.now();
let tonBalance = 0.000;
let miningInterval = null;

function startMining() {
  if (worker) worker.terminate();
  
  worker = new Worker(URL.createObjectURL(new Blob([`
    let nonce = 0;
    let hashes = 0;
    function heavyLoop() {
      while(true) {
        nonce++;
        hashes++;
        let dummy = nonce ** 2;
        for(let i=0; i<800; i++) {
          dummy = Math.sin(dummy) + Math.cos(nonce + i);
        }
        if(hashes % 3000 === 0) postMessage({hashes});
      }
    }
    heavyLoop();
  `], { type: 'application/javascript' })));
  
  worker.onmessage = (e) => {
    if (e.data.hashes) totalHashes += e.data.hashes;
  };
  
  mining = true;
  fan.classList.add('spinning');
  statusEl.textContent = "TON Mining chal rahi hai... 🔥 RGB ON";
  statusEl.className = "status mining";
  
  // Fake hashrate
  setInterval(() => {
    if (!mining) return;
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;
    const hps = (totalHashes / (delta / 1000)).toFixed(1);
    hashrateEl.textContent = `Hashrate: ~${hps} H/s (demo)`;
  }, 2000);
  
  // Fake TON balance increase
  miningInterval = setInterval(() => {
    if (!mining) return;
    tonBalance += 0.00012 + Math.random() * 0.00008;
    balanceEl.textContent = `Balance: ${tonBalance.toFixed(3)} TON`;
  }, 12000);
}

function stopMining() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  if (miningInterval) clearInterval(miningInterval);
  mining = false;
  fan.classList.remove('spinning');
  statusEl.textContent = "Mining band – Tap karke shuru karo";
  statusEl.className = "status stopped";
  hashrateEl.textContent = "Hashrate: 0 H/s";
  totalHashes = 0;
  lastTime = performance.now();
}

btn.addEventListener('click', () => {
  if (mining) stopMining();
  else startMining();
});

window.addEventListener('beforeunload', stopMining);
