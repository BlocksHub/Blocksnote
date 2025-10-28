import { input } from '@inquirer/prompts';
import search from '@inquirer/search';
import { School } from '../src/structures/School';
import chalk from 'chalk';
import { AuthFlow } from '../src/structures/Authenticator';

(async () => {
  const latitude = await input({ message: "Enter the school's latitude:", required: true, default: "48.866667" })
  const longitude = await input({ message: "Enter the school's longitude:", required: true, default: "2.333333" })

  const schools = await School.locate(Number(latitude), Number(longitude), 1000)
  const selectedSchool = await search({
      message: 'Select your school',
      source: async () => {
          return schools.map((school) => ({
          name: school.name,
          value: school.url,
        }));
      },
  });
  
  const flow = await AuthFlow.createFromURL(selectedSchool)
  const selectedWorkspace = await search({
      message: 'Select your workspace',
      source: async () => {
          return flow.availableWorkspaces.map((workspace) => ({
          name: workspace.name,
          value: workspace
        }));
      },
  });

  flow.setWorkspace(selectedWorkspace)

  if (selectedWorkspace.delegated) {
    console.log(chalk.magenta("\n🔑 CAS is enabled on this workspace, a token is required to complete the process."));
  }
})()
