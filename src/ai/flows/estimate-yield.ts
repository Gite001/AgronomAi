
'use server';

/**
 * @fileOverview An AI agent that estimates crop yield from a video analysis for various crops.
 *
 * - estimateYield - A function that handles the yield estimation process.
 * - EstimateYieldInput - The input type for the estimateYield function.
 * - EstimateYieldOutput - The return type for the estimateYield function.
 * - CropType - The supported crop types for estimation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropTypeSchema = z.enum(["tomate", "poivron", "courgette", "melon", "haricot vert"]);
export type CropType = z.infer<typeof CropTypeSchema>;

const EstimateYieldInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A short video of the crop row, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: CropTypeSchema.describe("The type of crop being analyzed."),
  initialPlantDensity: z.number().describe("La densité de plantation initiale en plants par hectare."),
  plantLossPercentage: z.number().min(0).max(100).describe("Le pourcentage estimé de plants perdus (mancants) depuis la plantation."),
  avgFruitWeight: z.number().describe("The average weight of a single fruit in grams."),
});
export type EstimateYieldInput = z.infer<typeof EstimateYieldInputSchema>;

const FruitCountSchema = z.object({
    ripe: z.number().describe("The average number of ripe fruits per plant."),
    maturing: z.number().describe("The average number of maturing (turning color) fruits per plant."),
    green: z.number().describe("The average number of green (unripe) fruits per plant."),
});

const EstimateYieldOutputSchema = z.object({
    avgFruitCountPerPlant: FruitCountSchema,
    avgFlowerCountPerPlant: z.number().describe("The estimated average number of flowers or flower bouquets per plant, depending on the crop."),
    calculatedPlantDensity: z.number().describe("The final plant density used for calculation, in plants/ha."),
    estimatedReadyYield: z.number().describe("The estimated ready-to-sell yield in kilograms per hectare (kg/ha), based ONLY on ripe fruits."),
    estimatedTotalYield: z.number().describe("The estimated total potential yield in kilograms per hectare (kg/ha), based on ALL fruits (ripe, maturing, green)."),
    confidenceScore: z.number().min(0).max(100).describe("A confidence score for the estimation, from 0 to 100."),
    analysisSummary: z.string().describe("A brief summary of the analysis, mentioning any potential issues like poor video quality or dense foliage that might affect accuracy.")
});
export type EstimateYieldOutput = z.infer<typeof EstimateYieldOutputSchema>;

export async function estimateYield(input: EstimateYieldInput): Promise<EstimateYieldOutput> {
  return estimateYieldFlow(input);
}

const YieldAnalysisSchema = z.object({
    avgFruitCountPerPlant: FruitCountSchema,
    avgFlowerCountPerPlant: z.number().describe("The estimated average number of flowers (or bouquets for tomato) per plant."),
    confidenceScore: z.number().min(0).max(100).describe("A confidence score for the estimation, from 0 to 100."),
    analysisSummary: z.string().describe("A brief summary of the analysis, mentioning any potential issues that might affect accuracy.")
});

const prompt = ai.definePrompt({
  name: 'estimateYieldPrompt',
  input: { schema: z.object({ videoDataUri: z.string(), cropType: CropTypeSchema }) },
  output: { schema: YieldAnalysisSchema },
  prompt: `Vous êtes un ingénieur agronome d'élite, spécialisé dans l'estimation de rendement par analyse d'images. Votre travail est d'une rigueur scientifique absolue. Vous ne devez PAS calculer de rendement final en kg/ha. Votre SEUL rôle est d'analyser la vidéo et de compter ce que vous voyez sur les plantes.

La culture à analyser est : {{{cropType}}}.

Votre processus d'analyse, d'une précision chirurgicale, doit suivre ces étapes :

1.  **Analyse Vidéo des Fruits & Fleurs :** Sur un échantillon représentatif de plantes dans la vidéo, vous devez :
    a.  Détecter et compter tous les fruits visibles, et les CLASSER méticuleusement par stade de maturité : 'ripe' (prêt à récolter), 'maturing' (en cours de maturation/véraison), et 'green' (vert). Calculez ensuite la moyenne pour chaque stade par plante.
    b.  Détecter et compter le potentiel floral. Adaptez votre méthode à la culture :
        -   Si la culture est **"tomate"**, comptez les **bouquets floraux (grappes de fleurs)** visibles. Calculez une moyenne de bouquets par plante.
        -   Si la culture est **"poivron", "courgette", "melon" ou "haricot vert"**, comptez les **fleurs individuelles** visibles. Calculez une moyenne de fleurs par plante.

2.  **Analyse de Confiance :** Attribuez un score de confiance de 0 à 100 basé sur la qualité de la vidéo.
    -   **Haute confiance (80-95%) :** Vidéo claire, stable, bonne visibilité de la culture, échantillon représentatif.
    -   **Confiance moyenne (60-80%) :** Feuillage un peu dense, éclairage moyen, vidéo légèrement instable.
    -   **Faible confiance (<60%) :** Vidéo floue, très instable, mauvaise visibilité, échantillon non représentatif.

3.  **Résumé d'Expert :** Fournissez un résumé bref, en français, expliquant vos comptages par plante. Mentionnez les facteurs impactant l'analyse. Par exemple, si vous analysez un **poivron** et comptez les fleurs, vous devez mentionner dans votre résumé le risque naturel et élevé de chute florale, qui rend cette partie de l'estimation purement indicative du potentiel à un instant T.

**RÈGLES IMPÉRATIVES :**
-   **RIGUEUR ABSOLUE :** Basez vos comptages UNIQUEMENT sur ce qui est visible. Ne devinez jamais, ne extrapolez pas au-delà des images fournies.
-   **GESTION DE LA MAUVAISE QUALITÉ :** Si la vidéo est inexploitable, mettez tous les comptages à 0, attribuez un score de confiance très bas, et expliquez clairement pourquoi dans le résumé (ex: "Vidéo trop floue et instable pour une analyse fiable.").
-   **LANGUE :** Votre réponse doit être exclusivement en français.

**Vidéo à analyser :**
{{media url=videoDataUri}}
`,
});

const estimateYieldFlow = ai.defineFlow(
  {
    name: 'estimateYieldFlow',
    inputSchema: EstimateYieldInputSchema,
    outputSchema: EstimateYieldOutputSchema,
  },
  async (input) => {
    const { output: analysisResult } = await prompt({ videoDataUri: input.videoDataUri, cropType: input.cropType });

    if (!analysisResult) {
        throw new Error("L'analyse visuelle par l'IA a échoué.");
    }

    const calculatedPlantDensity = input.initialPlantDensity * (1 - input.plantLossPercentage / 100);
    const avgFruitWeightKg = input.avgFruitWeight / 1000;

    const estimatedReadyYield = calculatedPlantDensity * analysisResult.avgFruitCountPerPlant.ripe * avgFruitWeightKg;
    const totalFruits = analysisResult.avgFruitCountPerPlant.ripe + analysisResult.avgFruitCountPerPlant.maturing + analysisResult.avgFruitCountPerPlant.green;
    const estimatedTotalYield = calculatedPlantDensity * totalFruits * avgFruitWeightKg;

    return {
        avgFruitCountPerPlant: analysisResult.avgFruitCountPerPlant,
        avgFlowerCountPerPlant: analysisResult.avgFlowerCountPerPlant,
        calculatedPlantDensity: Math.round(calculatedPlantDensity),
        estimatedReadyYield: Math.round(estimatedReadyYield),
        estimatedTotalYield: Math.round(estimatedTotalYield),
        confidenceScore: analysisResult.confidenceScore,
        analysisSummary: analysisResult.analysisSummary,
    };
  }
);
