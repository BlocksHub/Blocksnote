import { input, number } from '@inquirer/prompts';
import { School } from '../src/structures/School';
import chalk from 'chalk';

(async () => {
  const latitude = await input({ message: "Enter the school's latitude:", required: true, default: "48.866667" })
  const longitude = await input({ message: "Enter the school's longitude:", required: true, default: "2.333333" })
  const limit = await number({ message: "How many results would you like to retrieve?", required: true, default: 10 })

  const schools = await School.locate(Number(latitude), Number(longitude), limit)
  console.log(`\n🎉 We've found ${chalk.blue(`${schools.length} schools`)} near the provided coordinates!`)
  for (const school of schools) {
    console.log(" ".repeat(2), chalk.blue("*"), school.name, chalk.blue(`(${school.postalCode})`))
  }
})()
