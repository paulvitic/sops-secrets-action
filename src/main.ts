import * as core from '@actions/core'
import {execSync} from 'child_process'
import {installSops} from './installSops'
import {setSecrets} from './setSecrets'

function isSopsInstalled(): boolean {
  try {
    execSync(`sops -v`)
    return true
  } catch (error) {
    return false
  }
}
async function run(): Promise<void> {
  try {
    if (!isSopsInstalled()) {
      await installSops()
    } else {
      console.log(`sops is already installed.`)
    }

    const sopsPath: string = core.getInput('sopsPath')
    setSecrets(sopsPath)
    // core.debug(`Waiting ${sopsPath} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG`
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run().catch(core.setFailed)
