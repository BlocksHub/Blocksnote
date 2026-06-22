import { TabsType } from "@/types/user";
import { StudentLogin } from "../authentication/student.exemple";
import chalk from "chalk";
import { select } from "@inquirer/prompts";
import { EvaluationStatus, type EvaluationStatusType, type GradeValue } from "@/types/grades";

if (require.main === module) {
  main();
}

function formatStatus(status: EvaluationStatusType) {
  switch (status) {
    case EvaluationStatus.ABSENT:
      return "Absent"
    case EvaluationStatus.ABSENT_WITH_ZERO:
      return "Absent*"
    case EvaluationStatus.DISABLED:
      return "Dispense"
    case EvaluationStatus.DISTINCTION:
      return "Felicitations"
    case EvaluationStatus.EXCUSED:
      return "Inapte"
    case EvaluationStatus.INCOMPLETE:
      return "N. Rendu"
    case EvaluationStatus.MISSING_WITH_ZERO:
      return "N. Rendu*"
    case EvaluationStatus.UNGRADED:
      return "N.Noté"
    default:
      return "Erreur"
  }
}

function formatValue(grade?: GradeValue) {
  if (!grade) return chalk.red("Unknown");
  return grade.status === EvaluationStatus.GRADED
    ? chalk.green(`${grade.value}/${grade.outOf}`)
    : chalk.red(formatStatus(grade.status))
}

async function main() {
  const account = await StudentLogin();
  const tab = account.user.tab(TabsType.GRADES)
  if (!tab) {
    console.log(chalk.red("You didn't have the permission to access to the grades's tab"));
    process.exit(1);
  }
  
  const period = await select({
    message: "Choose the period you want to look at",
    choices: tab.periods.map((item) => ({
      name: item.label,
      value: item
    }))
  })
  const periodGrades = await account.grades(period);

  for (const subject of periodGrades.subjects) {
    console.log(chalk.gray("┌─ "), chalk.green(subject.label))
    console.log(chalk.gray("│  "))
    for (const grade of subject.grades) {
      console.log(
        chalk.gray("│  "),
        chalk.white(grade.comment ?? `${subject.label}'s Homework`),
        chalk.gray("—"),
        formatValue(grade.value),
        `${chalk.dim(`(Class: ${formatValue(grade.average)}, Min: ${formatValue(grade.minimum)}, Max: ${formatValue(grade.maximum)})`)}`
      )
    }
    console.log(chalk.gray("│  \n└─ "), "Subjet's Average", formatValue(periodGrades.average), `${chalk.dim(`(Class: ${formatValue(periodGrades.classAverage)})`)}`)
  }
  console.log(
    chalk.green("\n*"),
    "Period's Average:",
    formatValue(periodGrades.average),
    `${chalk.dim(`(Class: ${formatValue(periodGrades.classAverage)})`)}`
  );
  return periodGrades;
}