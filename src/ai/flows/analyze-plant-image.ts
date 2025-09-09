
'use server';

/**
 * @fileOverview An AI agent that analyzes a plant image to identify potential issues and suggest a course of action.
 *
 * - analyzePlantImage - A function that handles the plant image analysis process.
 * - AnalyzePlantImageInput - The input type for the analyzePlantImage function.
 * - AnalyzePlantImageOutput - The return type for the analyzePlantImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlantImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePlantImageInput = z.infer<typeof AnalyzePlantImageInputSchema>;

const AnalyzePlantImageOutputSchema = z.object({
  diagnosis: z.string().describe("Le diagnostic du problème de la plante, s'il y en a un. Il doit être précis et prudent."),
  suggestedAction: z.string().describe('Un plan d\'action suggéré pour résoudre le problème identifié.'),
});
export type AnalyzePlantImageOutput = z.infer<typeof AnalyzePlantImageOutputSchema>;

export async function analyzePlantImage(input: AnalyzePlantImageInput): Promise<AnalyzePlantImageOutput> {
  return analyzePlantImageFlow(input);
}


const analyzePlantImageFlow = ai.defineFlow(
  {
    name: 'analyzePlantImageFlow',
    inputSchema: AnalyzePlantImageInputSchema,
    outputSchema: AnalyzePlantImageOutputSchema,
  },
  async ({ photoDataUri }) => {

    const prompt = `Vous êtes un phytopathologiste d'élite, un expert reconnu pour la précision de ses diagnostics. Votre mission est d'identifier la maladie de la plante à partir de l'image fournie.

Votre processus de pensée doit suivre ces étapes :
1.  **Analyse Visuelle des Symptômes :** Décrivez brièvement mais précisément les symptômes que vous observez (ex: "Feutrage blanc poudreux sur la face supérieure des feuilles", "Taches brunes huileuses avec un halo jaune", "Pourriture grise cotonneuse sur la tige").
2.  **Diagnostic Nomminal :** Sur la base des symptômes, nommez la maladie la plus probable. Utilisez les noms courants et reconnus. Votre base de connaissances doit inclure, sans s'y limiter : Mildiou, Oïdium, Botrytis, Alternariose, Bactériose (Pseudomonas, Xanthomonas), Fusariose, Acariose (Tetranychus, Aculops), Cladosporiose, et les symptômes typiques des virus (mosaïques, nanisme).
3.  **Gestion de l'Incertitude :** Si le diagnostic n'est pas certain à 100%, évaluez votre confiance. Mentionnez les diagnostics différentiels possibles. Par exemple : "Le diagnostic le plus probable est une Bactériose, mais à ce stade, les symptômes pourraient être confondus avec un début de Mildiou."
4.  **Plan d'Action Stratégique :** Proposez un plan d'action clair, concis et directement applicable par un professionnel.

RÈGLES IMPÉRATIVES :
-   **NOMMER LA MALADIE :** Votre objectif principal est de mettre un nom sur le problème. Ne vous contentez pas de décrire les symptômes. Un diagnostic comme "Taches sur les feuilles" est inacceptable. Un diagnostic doit être "Suspicion de Mildiou" ou "Symptômes caractéristiques de l'Oïdium".
-   **PRUDENCE :** Si l'image est de mauvaise qualité ou si les symptômes sont ambigus, exprimez clairement votre incertitude. NE JAMAIS INVENTER UN DIAGNOSTIC. Il vaut mieux être prudent que de donner un mauvais conseil. En cas de doute sérieux, votre plan d'action DOIT recommander une observation plus approfondie ou des analyses complémentaires.
-   **CLARTÉ :** La réponse doit être en français.

Image à analyser: {{media url=photoDataUri}}
`;

    const { output } = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-1.5-flash-latest',
        output: {
            schema: AnalyzePlantImageOutputSchema,
        },
        promptData: {
          photoDataUri
        }
    });

    return output!;
  }
);
