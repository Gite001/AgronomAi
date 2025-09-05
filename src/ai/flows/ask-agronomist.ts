
'use server';

/**
 * @fileOverview Provides expert agronomic answers to user questions.
 *
 * - askAgronomist - A function that handles the answering process.
 * - AskAgronomistInput - The input type for the function.
 * - AskAgronomistOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAgronomistInputSchema = z.object({
  question: z.string().describe("The user's question about an agronomic topic."),
});
export type AskAgronomistInput = z.infer<typeof AskAgronomistInputSchema>;

const AskAgronomistOutputSchema = z.object({
  answer: z.string().describe("The expert answer to the user's question, formatted in markdown."),
});
export type AskAgronomistOutput = z.infer<typeof AskAgronomistOutputSchema>;

export async function askAgronomist(input: AskAgronomistInput): Promise<AskAgronomistOutput> {
  return askAgronomistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAgronomistPrompt',
  input: {schema: AskAgronomistInputSchema},
  output: {schema: AskAgronomistOutputSchema},
  prompt: `Vous êtes un expert agronome de haut niveau. Votre mission est de fournir des réponses précises, factuelles et professionnelles aux questions des utilisateurs.

Votre réponse doit être :
1.  **Directe et Claire :** Allez droit au but et répondez précisément à la question posée.
2.  **Basée sur la Science :** Vos recommandations doivent être fondées sur des principes agronomiques reconnus.
3.  **Structurée :** Utilisez le format Markdown (titres, listes à puces, gras) pour rendre l'information facile à lire et à comprendre.
4.  **Professionnelle :** Adoptez un ton formel et expert. Évitez les expressions familières ou les opinions personnelles.
5.  **En Français :** L'intégralité de votre réponse doit être en français.

Question de l'utilisateur :
{{{question}}}
`,
});

const askAgronomistFlow = ai.defineFlow(
  {
    name: 'askAgronomistFlow',
    inputSchema: AskAgronomistInputSchema,
    outputSchema: AskAgronomistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
