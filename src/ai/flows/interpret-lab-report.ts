
'use server';

/**
 * @fileOverview AI-powered lab report interpreter.
 *
 * - interpretLabReport - A function that transforms lab reports (text or image) into actionable plans.
 * - InterpretLabReportInput - The input type for the interpretLab-report function.
 * - InterpretLabReportOutput - The return type for the interpretLab-report function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretLabReportInputSchema = z.object({
  reportData: z.string().describe(
    "The lab report data, either as text or as a data URI of an image that must include a MIME type and use Base64 encoding. Expected format for images: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type InterpretLabReportInput = z.infer<typeof InterpretLabReportInputSchema>;

const InterpretLabReportOutputSchema = z.object({
  actionablePlan: z.string().describe('An actionable plan based on the lab report, formatted in Markdown.'),
});
export type InterpretLabReportOutput = z.infer<typeof InterpretLabReportOutputSchema>;

export async function interpretLabReport(input: InterpretLabReportInput): Promise<InterpretLabReportOutput> {
  return interpretLabReportFlow(input);
}

const interpretLabReportFlow = ai.defineFlow(
  {
    name: 'interpretLabReportFlow',
    inputSchema: InterpretLabReportInputSchema,
    outputSchema: InterpretLabReportOutputSchema,
  },
  async (input) => {
    const isImage = input.reportData.startsWith('data:');

    const basePrompt = `Vous êtes un ingénieur agricole de classe mondiale, expert en nutrition des plantes et en interprétation d'analyses de laboratoire (sol, eau, sève). Votre rôle n'est pas de lire superficiellement les données, mais de les analyser en profondeur comme le ferait un consultant d'élite.

Vous recevrez un rapport de laboratoire (texte ou image). Votre tâche est de le transformer en un plan d'action stratégique, clair et formaté en Markdown.

Votre analyse DOIT inclure :
1.  **Une interprétation des chiffres :** Comparez les valeurs aux normes agronomiques. Ne vous contentez pas de lister les données, expliquez ce qu'elles signifient.
2.  **L'identification des déséquilibres :** Mettez en évidence les carences, les excès et, surtout, les rapports critiques entre les éléments (par exemple, K/Ca, K/Mg, Ca/Mg).
3.  **Un plan d'action précis :** Fournissez des recommandations concrètes et, si possible, chiffrées.

La réponse DOIT suivre ce format Markdown :
-   ### Diagnostic Principal
    *(Un résumé en 2-3 phrases des conclusions les plus importantes.)*
-   ### Points de Vigilance
    *(Une liste à puces détaillant chaque problème identifié : carence en X, excès de Y, déséquilibre Z...)*
-   ### Plan d'Action Correctif
    *(Une liste à puces de recommandations pratiques et hiérarchisées pour corriger les problèmes.)*

IMPORTANT : Si les données sont illisibles, incomplètes ou si vous ne pouvez pas les interpréter avec certitude, indiquez-le clairement. Ne formulez pas de recommandations basées sur des suppositions. Votre crédibilité est en jeu.

La réponse doit être impérativement et uniquement en français.
`;

    const promptParts: any[] = [{text: basePrompt}];

    if (isImage) {
        promptParts.push({media: {url: input.reportData}});
    } else {
        promptParts.push({text: `\n\nRapport de laboratoire (texte):\n${input.reportData}`});
    }

    const {output} = await ai.generate({
        prompt: promptParts,
        model: 'googleai/gemini-1.5-flash-latest',
        output: {
            schema: InterpretLabReportOutputSchema,
        },
    });

    return output!;
  }
);
