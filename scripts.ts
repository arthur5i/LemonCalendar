import { program } from "commander";
import * as fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

async function initEventGroups() {
  console.log("Initializing event groups (TBI)");
  try {
    const file_name = "intialEventGroups.json"
    const data = [
      {id: uuidv4(), name: "Group 1", events: [], visible: true, locked: false},
      {id: uuidv4(), name: "Group 2", events: [], visible: true, locked: false},
      {id: uuidv4(), name: "Group 3", events: [], visible: true, locked: false}
    ];
    await fs.writeFile(`./test_data/${file_name}`, JSON.stringify(data, null, 2), "utf8");

    console.log("Files created successfully");
  } catch (err) {
    console.error("Error writing files:", err);
  }
}

function generateUuid(amountIn: number | undefined) {
  const amount: number = (amountIn === undefined) ? 1 : amountIn;
  const uuidOut: string[] = [];

  for (let i = 0; i < amount; i++) {
    uuidOut.push(uuidv4());
  }

  console.log(uuidOut.toString());
}

function roundToNearestInt(numberIn: number, roundTo: number): number {
  const basis: number = numberIn % roundTo;
  const halfway: number = roundTo / 2;

  if (basis < halfway) {
    return numberIn - basis;
  } else {
    return numberIn + (roundTo - basis);
  }
}

function testRoundToNearestInt(numberIn: string, roundTo: string) {
  const realNumberIn = parseInt(numberIn);
  const realRoundTo = parseInt(roundTo);

  const numberOut = roundToNearestInt(realNumberIn, realRoundTo);
  console.log(numberOut.toString());
}

function testJSONConversion() {
  const jsonIn = {
    fromDate: new Date(Date.now()),
    temperature: 20
  }

  console.log(jsonIn.fromDate.toString());
  const jsonString = JSON.stringify(jsonIn);
  console.log(jsonString);

  const jsonOut = JSON.parse(jsonString);
  jsonOut.fromDate = new Date(jsonOut.fromDate);
  console.log(jsonOut.fromDate.toString());

  const jsonOutString = JSON.stringify(jsonOut);
  console.log(jsonOutString);
}

program.command("init-eventgroups")
.description("Initialize the test EventGroup objects.")
.action(initEventGroups);

program.command("uuid")
.description("Generate UUIDs.")
.argument("[amount]")
.action(generateUuid);

program.command("round")
.description("Test roundToNearestInt function.")
.argument("<numberIn>")
.argument("<roundTo>")
.action(testRoundToNearestInt);

program.command("json")
.description("Test JSON string conversion.")
.action(testJSONConversion);

program.parse();