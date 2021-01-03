import childProcess from 'child_process';
import path from 'path';
import { readdirSync } from 'fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/**
* Creates application bundles from the source files.
*/
const test = async (service: string) => {
  readdirSync(path.resolve(__dirname, '../', './services/')).map(
    x => path.resolve(__dirname, '../', './services/', x)
  )
    .filter(p => service ? p.endsWith(`/${service}`) : true)
    .map(p => {
      console.log(`Testing ${p}`);
      const result = childProcess.spawnSync( npm, ['test'], {
        cwd: p
      });   
      if (result.status > 0) {
        console.log(result.stdout.toString());
        console.error(result.stderr.toString());
        throw new Error(`Test for service ${p} failed.`);
      }
      console.log(`Finished testing ${p}`)
      return p;
    });
}

export default test;