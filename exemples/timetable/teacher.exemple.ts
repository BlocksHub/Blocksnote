import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import { TeacherLogin } from "../authentication/teacher.exemple";
import { printLessons } from "./global.helper";

if (require.main === module) {
  main();
}

async function main(): Promise<Timetable> {
  const account = await TeacherLogin();
  const timetable = await account.timetable();
  const day = await select({
    message: "Choose the day you want to view",
    choices: timetable.days.map((day) => ({
      name: day.date.toLocaleString("fr-FR"),
      value: day
    }))
  })
  console.log("\n")
  
  printLessons(day.lessons);
  return timetable;
}