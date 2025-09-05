'use server';

/**
 * @fileOverview Provides static, pre-written technical guides on agronomic topics.
 *
 * - generateGuide - A function that returns a pre-written guide.
 * - GenerateGuideInput - The input type for the generateGuide function.
 * - GenerateGuideOutput - The return type for the generateGuide function.
 */

import { z } from 'genkit';
import { guideContent } from './guides-content';

const GenerateGuideInputSchema = z.object({
  topic: z.string().describe('The agronomic topic for the guide.'),
});
export type GenerateGuideInput = z.infer<typeof GenerateGuideInputSchema>;

const GenerateGuideOutputSchema = z.object({
  guideContent: z.string().describe('The generated guide content in HTML format.'),
});
export type GenerateGuideOutput = z.infer<typeof GenerateGuideOutputSchema>;


export async function generateGuide(input: GenerateGuideInput): Promise<GenerateGuideOutput> {
    const content = guideContent[input.topic];
    if (!content) {
        throw new Error(`Aucun guide n'a été trouvé pour le sujet : ${input.topic}`);
    }
    return {
        guideContent: content,
    };
}
