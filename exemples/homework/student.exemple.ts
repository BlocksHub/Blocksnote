import { select } from "@inquirer/prompts";
import type { Homework } from "../../src";
import { StudentLogin } from "../authentication/student.exemple";
import chalk from "chalk";

if (require.main === module) {
  main();
}

async function main(): Promise<Homework[]> {
  const account = await StudentLogin();
  const homeworks = await account.homeworks();
  const homework = await select({
    message: "Choose the homework you want to update",
    choices: homeworks.map((item) => ({
      name: item.description.replace(/<[^>]*>?/gm, ''),
      value: item
    }))
  })

  await homework.markAsDone();
  console.log(chalk.green("\n*"), "This homework is now marked as", homework.done ? chalk.green("done") : chalk.red("not done"));

  return homeworks;
}