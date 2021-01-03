import childProcess from 'child_process';
import path from 'path';
import { readdirSync } from 'fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/**
* Creates application bundles from the source files.
*/
const install = async () => {
  readdirSync(path.resolve(__dirname, '../', './services/')).map(
    x => path.resolve(__dirname, '../', './services/', x)
  ).map(p => {
    console.log(`Installing ${p}`);
    childProcess.spawnSync( npm, ['install'], {
      cwd: p
    });   
    console.log(`Finished installing ${p}`)
    return p;
  });
}

export default install;