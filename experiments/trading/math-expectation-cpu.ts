'use strict';
import * as _ from 'lodash';
import * as __ from 'lodash/fp';
import { performance } from "perf_hooks";

const numberOfPositive = 0.35;

const initialDeposit = 1000;
const take = initialDeposit * 0.01;
const stop = take / 3;

const deals = 1e3;

const transactions = () => _.range(deals).map(() => _.random(1, 1000) <= numberOfPositive * 1000);
console.log('positive', transactions().filter(Boolean).length);

const numberOfExperiments = 1e4;

const before = performance.now();
const res = _.range(numberOfExperiments).map(() => transactions().reduce((sum, isTake) => isTake ? sum + take : sum - stop, initialDeposit));
const after = performance.now();
console.log('time:', (after - before) / 1000);

const sorted = [...res].sort((a, b) => a - b);


const omitN = numberOfExperiments * 0.1;
const filtered = sorted.slice(omitN, -1 * omitN);

printStatistic(sorted);
printStatistic(filtered);

function printStatistic (res: number[]) {
  const min = _.min(res)!;
  const max = _.max(res)!;
  const avg = _.sum(res) / res.length;
  const median = res[Math.round(res.length / 2)];

  const per = (v: number) => Math.round((v - initialDeposit) / initialDeposit * 10000) / 100 + ' %';
  console.log(`
  Min:    ${ Math.round(min) } / ${ per(min) }
  Max:    ${ Math.round(max) } / ${ per(max) }
  Avg:    ${ Math.round(avg) } / ${ per(avg) }
  Median: ${ Math.round(median) } / ${ per(median) }
`);
}













