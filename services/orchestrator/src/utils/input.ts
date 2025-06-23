import readline from 'readline';

export function askUser(promptText: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(promptText, ans => {
    rl.close();
    resolve(ans);
  }));
}