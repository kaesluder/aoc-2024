const parseSort = async (filename: string) => {
  const data = await Deno.readTextFile(filename);
  const lines = data.split("\n");

  const left: number[] = [];
  const right: number[] = [];
  lines.forEach((line) => {
    if (line.match(/\d+\s+\d+/)) {
      const [leftRaw, rightRaw] = line.split(/\s+/);
      left.push(parseInt(leftRaw));
      right.push(parseInt(rightRaw));
    }
  });

  left.sort();
  right.sort();

  return [left, right];
}

const listSum = (left: number[], right: number[]) => {
  const sum = left.reduce((acc, leftNum, index) => {
    return acc + Math.abs(leftNum - right[index]);
  }, 0);

  return sum;
};

const freqMap = (right: number[]) => {
  const fm = new Map();
  right.forEach((num) => {
    const old = fm.get(num) || 0;
    fm.set(num, old + 1);
  })
  return fm;
};

const similarityScore = (left: number[], fm: Map<number, number>) => {
  const score = left.reduce((acc, current) => {
    const thisScore = current * (fm.get(current) || 0);
    // console.log(thisScore);
    return acc + thisScore;
  }, 0);
  return score;
}

const [testLeft, testRight] = await parseSort("./test.txt")
console.log(listSum(testLeft, testRight));

const [inputLeft, inputRight] = await parseSort("./input");
console.log(listSum(inputLeft, inputRight));

const testFreqMap = freqMap(testRight);
console.log(similarityScore(testLeft, testFreqMap));

const inputFreqMap = freqMap(inputRight);
console.log(similarityScore(inputLeft, inputFreqMap));






