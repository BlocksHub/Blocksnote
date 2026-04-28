import { checkbox, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import type { MCQ } from "@/routes/MCQ/Common";
import type { Question } from "@/routes/MCQ/Question";
import { QuestionType } from "@/types/mcq";
import type { Answer } from "@/routes/MCQ/Answer";

async function handleInput(question: Question, count: number = 1, validate?: (p: string) => boolean) {
  const answers: string[] = []
  
  for (let i=0;i<count;i++) {
    const answer = await input({ message: "Enter your answer:", validate, required: question.isRequired })
    answers.push(answer);
  }

  await question.answer(answers)
  return;
}

async function handleChoice(
  question: Question, 
  items: Answer[] | string[][] = question.answers, 
  fields: number = 1
) {
  const answers: (Answer | string)[] = [];

  for (let i = 0; i < fields; i++) {
    const currentChoices = Array.isArray(items[0]) ? (items as string[][])[i] : (items as Answer[]);

    const answer = await select({
      message: `Select the correct option:`,
      choices: currentChoices!.map((item) => ({
        name: typeof item === "string" ? item : item.label.replace(/<[^>]*>?/gm, ''),
        value: item
      }))
    });

    answers.push(answer);
  }

  await question.answer(answers);
}

async function handleClozeFixed(question: Question) {
  console.log(chalk.blue("*"), chalk.bold("Fill in the blanks:"));
  console.log(chalk.yellow("*"), question.instruction.replace(/<[^>]*>?/gm, '').replaceAll("{#}", "_____"))
  const items: string[][] = question.answers.map((a) => a.choices);
  await handleChoice(question, items, question.answers.length)
}

async function handleClozeField(question: Question) {
  console.log(chalk.blue("*"), chalk.bold("Type the missing words:"));
  console.log(chalk.yellow("*"), question.instruction.replace(/<[^>]*>?/gm, '').replaceAll("{#}", "_____"))
  const fields: number = question.instruction.match("{#}")?.length ?? 0
  await handleInput(question, fields)
}

async function handleChoices(question: Question, choices: Answer[] = question.answers) {  
  const answer = await checkbox({
    message: "Select all that apply:",
    choices: choices.map((item) => ({
      name: item.label.replace(/<[^>]*>?/gm, ''),
      value: item
    }))
  })

  await question.answer(answer);
  return;
}

async function handleMatching(question: Question) {
  console.log(chalk.blue("*"), chalk.bold("Match the following items"));
  const items = question.matchingItems;
  const choices = question.matchingChoices;

  const answers = [];
  for (const item of items) {
    const match = await select({
      message: `Match for ${chalk.blue(item.label)}:`,
      choices: choices.map((item) => ({
        name: item.label.replace(/<[^>]*>?/gm, ''),
        value: item
      }))  
    })

    answers.push(match);
  }

  await question.answer(answers);
  return;
}

export async function handleMCQ(mcq: MCQ) {
  const { totalQuestions, canNavigate, durationLimit, tolerateWrongAnswers } = mcq;
  const allowedStr = (val: boolean) => val ? chalk.green("allowed") : chalk.red("not allowed");
  
  console.log(`\n${chalk.yellow("*")} This homework is a MCQ containing ${chalk.bold(totalQuestions)} questions.`);
  console.log(chalk.red("!"), "Rules:");

  const rules = [
    `Navigation is ${allowedStr(canNavigate)}`,
    `Incomplete answers are ${allowedStr(canNavigate)}`,
    `Wrong answers are ${tolerateWrongAnswers ? chalk.green("tolerated") : chalk.red("not tolerated")}`
  ];

  if (durationLimit > 0) {
    rules.push(`Time limit: ${chalk.blue(durationLimit + " seconds")}`);
  }

  rules.forEach(rule => console.log(`   - ${rule}`));
  const start = confirm("Are you ready to begin?")
  if (!start) return;

  for (let i=0; i < totalQuestions; i++) {
    const question = await mcq.questions(i);
    console.log(chalk.yellow("\n*"), question.title ?? "This question doesn't have any title", chalk.yellow(`(${i}/${totalQuestions})`))
    if (question.type === QuestionType.CLOZE_FIELD) { await handleClozeField(question) }
    if (question.type === QuestionType.SINGLE_CHOICE) { await handleChoice(question) }
    if (question.type === QuestionType.MULTI_CHOICE) { await handleChoices(question) }
    if (question.type === QuestionType.NUMERICAL_ANSWER) { await handleInput(question, 1, (p) => /^\d+$/.test(p)) }
    if ([QuestionType.SHORT_ANSWER, QuestionType.SPELL_ANSWER].includes(question.type)) { await handleInput(question) }
    if ([QuestionType.CLOZE_FIXED, QuestionType.CLOZE_VARIABLE].includes(question.type)) { await handleClozeFixed(question) }
    if (question.type === QuestionType.MATCHING) { await handleMatching(question) }
  }

  const finalConfirm = await confirm("\nDo you want to submit your answers?");
  if (finalConfirm) {
    await mcq.finalize();
    console.log(chalk.green("*"), "You", chalk.green("completed"), "this MCQ")
  }
}
