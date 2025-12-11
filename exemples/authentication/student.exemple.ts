import { input, password } from '@inquirer/prompts';
import chalk from 'chalk';
import { Instance } from '../../src/structures/Instance';
import { StudentAuthenticator } from '../../src/structures/authentication/StudentAuthenticator';

(async () => {
  const url = await input({ message: "Enter the school's instance URL:", required: true, default: "https://demo.index-education.net/pronote/" })
  const instance = await Instance.createFromURL(url);
  const authenticator =  new StudentAuthenticator(instance);

  const username = await input({ message: "Username:", required: true, default: "demonstration" })
  const pwd = await password({ message: "Password:", mask: "*" })
  await authenticator.initializeLoginWithCredentials(username, pwd)

  const state = authenticator.state

  if (state.type === "CREDENTIALS_CHANGE") {
    console.log("");
    
    const requirements = [];
    requirements.push("password");
    if (state.security.canUpdatePin) requirements.push("PIN");
    
    console.log(chalk.yellow(`You must change your ${requirements.join(" and ")} to continue!`));

    const newPwd = await password({ 
      message: "Enter your new password:", 
      mask: "*",
      validate: (value) => value.length > 0 || "Password cannot be empty"
    });
    
    let pin: string | undefined;
    const deviceName = "BlocksHub";

    if (state.security.canUpdatePin || state.security.requirePin) {
      pin = await password({ 
        message: "Enter your PIN:", 
        mask: "*",
        validate: (value) => value.length > 0 || "PIN cannot be empty"
      });
    }

    await state.security.updatePassword(newPwd, pin ? { deviceName, pin } : undefined);
  }

  if (state.type === "DOUBLE_AUTH") {
    console.log("");
    console.log(chalk.yellow(`Your account is protected by a PIN, please enter it to continue!`));

    const pin = await password({  message: "Enter your PIN:", mask: "*" });
    const deviceName = "BlocksHub";

    await state.security.submitPin(pin, deviceName);
  }

  const student = await authenticator.finalize()
  console.log(student);
})()
