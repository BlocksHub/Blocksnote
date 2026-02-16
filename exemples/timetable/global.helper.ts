import { Detention } from "@/routes/PageEmploiDuTemps/Detention";
import type { Lesson } from "@/routes/PageEmploiDuTemps/Lesson";
import chalk from 'chalk';

export function printLessons(lessons: Lesson[] | Detention []) {
      for (const lesson of lessons) {
    const timeFrom = lesson.from.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const timeTo = lesson.to.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    console.log(chalk.cyan('┌─ ') + chalk.bold.yellow(timeFrom) + chalk.cyan(' → ') + chalk.bold.yellow(timeTo));

    const isCanceled = 'canceled' in lesson && lesson.canceled;
    const isDetention = lesson instanceof Detention;
    const subject = ('subject' in lesson ? lesson.subject : null) ?? "Unknown";
    const subjectFormatted = (isCanceled) 
      ? chalk.bold.red(`${subject} (canceled)`)
      : chalk.bold.blue(subject === "Unknown" ? chalk.gray(subject) : subject);
    console.log(chalk.cyan('│  ') + (isDetention ? chalk.red("Detention"): subjectFormatted));
    if (lesson.excluded) console.log(chalk.cyan('│  ') + (chalk.red("The student is excluded from this course")));

    const rooms = lesson.rooms?.join(", ") ?? "Unknown";
    const teachers = ('teachers' in lesson ? lesson.teachers?.join(", ") : null) ?? "Unknown";
    console.log(chalk.cyan('└─ ') + chalk.gray(`${rooms} - ${teachers}`) + '\n');
  }
}