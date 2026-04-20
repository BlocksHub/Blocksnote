import { select } from "@inquirer/prompts";
import type { Timetable } from "../../src";
import { printLessons } from "./global.helper";
import { CompanyLogin } from "exemples/authentication/company.exemple";

if (require.main === module) {
  main();
}

async function main(): Promise<Timetable> {
  const account = await CompanyLogin();
  const student = await select({
    message: "Choose the student whose timetable you want to view",
    choices: account.user.students.map((student) => ({
      name: student.fullName,
      value: student
    }))
  })

  const timetable = await account.timetable(student);
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