const original = 'InstrumentEntity';
const suffix = 'Entity';

const res = original.replace(new RegExp(`${ suffix }$`), ''); /* ?. */
const res2 = original.endsWith(suffix) ? original.slice(0, suffix.length * -1) : original; /* ?. */

// Array uniq
// import * as _ from 'lodash';
//
// export const uniq = (values: any[]): any[] => Array.from(new Set(values));
//
// const values = Array(10 ** 7).fill(1).map(() => _.random(1, 10 ** 5));
//
// const res = _.times(10, () => [
//   _.uniq(values) /* ?. */,
//   uniq(values) /* ?. */,
// ]);
//
// console.log(values.length, res[0][0].length, res[0][1].length);
// console.log(res[0][0].slice(0, 10));
// console.log(res[0][1].slice(0, 10));
//
// // TODO: check out of wallabyJS
