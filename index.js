#!/usr/bin/env node

import { Command } from 'commander';
import degit from 'degit';
import Enquirer from 'enquirer';
import pc from 'picocolors';
import ora from 'ora';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const program = new Command();
const enquirer = new Enquirer();

program
  .name('code-biruni')
  .description('Official Code Biruni Project Starter')
  .version('1.0.0');

program
  .argument('[project-name]', 'Name of the project folder')
  .action(async (projectName) => {
    let targetDir = projectName;

    // 1. Ask for name if not provided
    if (!targetDir) {
      const response = await enquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter project name:',
        initial: 'biruni-app'
      });
      targetDir = response.name;
    }

    const fullPath = path.join(process.cwd(), targetDir);

    // 2. Download Template
    const spinner = ora('Cloning Code Biruni template...').start();
    // Replace 'username/repo' with your actual public GitHub repo
    const emitter = degit('Robiu-Sani/marn-espress-setup-project', {
      cache: false,
      force: true,
    });

    try {
      await emitter.clone(targetDir);
      spinner.succeed(pc.green('Template downloaded!'));

      // 3. Customize package.json
      const pkgPath = path.join(fullPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkg.name = targetDir; // Set the project name to the folder name
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }

      // 4. Install Dependencies
      const installSpinner = ora('Installing dependencies (npm install)...').start();
      try {
        execSync(`npm install`, { cwd: fullPath, stdio: 'ignore' });
        installSpinner.succeed(pc.green('Dependencies installed!'));
      } catch (err) {
        installSpinner.warn(pc.yellow('Could not auto-install. You may need to run npm install manually.'));
      }

      // 5. Final Message
      console.log('\n' + pc.bgCyan(pc.black(' SUCCESS ')) + ' Setup complete!');
      console.log(`\nRun the following commands:`);
      console.log(pc.cyan(`  cd ${targetDir}`));
      console.log(pc.cyan(`  npm run dev`));
      console.log('\nHappy coding with Code Biruni!\n');

    } catch (err) {
      spinner.fail(pc.red('Error: ' + err.message));
    }
  });

program.parse(process.argv);