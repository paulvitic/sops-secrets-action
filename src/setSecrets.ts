import {execSync} from 'child_process'
import * as core from '@actions/core'
import {exportVariable} from "@actions/core";

function setGitHubSecrets(data: {[key: string]: string}): void {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      console.log(`Setting secret for key '${key}'`)
      const value = data[key]
      core.exportVariable(key, value)
      core.setSecret(value)
    }
  }
}

export function setSecrets(sopsPath: string): void {
  try {
    // Decrypt the sops file using the sops command
    // const kmsPath = process.env.KMS_PATH;
    // if (!kmsPath) {
    //     throw new Error('KMS_PATH environment variable not set');
    // }
    // const decryptedJson = execSync(`sops --decrypt --gcp-kms ${kmsPath} common_state.enc.json`, {
    //     encoding: 'utf8',
    // });

    const decryptedJson = execSync(`sops --decrypt ${sopsPath}`, {
      encoding: 'utf8'
    })

    // Parse the decrypted JSON
    const decryptedData = JSON.parse(decryptedJson)

    // Set the decrypted values as GitHub Actions secrets
    setGitHubSecrets(decryptedData)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
