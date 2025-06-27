import readline from 'readline';

export async function getInput(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('> You: ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export function outputResponse(response: string) {
  console.log(`\nLamina: ${response}\n`);
}
