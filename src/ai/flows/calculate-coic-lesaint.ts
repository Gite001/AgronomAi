'use server';

/**
 * @fileOverview AI-powered recipe calculator using Coïc-Lesaint method.
 *
 * - calculateCoicLesaint - A function that generates a fertilizer recipe.
 * - CalculateCoicLesaintInput - The input type for the function.
 * - CalculateCoicLesaintOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutrientAnalysisSchema = z.object({
  ph: z.number().optional().describe('pH of the water'),
  ec: z.number().optional().describe('EC of the water in dS/m'),
  hco3: z.number().optional().describe('Bicarbonates (HCO3) in meq/L'),
  no3: z.number().optional().describe('Nitrate (NO3) in meq/L'),
  p: z.number().optional().describe('Phosphorus (P) in meq/L'),
  k: z.number().optional().describe('Potassium (K) in meq/L'),
  ca: z.number().optional().describe('Calcium (Ca) in meq/L'),
  mg: z.number().optional().describe('Magnesium (Mg) in meq/L'),
  so4: z.number().optional().describe('Sulfate (SO4) in meq/L'),
  cl: z.number().optional().describe('Chloride (Cl) in meq/L'),
  na: z.number().optional().describe('Sodium (Na) in meq/L'),
});


const CalculateCoicLesaintInputSchema = z.object({
  waterAnalysis: NutrientAnalysisSchema.describe("User's full water analysis data in meq/L."),
  targetSolution: NutrientAnalysisSchema.describe("The desired target nutrient solution composition in meq/L."),
});
export type CalculateCoicLesaintInput = z.infer<typeof CalculateCoicLesaintInputSchema>;

const CalculateCoicLesaintOutputSchema = z.object({
  recipe: z.string().describe("The calculated fertilizer recipe for mother solutions A and B, formatted for readability."),
  instructions: z.string().describe("Clear instructions on how to prepare and use the solutions."),
});
export type CalculateCoicLesaintOutput = z.infer<typeof CalculateCoicLesaintOutputSchema>;

export async function calculateCoicLesaint(input: CalculateCoicLesaintInput): Promise<CalculateCoicLesaintOutput> {
  return calculateCoicLesaintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateCoicLesaintPrompt',
  input: {schema: CalculateCoicLesaintInputSchema},
  output: {schema: CalculateCoicLesaintOutputSchema},
  prompt: `You are an expert agronomist specializing in hydroponics and fertigation. Your task is to calculate a fertilizer recipe based on the Coïc-Lesaint method.

You will be given a water analysis and a target nutrient solution, with values in meq/L unless specified otherwise.

Based on this data, you must:
1.  Calculate the required amounts of standard fertilizers (e.g., Calcium Nitrate, Potassium Nitrate, Monopotassium Phosphate, Magnesium Sulfate, etc.) to create two mother solutions (A and B) per 1000L of water.
2.  Ensure that incompatible elements (like Calcium/Phosphate and Calcium/Sulfate) are in separate tanks (A and B).
3.  Provide the final recipe in a clear, easy-to-read format (e.g., grams or kg per 1000L for each fertilizer in each tank).
4.  Provide clear, step-by-step instructions for dissolving the fertilizers and the dilution rate to obtain the target solution.
5.  The response must be in French.

Water Analysis:
- pH: {{{waterAnalysis.ph}}}
- EC (dS/m): {{{waterAnalysis.ec}}}
- HCO3 (meq/L): {{{waterAnalysis.hco3}}}
- NO3 (meq/L): {{{waterAnalysis.no3}}}
- P (meq/L): {{{waterAnalysis.p}}}
- K (meq/L): {{{waterAnalysis.k}}}
- Ca (meq/L): {{{waterAnalysis.ca}}}
- Mg (meq/L): {{{waterAnalysis.mg}}}
- SO4 (meq/L): {{{waterAnalysis.so4}}}
- Cl (meq/L): {{{waterAnalysis.cl}}}
- Na (meq/L): {{{waterAnalysis.na}}}


Target Nutrient Solution (meq/L):
- NO3 (meq/L): {{{targetSolution.no3}}}
- P (meq/L): {{{targetSolution.p}}}
- K (meq/L): {{{targetSolution.k}}}
- Ca (meq/L): {{{targetSolution.ca}}}
- Mg (meq/L): {{{targetSolution.mg}}}
- SO4 (meq/L): {{{targetSolution.so4}}}
`,
});

const calculateCoicLesaintFlow = ai.defineFlow(
  {
    name: 'calculateCoicLesaintFlow',
    inputSchema: CalculateCoicLesaintInputSchema,
    outputSchema: CalculateCoicLesaintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
