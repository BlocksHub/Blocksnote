import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import chalk from 'chalk';
import { ParentLogin } from "../authentication/parent.exemple";

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

  const timetable = await account.timetable(children, { weekNumber: 20 });
  const day = await select({
    message: "Choose the day you want to view",
    choices: timetable.days.map((day) => ({
      name: day.date.toLocaleString("fr-FR"),
      value: day
    }))
  })
  console.log("\n")
  for (const lesson of day.lessons) {
    console.log(
      chalk.cyan('┌─ ') + chalk.bold.yellow(lesson.from.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit"})) + 
      chalk.cyan(' → ') + chalk.bold.yellow(lesson.to.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit"}))
    );
    console.log(
      chalk.cyan('│  ') + chalk.bold.blue(lesson.subject ?? chalk.gray("Unknown"))
    );
    console.log(chalk.cyan('└─') + " " + chalk.gray((lesson.room ?? "Unknown") + chalk.white(' - ')  + (lesson.teacher ?? "Unknown")) + '\n');
  }

  return timetable;
}