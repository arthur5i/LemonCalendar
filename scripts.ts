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

program.command("init-eventgroups")
.description("Initialize the test EventGroup objects.")
.action(initEventGroups);

program.command("uuid")
.description("Generate UUIDs")
.argument("[amount]")
.action(generateUuid);

program.parse()