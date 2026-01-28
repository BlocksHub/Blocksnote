import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import chalk from 'chalk';
import { StudentLogin } from "../authentication/student.exemple";

if (require.main === module) {
  main();
}

async function main(): Promise<Timetable> {
  const account = await StudentLogin();
  const timetable = await account.timetable();
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
    console.log(chalk.cyan('└─') + " " + chalk.gray((lesson.room ?? "Unknown") + chalk.white(' - ')  + (lesson.teachers?.join(", ") ?? "Unknown")) + '\n');
  }

  return timetable;
}