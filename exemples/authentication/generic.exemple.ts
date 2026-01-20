import { input, password, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { Instance } from '../../src/structures/Instance';
import { Authenticator } from '../../src/structures/authentication/Authenticator';
import type { User } from '../../src';

if (require.main === module) {
  main();
}

async function main(): Promise<User> {
  const url = await input({ message: "Enter the school's instance URL:", required: true, default: "https://demo.index-education.net/pronote/" })
  const instance = await Instance.createFromURL(url);
  const authenticator =  new Authenticator(instance);

  const availableWorkspaces = instance.workspaces.filter(workspace => !workspace.delegated)

  if (availableWorkspaces.length === 0) {
    throw new Error("The workspaces of your instance are currently unavailable or require authentication via CAS.")
  }

  const workspace = await select({
    message: "Choose your Workspace",
    choices: availableWorkspaces
      .map((workspace) => ({
        name: workspace.name,
        value: workspace
      }))
  })

  authenticator.useWorkspace(workspace);
  await askForCredentials(authenticator);

  const account = await authenticator.finalize();
  console.log(chalk.green("\n*"), "You're authenticated as", chalk.blue(account.user.fullName))

  return account;
}

export async function askForCredentials(authenticator: Authenticator) {
  const username = await input({ message: "Username:", required: true, default: "demonstration" })
  const pwd = await password({ message: "Password:", mask: "*" })
  await authenticator.credentials(username, pwd)

  const security = authenticator.security;

  if (security.mustChangePassword) {
    console.log(chalk.yellow("\n*"), "You must change your password to continue...");
    if (security.rules.atLeastOneLetter) console.log(chalk.yellow("-"), "at least one letter")
    if (security.rules.atLeastOneNumber) console.log(chalk.yellow("-"), "at least one number")
    if (security.rules.atLeastOneSpecialCharacter) console.log(chalk.yellow("-"), "at least one special character")
    if (security.rules.mustMixUpperAndLowerCase) console.log(chalk.yellow("-"), "must mix upper and lower case character")
    console.log(chalk.yellow("-"), "must be at least", security.rules.minimumLength, "long")
    console.log(chalk.yellow("-"), "must not exceed", security.rules.maximumLength, "long")

    const newPwd = await password({ message: "Password:", mask: "*", validate: (p) => security.validatePassword(p) })
    security.password(newPwd);
  }

  if (security.mustUpdatePIN || security.mustEnterPIN) {
    if (security.mustUpdatePIN) console.log(chalk.yellow("*", "You must change your PIN to continue..."))
    const newPin = await password({ message: "PIN:", mask: "*" })
    security.pin(newPin);
    security.register("BlocksHub");
  }
}