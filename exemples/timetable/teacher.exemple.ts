import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import chalk from 'chalk';
import { TeacherLogin } from "../authentication/teacher.exemple";
import { Detention } from "../../src/structures/PageEmploiDuTemps/Detention";

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
  for (const lesson of day.lessons) {
    const timeFrom = lesson.from.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const timeTo = lesson.to.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    console.log(chalk.cyan('┌─ ') + chalk.bold.yellow(timeFrom) + chalk.cyan(' → ') + chalk.bold.yellow(timeTo));

    const isCanceled = 'canceled' in lesson && lesson.canceled;
    const isDetention = lesson instanceof Detention;
    const subject = ('subject' in lesson ? lesson.subject : null) ?? "Unknown";
    const subjectFormatted = isCanceled 
      ? chalk.bold.red(`${subject} (canceled)`)
      : chalk.bold.blue(subject === "Unknown" ? chalk.gray(subject) : subject);
    console.log(chalk.cyan('│  ') + (isDetention ? chalk.red("Detention"): subjectFormatted));

    const rooms = lesson.rooms?.join(", ") ?? "Unknown";
    const teachers = ('teachers' in lesson ? lesson.teachers?.join(", ") : null) ?? "Unknown";
    console.log(chalk.cyan('└─ ') + chalk.gray(`${rooms} - ${teachers}`) + '\n');
  }

  return timetable;
}