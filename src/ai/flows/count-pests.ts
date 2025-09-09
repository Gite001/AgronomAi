
'use server';

/**
 * @fileOverview Identifies and counts pests in an image of a sticky trap and provides a recommendation if a risk threshold is exceeded.
 *
 * - countPests - A function that handles the pest counting and recommendation process.
 * - CountPestsInput - The input type for the countPests function.
 * - CountPestsOutput - The return type for the countPests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountPestsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a sticky trap, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  riskThreshold: z.number().describe('The risk threshold for the total pest count.'),
});
export type CountPestsInput = z.infer<typeof CountPestsInputSchema>;

const PestCountDetailSchema = z.object({
    pestType: z.string().describe("The common name of the identified pest."),
    count: z.number().describe("The number of individuals of this pest type counted.")
});

const CountPestsOutputSchema = z.object({
  pestCounts: z.array(PestCountDetailSchema).describe('A list of all pests identified and their respective counts.'),
  totalPestCount: z.number().describe('The total number of all pests counted in the image.'),
  recommendation: z.string().describe('A recommendation based on the total pest count and risk threshold. This must be in French.'),
});
export type CountPestsOutput = z.infer<typeof CountPestsOutputSchema>;

export async function countPests(input: CountPestsInput): Promise<CountPestsOutput> {
  return await countPestsFlow(input);
}


const countPestsFlow = ai.defineFlow(
  {
    name: 'countPestsFlow',
    inputSchema: CountPestsInputSchema,
    outputSchema: CountPestsOutputSchema,
  },
  async ({ photoDataUri, riskThreshold }) => {
    
    const prompt = `Vous êtes un expert en Protection Biologique Intégrée (PBI), s'adressant à un professionnel de l'agriculture. Votre ton doit être direct, factuel et respectueux. Votre crédibilité est primordiale.

Analysez l'image du piège collant et fournissez un diagnostic précis au format JSON.

RÈGLES IMPÉRATIVES:
1.  **IDENTIFICATION & COMPTAGE RIGOUREUX:** Identifiez chaque ravageur avec précision. Soyez méticuleux dans le comptage. La justesse de votre analyse est non-négociable.
2.  **RECOMMANDATIONS STRICTEMENT BIOLOGIQUES:** Si le seuil est dépassé, vos recommandations doivent se limiter EXCLUSIVEMENT à des méthodes de lutte biologique ou intégrée (lâchers d'auxiliaires spécifiques, biopesticides comme le Bacillus thuringiensis, huiles minérales, savon noir, etc.). NE JAMAIS SUGGÉRER un insecticide chimique de synthèse. C'est une règle absolue.
3.  **GESTION DE L'INCERTITUDE:** Si l'image est de mauvaise qualité (floue, mauvais angle, trop sale), ne devinez pas. Mettez les comptages à 0 et expliquez dans la recommandation pourquoi l'analyse est impossible et ce qu'il faut faire pour obtenir une meilleure image (ex: "L'image est trop floue pour une analyse fiable. Veuillez fournir une photo nette du piège à plat, sous un bon éclairage.").
4.  **TON D'EXPERT:** Si le seuil est dépassé, la recommandation doit être convaincante et justifiée. Expliquez brièvement POURQUOI vous recommandez une solution (ex: "Le seuil pour les aleurodes est dépassé. Un lâcher d'Encarsia formosa est recommandé pour parasiter les larves et contrôler la population à sa source."). Si le seuil n'est pas atteint, conseillez de maintenir une surveillance active.
5.  **FORMAT & LANGUE:** La réponse doit être en français.

Seuil de risque défini par l'utilisateur: ${riskThreshold}`;

    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        output: {
            schema: CountPestsOutputSchema,
        },
        prompt: [
            { text: prompt },
            { media: { url: photoDataUri } }
        ]
    });

    return output!;
  }
);
