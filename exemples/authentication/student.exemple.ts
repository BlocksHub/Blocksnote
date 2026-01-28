import { Instance, StudentAuthenticator, Student } from '../../src';
import { askForCredentials } from './generic.exemple';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';

if (require.main === module) {
  StudentLogin();
}

export async function StudentLogin(): Promise<Student> {
  const url = await input({ message: "Enter the school's instance URL:", required: true, default: "https://demo.index-education.net/pronote/" })
  const instance = await Instance.createFromURL(url);
  const authenticator =  new StudentAuthenticator(instance);

  await askForCredentials(authenticator);

  const account = await authenticator.finalize();
  console.log(chalk.green("\n*"), "You're authenticated as", chalk.blue(account.user.fullName))
  return account;
}
