
'use server';

/**
 * @fileOverview AI-powered recipe calculator based on target balance.
 *
 * - calculateTargetBalance - A function that generates a fertilizer recipe.
 * - CalculateTargetBalanceInput - The input type for the function.
 * - CalculateTargetBalanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateTargetBalanceInputSchema = z.object({
  nitrogenPPM: z.number().describe("The target concentration of Nitrogen (N) in ppm."),
  targetBalance: z.string().describe("The target nutrient balance as a ratio (e.g., '1 - 0.5 - 1.5 - 0.8 - 0.4' for N-P-K-Ca-Mg)."),
});
export type CalculateTargetBalanceInput = z.infer<typeof CalculateTargetBalanceInputSchema>;

const CalculateTargetBalanceOutputSchema = z.object({
  recipe: z.string().describe("The calculated fertilizer recipe per 1000L of water, formatted for readability."),
  instructions: z.string().describe("Clear instructions on how to prepare and use the solution."),
});
export type CalculateTargetBalanceOutput = z.infer<typeof CalculateTargetBalanceOutputSchema>;

export async function calculateTargetBalance(input: CalculateTargetBalanceInput): Promise<CalculateTargetBalanceOutput> {
  return calculateTargetBalanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTargetBalancePrompt',
  input: {schema: CalculateTargetBalanceInputSchema},
  output: {schema: CalculateTargetBalanceOutputSchema},
  prompt: `You are an expert agronomist. Your task is to create a simple fertilizer recipe for a single tank solution based on a target nutrient balance and a desired Nitrogen concentration. Assume the water is pure (reverse osmosis water).

You will be given:
1.  Target Nitrogen (N) concentration in ppm.
2.  Target nutrient balance for N-P-K-Ca-Mg.

Based on this data, you must:
1.  Calculate the target ppm for P, K, Ca, and Mg based on the N ppm and the balance ratio.
2.  Calculate the required amounts of standard fertilizers (e.g., Calcium Nitrate, Potassium Nitrate, Monopotassium Phosphate, Magnesium Sulfate, etc.) to achieve the target ppm for all elements.
3.  Provide the final recipe in a clear, easy-to-read format (e.g., grams per 1000L of water).
4.  Provide clear, step-by-step instructions for dissolving the fertilizers.
5.  Mention any potential precipitation risks, although this method is for a single tank and assumes compatibility for simplicity.
6.  The response should be in French.


Target Nitrogen (N): {{{nitrogenPPM}}} ppm
Target Balance (N-P-K-Ca-Mg): {{{targetBalance}}}
`,
});

const calculateTargetBalanceFlow = ai.defineFlow(
  {
    name: 'calculateTargetBalanceFlow',
    inputSchema: CalculateTargetBalanceInputSchema,
    outputSchema: CalculateTargetBalanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
