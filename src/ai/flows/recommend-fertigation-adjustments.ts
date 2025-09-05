'use server';
/**
 * @fileOverview An AI agent that recommends adjustments to fertigation solutions for soilless culture.
 *
 * - recommendFertigationAdjustments - A function that handles the fertigation adjustment recommendation process.
 * - RecommendFertigationAdjustmentsInput - The input type for the recommendFertigationAdjustments function.
 * - RecommendFertigationAdjustmentsOutput - The return type for the recommendFertigationAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFertigationAdjustmentsInputSchema = z.object({
  irrigationData: z
    .string()
    .describe('Irrigation data, including volume, frequency, and duration.'),
  drainageData: z
    .string()
    .describe('Drainage data, including volume, EC, and pH.'),
  cropType: z.string().describe('The type of crop being grown.'),
  growthStage: z.string().describe('The current growth stage of the crop.'),
  nutrientSolutionRecipe: z
    .string()
    .describe('The current nutrient solution recipe being used.'),
});
export type RecommendFertigationAdjustmentsInput = z.infer<
  typeof RecommendFertigationAdjustmentsInputSchema
>;

const RecommendFertigationAdjustmentsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'Recommendations for adjusting the fertigation solution, including specific nutrient adjustments and target EC/pH levels.'
    ),
  reasoning: z.string().describe('The reasoning behind the recommendations.'),
});
export type RecommendFertigationAdjustmentsOutput = z.infer<
  typeof RecommendFertigationAdjustmentsOutputSchema
>;

export async function recommendFertigationAdjustments(
  input: RecommendFertigationAdjustmentsInput
): Promise<RecommendFertigationAdjustmentsOutput> {
  return recommendFertigationAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFertigationAdjustmentsPrompt',
  input: {schema: RecommendFertigationAdjustmentsInputSchema},
  output: {schema: RecommendFertigationAdjustmentsOutputSchema},
  prompt: `Vous êtes un ingénieur agricole expert en gestion de la fertigation en culture hors-sol. Vous analyserez les données d'irrigation et de drainage fournies, ainsi que le type de culture, le stade de croissance et la recette de solution nutritive actuelle, pour recommander des ajustements à la solution de fertigation.

IMPORTANT : Si les données fournies sont insuffisantes ou incohérentes pour faire une recommandation fiable, expliquez pourquoi dans le champ "raisonnement" et suggérez les informations supplémentaires nécessaires. Ne devinez pas.

Données d'irrigation: {{{irrigationData}}}
Données de drainage: {{{drainageData}}}
Type de culture: {{{cropType}}}
Stade de croissance: {{{growthStage}}}
Recette de solution nutritive: {{{nutrientSolutionRecipe}}}

Sur la base de ces informations, fournissez des recommandations claires et concises pour ajuster la solution de fertigation, y compris des ajustements spécifiques des nutriments (par exemple, augmenter le potassium de 10 ppm) et les niveaux cibles de EC/pH. Expliquez le raisonnement derrière vos recommandations.

Assurez-vous que les recommandations sont pratiques et tiennent compte des besoins spécifiques de la culture à son stade de croissance actuel.

La réponse doit être impérativement et uniquement en français.
`,
});

const recommendFertigationAdjustmentsFlow = ai.defineFlow(
  {
    name: 'recommendFertigationAdjustmentsFlow',
    inputSchema: RecommendFertigationAdjustmentsInputSchema,
    outputSchema: RecommendFertigationAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
