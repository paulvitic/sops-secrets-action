import {execSync} from 'child_process'
import * as core from '@actions/core'
import {exportVariable} from '@actions/core'

export function setSecrets(sopsPath: string): void {
  try {
    const decryptedJson = execSync(`sops --decrypt ${sopsPath}`, {
      encoding: 'utf8'
    })

    // Parse the decrypted JSON
    const decryptedData = JSON.parse(decryptedJson)

    // Set the decrypted values as GitHub Actions secrets
    for (const key in decryptedData) {
      if (Object.prototype.hasOwnProperty.call(decryptedData, key)) {
        console.log(`Setting secret for key '${key}'`)
        const value = decryptedData[key]
        core.exportVariable(key, value)
        core.setSecret(value)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
