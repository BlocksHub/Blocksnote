import { input } from '@inquirer/prompts';
import search from '@inquirer/search';
import chalk from 'chalk';
import { Authenticator } from '../src/structures/Authenticator';
import { DoubleAuthError } from '../src/structures/errors/DoubleAuthError';

(async () => {
  const url = await input({ message: "Enter the instance's URL:", required: true, default: "https://demo.index-education.net/pronote" })
  const authenticator = await Authenticator.createFromURL(url);
  
  const username = await input({ message: "What's your username ? ", required: true, default: "demonstration" })
  const password = await input({ message: "What's your password ? ", required: true, default: "pronotevs" })

  const selectedWorkspace = await search({
      message: 'Select your workspace',
      source: async () => {
          return authenticator.availableWorkspaces.map((workspace) => ({
          name: workspace.name,
          value: workspace,
        }));
      },
  });

  await authenticator
    .setWorkspace(selectedWorkspace)
    .initializeLoginWithCredentials(username, password);

  if (authenticator.state.type === "LOGGED_IN") {
    console.log(`\n🎉 Congratulations, you are now ${chalk.green("logged in")}!`)
  }

  if (authenticator.state.type === "DOUBLE_AUTH") {
    console.log(" ")
    console.log(chalk.yellow("This account has two-factor authentication enabled"))

    async function askPin(): Promise<string> {
      return input({
        message: "PIN: ",
        required: true,
        default: "0000",
        validate(value: string) {
          return value.length >= 4 || "PIN must be at least 4 characters";
        },
      });
    }

    while (true) {
      const pin = await askPin();
      try {
        await authenticator.state.security.submitPin(pin, "BlocksHub");
        console.log(`\n🎉 Congratulations, you are now ${chalk.green("logged in")}!`)
        break;
      } catch (error) {
        if (error instanceof DoubleAuthError) {
          console.log(chalk.red(`${error.message} (remaining retry: ${error.context.remainingRetry})`));
          if (typeof error.context.remainingRetry === "number" && error.context.remainingRetry <= 0) {
            console.log(chalk.red("No remaining attempts. Aborting."));
            break;
          }
        } else {
          throw error;
        }
      }
    }
  }

  if (authenticator.state.type === "PASSWORD_CHANGE") {
    const security = authenticator.state.security

    console.log(" ")
    console.log(chalk.yellow(`You must change your password${security.requirePin ? '' : ' and you can update your PIN'}`));
    const newPassword = await input({ message: "Enter the new password: ", required: true, validate(value: string) {
        try {
          return security.validatePassword(value)
        } catch {
          return false
        } 
      },
    });
    let newPin = ""

    if (security.requirePin || security.canUpdatePin) {
      newPin = await input({ message: "Enter the new PIN: ", required: true, default: "0000",
        validate(value: string) {
          return value.length >= 4 || "PIN must be at least 4 characters";
        },
      });
    }

    await security.updatePassword(newPassword, newPin ? { deviceName: "BlocksHub", pin: newPin } : undefined)
    console.log(`\n🎉 Congratulations, you are now ${chalk.green("logged in")}!`)
  }
})()
