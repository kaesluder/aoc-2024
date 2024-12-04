import { assertEquals } from "jsr:@std/assert";

const readLines = async (filename: string): Promise<string[]> => {
  const data = await Deno.readTextFile(filename);
  const lines = data.split("\n");

  return lines;
};

const testExample =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
const testTarget = 161;

const regex = /mul\(\d{1,3},\d{1,3}\)/g;
const numRegex = /\d{1,3}/g;

const extractCommands = (line: string): string[] => {
  const matches = line.matchAll(regex);

  return [...matches].map((match) => match[0]);
};

const mul = (command: string): number => {
  const numStrings = [...command.matchAll(numRegex)];
  const x = parseInt(numStrings[0][0]);
  const y = parseInt(numStrings[1][0]);
  return x * y;
};

const partA = async () => {
  const lines = await readLines("input.txt");
  const commands = lines.map((line) => extractCommands(line)).flat();
  const result = commands
    .map((num) => mul(num))
    .reduce((acc, cur) => acc + cur, 0);
  console.log(result);
};

Deno.test("day03 testExample sum is 161", () => {
  const commands = extractCommands(testExample);
  const result = commands
    .map((num) => mul(num))
    .reduce((acc, cur) => acc + cur, 0);
  console.log(result);
  assertEquals(result, testTarget);
});

partA();

const mulRegex = /mul\((\d{1,3}),(\d{1-3})\)/;
const doRegex = /do\(\)/;
const dontRegex = /don\'t\(\)/;

const safeIndex = (
  text: string,
  searchString: string,
  position: number,
): number | null => {
  const found = text.indexOf(searchString, position);
  if (found < 0) {
    return null;
  } else {
    return found;
  }
};

const parser = (text: string) => {
  let index = 0;
  let enabled = true;
  const muls: string[] = [];

  while (index < text.length) {
    const nextDo = safeIndex(text, `do()`, index) || text.length + 1;
    const nextMul = safeIndex(text, `mul(`, index) || text.length + 1;
    const nextDont = safeIndex(text, `don't()`, index) || text.length + 1;
    //console.log(`do: ${nextDo}, dont: ${nextDont}, mul: ${nextMul}, index: ${index}`)

    // next command is don't
    if (nextDont < nextMul && nextDont < nextDo) {
      enabled = false;
      //console.log(`don't at ${nextDont}`);
      index = nextDont + 1;
    } else if (nextDo < nextMul && nextDo < nextDont) {
      enabled = true;
      //console.log(`do at ${nextDo}`)
      index = nextDo + 1;
    } else if (enabled && nextMul < nextDo && nextMul < nextDont) {
      //console.log(`enabled mul at ${nextMul}`);
      const command = extractCommands(text.substring(nextMul, nextMul + 12))[0];
      if (command !== undefined) {
        muls.push(command);
      }
    } else if (!enabled && nextMul < nextDo && nextMul < nextDont) {
      //console.log(`disabled mul at ${nextMul}`);
    }

    index = Math.min(nextDo, nextMul, nextDont) + 1;
  }
  return muls;
};

const testInputB = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
const testOutputB = 48;

console.log(parser(testInputB));

Deno.test("day03B testExample sum is 48", () => {
  const commands = parser(testInputB);
  const result = commands
    .map((num) => mul(num))
    .reduce((acc, cur) => acc + cur, 0);
  console.log(result);
  assertEquals(result, testOutputB);
});

const partB = async () => {
  const lines = await Deno.readTextFile("input.txt");
  const commands = parser(lines);
  console.log(commands);
  const result = commands
    .map((num) => mul(num))
    .reduce((acc, cur) => acc + cur, 0);
  console.log(`partB: ${result}`);
};

partB();
