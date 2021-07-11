import * as _ from 'lodash';
import { GPU } from 'gpu.js';
import { performance } from 'perf_hooks';

const gpu = new GPU();

const calculate = (
  initialDeposit: number,
  riskPer: number,
  positivePer: number,
  numberOfExperiments: number,
  ordersNum: number,
  recalculateStopOn: number,
  maxStopSize: number,
  riskTakeRatio: number = 3,
) => gpu.createKernel(function (
  initialDeposit: number,
  riskPer: number,
  positivePer: number,
  recalculateStopOn: number,
  maxStopSize: number,
  riskTakeRatio: number,
) {
  const rndMin = 1;
  const rndMax = 1e4;

  let stop = -1 * initialDeposit * riskPer;
  let take = -1 * stop * riskTakeRatio;

  let deposit = initialDeposit;

  for (let i = 0; i < this.constants.ordersNum; i++) {
    const rnd = Math.floor(Math.random() * (rndMax - rndMin + 1)) + rndMin;
    deposit += rnd <= positivePer * rndMax ? take : stop;

    if ((i + 1) % recalculateStopOn === 0) {
      stop = -1 * deposit * riskPer;
      if (Math.abs(stop) > maxStopSize) stop = -1 * maxStopSize;
      take = -1 * stop * riskTakeRatio;
    }
  }

  return deposit;
  },
  { output: { x: numberOfExperiments }, constants: { ordersNum } },
)(
  initialDeposit,
  riskPer,
  positivePer,
  recalculateStopOn,
  maxStopSize,
  riskTakeRatio,
);


const numberOfExperiments = 1e6;
const ordersNum = 1e3;
const initialDeposit = 1e3 * 20;
const riskPer = 0.0025;
const positivePer = 0.35;
const recalculateStopOn = 1e1;
/** in the quote currency */
const maxStopSize = 1e4;

const before = performance.now();
const values = calculate(
  initialDeposit,
  riskPer,
  positivePer,
  numberOfExperiments,
  ordersNum,
  recalculateStopOn,
  maxStopSize,
) as any as number[];
const after = performance.now();
console.log('Time %d sec:', _.round((after - before) / 1000, 2));
console.log('Actual tests:', values.length);

const sorted = [...values].sort((a, b) => a - b);

const omitN = numberOfExperiments * 0.005;
const filtered = sorted.slice(omitN, -1 * omitN);

printStatistic(sorted);
printStatistic(filtered);

function printStatistic (res: number[]) {
  const min = _.min(res)!;
  const max = _.max(res)!;
  const avg = _.sum(res) / res.length;
  const median = res[Math.round(res.length / 2)];

  const f = (v: number) => Math.round(v).toLocaleString().replace(/,/g, ' ');
  const per = (v: number) => f(Math.round((v - initialDeposit) / initialDeposit * 10000) / 100) + ' %';
  console.log(`
  Min:    ${ f(min) } / ${ per(min) }
  Max:    ${ f(max) } / ${ per(max) }
  Avg:    ${ f(avg) } / ${ per(avg) }
  Median: ${ f(median) } / ${ per(median) }
`);
}
