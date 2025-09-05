'use server';

/**
 * @fileOverview AI-powered soil fertilization calculator based on a target nitrogen balance.
 *
 * - calculateSoilFertilization - A function that generates a fertilization plan.
 * - CalculateSoilFertilizationInput - The input type for the function.
 * - CalculateSoilFertilizationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CalculateSoilFertilizationInputSchema = z.object({
  nitrogenUnits: z.number().describe("The target amount of Nitrogen (N) in kg/ha."),
  targetBalance: z.string().describe("The target nutrient balance as a ratio (e.g., '1 - 0.8 - 1.2 - 0.3 - 0.4' for N-P₂O₅-K₂O-MgO-CaO)."),
  availableFertilizers: z.string().optional().describe("A comma-separated list of available fertilizers for the AI to use (e.g., 'Urea 46%, DAP 18-46-0, Potassium Sulfate')."),
});
export type CalculateSoilFertilizationInput = z.infer<typeof CalculateSoilFertilizationInputSchema>;

const CalculateSoilFertilizationOutputSchema = z.object({
  markdownPlan: z.string().describe("The full fertilization plan, including the fertilizer amounts and application instructions, formatted in a single Markdown string. Use tables for clarity."),
});
export type CalculateSoilFertilizationOutput = z.infer<typeof CalculateSoilFertilizationOutputSchema>;

export async function calculateSoilFertilization(input: CalculateSoilFertilizationInput): Promise<CalculateSoilFertilizationOutput> {
  return calculateSoilFertilizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateSoilFertilizationPrompt',
  input: {schema: CalculateSoilFertilizationInputSchema},
  output: {schema: CalculateSoilFertilizationOutputSchema},
  prompt: `You are an expert agronomist specializing in soil fertilization via FERTIGATION. Your task is to create a fertilization plan based on a target nitrogen dose, a desired nutrient balance, and a list of available fertilizers. This is for fertigation, not solid fertilizer application.

You will be given:
1.  Target Nitrogen (N) application rate in kg/ha.
2.  Target nutrient balance (e.g., N-P₂O₅-K₂O-MgO-CaO).
3.  A list of available water-soluble fertilizers.

Based on this data, you must generate a complete plan formatted in a single Markdown response.

The response must include:
1.  A section calculating the target application rates for all nutrients (P₂O₅, K₂O, MgO, CaO) in kg/ha based on the Nitrogen rate and the balance ratio.
2.  A section recommending a combination of FERTIGATION-GRADE (water-soluble) fertilizers to achieve the target nutrient rates. Use fertilizers from the provided list if possible. If the list is empty or insufficient, use standard soluble fertilizers (e.g., Urea (46-0-0), MAP (12-61-0), Potassium Nitrate (13-0-46), Calcium Nitrate, Magnesium Nitrate, Magnesium Sulfate, etc.).
3.  The final plan MUST be in a clear Markdown table, specifying the fertilizer and the total amount in kg/ha needed for the cycle. **The table formatting is critical and must follow this exact structure, with a new line for the separator:**
    \`\`\`markdown
    | Engrais               | Quantité (kg/ha) |
    |-----------------------|------------------|
    | Nitrate de Potassium  | 150.5            |
    | Phosphate Monoammonique | 85.2             |
    \`\`\`
4.  Crucially, provide practical instructions for application via FERTIGATION. This should include advice on splitting the total dose over the crop cycle (e.g., daily or weekly applications) and any advice on preparing stock solutions if applicable. DO NOT use terms like "engrais de fond" or "couverture".
5.  The entire response must be in French.

Target Nitrogen (N): {{{nitrogenUnits}}} kg/ha
Target Balance: {{{targetBalance}}}
Available Fertilizers: {{{availableFertilizers}}}
`,
});

const calculateSoilFertilizationFlow = ai.defineFlow(
  {
    name: 'calculateSoilFertilizationFlow',
    inputSchema: CalculateSoilFertilizationInputSchema,
    outputSchema: CalculateSoilFertilizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
