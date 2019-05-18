const fs = require('fs');

function decomposeBranch(batch) {
  return { branch: batch[0], rest: batch.slice(1) };
}

function matchBatch(batch, batchList) {
  const { branch, rest: number } = decomposeBranch(batch);
  for (let i in batchList) {
    const b = batchList[i];
    if (b.includes('-')) {
      // Case 1: b is a batch range
      const matches = /([ABC])([0-9]+)-([0-9]+)/g.exec(b);
      if (
        branch === matches[1] &&
        Number(matches[2]) <= Number(number) &&
        Number(matches[3]) >= Number(number)
      ) {
        return true;
      }
    } else if (b.match(/[ABC][0-9]+/g)) {
      // Case 2: b is a single batch
      if (batch === b) {
        return true;
      }
    } else {
      // Case 3: b is a collection of branches
      if (b.split('').indexOf(branch) !== -1) {
        return true;
      }
    }
  };
  return false;
}

const classes = require(process.argv[2]);
const subjects = require(process.argv[3]);

const userBatch = process.argv[4];
const userSubjects = fs
  .readFileSync(process.argv[5])
  .toString()
  .trim()
  .split('\n');

classes.forEach(session => {
  if (!matchBatch(userBatch, session.batches)) return;

  userSubjects.forEach(subject => {
    if (subject.includes(session.code)) console.log(session);
  })
});
