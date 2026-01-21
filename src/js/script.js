
import dataJson from './data.json'
import {
  Chart,
  Colors,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip
} from 'chart.js'

Chart.register(
  Colors,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip
);

function ligne(json) {
  return (json || [])
    .filter(r => r && r.name && r.time)
    .map(r => ({
      name: r.name,
      time: Number(r.time) || 0,
      family: r.family,
      status: r.status
    }));
}

function paire_graphe(rows) {
  const map = new Map();
  for (const r of rows) {
    const k = (r['name'] );
    const t = (r.time);
    const status = r.status || 'UNKNOWN';
    if (!map.has(k)) map.set(k, { finishedTime: 0, unfinishedTime: 0, statusCounts: {}, totalCount: 0 });
    const entry = map.get(k);
    const finished = status !== 'UNKNOWN' && t < 10000;
    if (finished) entry.finishedTime += t;
    else entry.unfinishedTime += t;
    entry.statusCounts[status] = (entry.statusCounts[status] || 0) + 1;
    entry.totalCount += 1;
  }
  const labels = [];
  const countsFinished = [];
  const countsUnfinished = [];
  const statuses = [];
  for (const [k, v] of map.entries()) {
    labels.push(k);
    countsFinished.push(v.finishedTime);
    countsUnfinished.push(v.unfinishedTime);
    statuses.push(v.statusCounts);
  }
  return { labels, countsFinished, countsUnfinished, statuses };
}

const rows = ligne(dataJson);

function GetNul() {
    const filtered = rows.filter(r => r.name =="Sat4j-cp" || r.name=="Sat4j-rs"  || r.name=="CoSoCo" );
    return paire_graphe(filtered);
}

function GetMid() {
    const filtered = rows.filter(r => r.name == "Mistral" || r.name == "Choco" || r.name =="BTD");
    return paire_graphe(filtered);
}

function GetFort() {
    const filtered = rows.filter(r => r.name == "Picat" || r.name =="ACE" || r.name=="Fun-sCOP-cad" || r.name=="Fun-sCOP-glue" );
    return paire_graphe(filtered);
}

const { labels: labelsFort, countsFinished: countsFortFinished, countsUnfinished: countsFortUnfinished, statuses: statusesFort } = GetFort();

  new Chart(
    document.getElementById('fort'),
    {
      type: 'bar',
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => items[0].label,
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const s = statusesFort[idx] || {};
                const lines = [];
                lines.push(`SAT: ${s.SAT}`);
                lines.push(`UNSAT: ${s.UNSAT}`);
                lines.push(`UNKNOWN: ${s.UNKNOWN}`);
                return lines;
              },
              scales: {
                x: { stacked: true }
              }
            }
          }
        }
      },
      data: {
        labels: labelsFort,
        datasets: [
          { label: 'Finished time', data: countsFortFinished, stack: 'stack0', backgroundColor :[
      '#f96769ff',
              '#fefa7dff',
              '#f489beff',
              '#fec26eff'
    ] },
          { label: 'Unfinished / timeout time', data: countsFortUnfinished, stack: 'stack0', backgroundColor: [
      '#be494bbc',
              '#aba84ca4',
              '#9f4873cb',
              '#fce1bccb'
    ] }
  ]}});


const { labels: labelsMid, countsFinished: countsMidFinished, countsUnfinished: countsMidUnfinished, statuses: statusesMid } = GetMid();

  new Chart(
    document.getElementById('mid'),
    {
      type: 'bar',
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => items[0].label ,
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const s = statusesMid[idx] || {};
                const lines = [];
                lines.push(`SAT: ${s.SAT}`);
                lines.push(`UNSAT: ${s.UNSAT}`);
                lines.push(`UNKNOWN: ${s.UNKNOWN}`);
                return lines;
              }
            }
          },
              scales: {
                x: { stacked: true }
        }
        }, },
      data: {
        labels: labelsMid,
        datasets: [
          { label: 'Finished time', data: countsMidFinished, stack: 'stack0', backgroundColor: ['#fefa7da4',
              '#f489beff',
              '#fec26eff'
    ]  },
          { label: 'Unfinished / timeout time', data: countsMidUnfinished, stack: 'stack0', backgroundColor: ['#aba84ca4',
              '#9f4873cb',
              '#fce1bccb'
    ]}
        ]
      } });

  

const { labels: labelsNul, countsFinished: countsNulFinished, countsUnfinished: countsNulUnfinished, statuses: statusesNul } = GetNul();


  new Chart(
    document.getElementById('nul'),
    {
      type: 'bar',
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) =>items[0].label,
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const s = statusesNul[idx] || {};
                const lines = [];
                lines.push(`SAT: ${s.SAT}`);
                lines.push(`UNSAT: ${s.UNSAT}`);
                lines.push(`UNKNOWN: ${s.UNKNOWN}`);
                return lines;
              },
              scales: {
                x: { stacked: true }
              }
      
            }
          }
        }
      },
      data: {
        labels: labelsNul,
        datasets: [
          { label: 'Finished time', data: countsNulFinished, stack: 'stack0', backgroundColor: ['#fefa7da4',
            '#fec26eff',
              '#f489beff'
              
    ]  },
          { label: 'Unfinished / timeout time', data: countsNulUnfinished, stack: 'stack0', backgroundColor: ['#aba84ca4',
              '#fce1bccb','#9f4873cb']}
        ]
      }
    }
  );
