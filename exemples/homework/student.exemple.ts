import { input, select } from "@inquirer/prompts";
import { StudentLogin } from "../authentication/student.exemple";
import chalk from "chalk";
import { SubmissionTypes } from "@/types/homework";
import { handleMCQ } from "./helper";

if (require.main === module) {
  main();
}

async function main() {
  const account = await StudentLogin();
  const homeworks = await account.homeworks();
  const homework = await select({
    message: "Choose the homework you want to update",
    choices: homeworks.map((item) => ({
      name: item.description.replace(/<[^>]*>?/gm, ''),
      value: item
    }))
  })

  if (homework.mcq) {
    return handleMCQ(homework.mcq)
  }

  if (homework.submissionType === SubmissionTypes.PRONOTE) {
    if (!homework.submittedAttachment && homework.canSubmit) {
      console.log(chalk.yellow("\n*"), "You must upload a file to complete this homework");
      const filePath = await input({ message: "File Path:" });
      const fileRaw = Bun.file(filePath);

      console.log("")
      if (!(await fileRaw.exists())) {
        console.log(chalk.red("!"), "This file does not exist.");
        process.exit(1);
      }

      const file = new File(
        [await fileRaw.arrayBuffer()],
        fileRaw.name ?? "attachment",
        { type: fileRaw.type }
      );

      try {
        await homework.submitAttachment(file);
        console.log(chalk.green("*"), "The file was successfully uploaded!");
      } catch {
        console.log(chalk.red("!"), "Oops, an error occured during the file upload");
        process.exit(1);
      }
    } else if (homework.canSubmit) {
      console.log("")
      await homework.deleteAttachment();
    }
  } else {
    console.log("")
    await homework.markAsDone();
  }

  console.log(chalk.green("*"), "This homework is now marked as", homework.done ? chalk.green("done") : chalk.red("not done"));

  return homeworks;
}