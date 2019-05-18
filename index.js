const xlsx = require('xlsx');

const book = xlsx.readFile('data/sample.xls');
const sheetName = book.SheetNames[0];
const sheet = book.Sheets[sheetName];

function getRowColumn(cell) {
  return { row: cell[0], column: cell.slice(1) };
}

function querySheet(cell) {
  return sheet[cell].v;
}

function queryDay(cell) {
  try {
    return sheet[cell].v;
  } catch {
    const { row, column } = getRowColumn(cell);
    return queryDay(row + String(Number(column) - 1));
  }
}

const keys = Object.keys(sheet).filter(key => key.match(/[A-Z][0-9]+/g));

const classes = [];
const subjects = {};

keys.forEach(key => {
  const { row, column } = getRowColumn(key);
  const val = querySheet(key);

  const matchClass = /^([LPT])(([ABC]([0-9]+(-[0-9]+)?)?,?)+)\((.+)\)-(.+)\/(.+)$/g.exec(
    val
  );
  const matchSubject = /^[0-9]{2}.+[0-9]{3}$/g.exec(val);

  if (matchClass) {
    classes.push({
      type: matchClass[1],
      batches: matchClass[2].split(','),
      code: matchClass[6],
      room: matchClass[7],
      faculty: matchClass[8].split(','),
      day: queryDay('A' + column),
      startTime: querySheet(row + '2').split('-')[0]
    });
  }

  if (matchSubject) {
    const nextRow = String.fromCharCode(row.charCodeAt(0) + 1);
    subjects[val] = querySheet(nextRow + column);
  }
});

console.log(classes);
console.log(subjects);
