import { ParentLogin } from "../authentication/parent.exemple";
import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import chalk from 'chalk';
import { Detention } from "../../src/routes/PageEmploiDuTemps/Detention";
import { printLessons } from "./global.helper";

if (require.main === module) {
  main();
}

async function main(): Promise<Timetable> {
  const account = await ParentLogin();
  const children = await select({
    message: "Choose the child whose timetable you want to view",
    choices: account.user.childrens.map((children) => ({
      name: children.fullName,
      value: children
    }))
  })

  const timetable = await account.timetable(children);
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