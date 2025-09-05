'use server';

/**
 * @fileOverview AI-powered irrigation network designer.
 *
 * - designIrrigationNetwork - A function that generates a detailed irrigation plan.
 * - DesignIrrigationNetworkInput - The input type for the function.
 * - DesignIrrigationNetworkOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DesignIrrigationNetworkInputSchema = z.object({
  surfaceArea: z.number().describe("Surface area to be irrigated in hectares."),
  cropType: z.string().describe("Type of crop being grown (e.g., Tomato, Melon)."),
  emitterType: z.enum(["t-tape", "pe-dripline-in-line", "pe-dripline-on-line", "sprinkler", "mist-fogger"]).describe("Type of emitter used (drip tape, drippers, sprinklers, misters)."),
  emitterFlowRate: z.number().describe("Flow rate of a single emitter in L/h."),
  emitterSpacing: z.number().describe("Spacing between emitters on the line in meters."),
  lineSpacing: z.number().describe("Spacing between drip lines or laterals in meters."),
  linesPerRow: z.enum(["1", "2"]).describe("Number of drip lines per crop row."),
  maxRowLength: z.number().describe("Maximum length of a single crop row or lateral in meters."),
  pumpDistance: z.number().describe("Distance from the pump station to the irrigated plot in meters."),
  plotElevation: z.number().describe("Elevation difference between the pump and the highest point of the plot in meters. Use a negative value if the pump is higher than the plot."),
  energySource: z.enum(["electric", "diesel", "gas", "solar"]).describe("Energy source for the pump."),
  waterSourceCapacity: z.number().describe("Available water flow from the source (basin, well, etc.) in m³/h."),
  mainPipeDiameter: z.number().optional().describe("User's intended main pipe diameter in mm, if they have one in mind."),
});
export type DesignIrrigationNetworkInput = z.infer<typeof DesignIrrigationNetworkInputSchema>;

const DesignIrrigationNetworkOutputSchema = z.object({
  analysisReport: z.string().describe("A comprehensive, well-structured analysis report in HTML format. This includes the detailed design of the new network."),
});
export type DesignIrrigationNetworkOutput = z.infer<typeof DesignIrrigationNetworkOutputSchema>;

export async function designIrrigationNetwork(input: DesignIrrigationNetworkInput): Promise<DesignIrrigationNetworkOutput> {
  return designIrrigationNetworkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'designIrrigationNetworkPrompt',
  input: {schema: DesignIrrigationNetworkInputSchema},
  output: {schema: DesignIrrigationNetworkOutputSchema},
  prompt: `You are a collective of elite hydraulic engineers and expert agronomists specializing in the design of agricultural irrigation networks. Your client needs a comprehensive design plan.

The user provides the following data. Your task is to generate a detailed, professional-grade technical report in clean, structured HTML. Use appropriate tags like <h1>, <h2>, <h3>, <h4>, <p>, <ul>, <li>, and <strong>. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags. The response must be in French.

STRICT RULE - NO HYPERLINKS:
You MUST NOT create any hyperlinks (<a> tags) within the content. This rule is absolute.

**Données du Projet Client:**
-   **Surface (ha):** {{{surfaceArea}}}
-   **Culture:** {{{cropType}}}
-   **Gaines par Ligne:** {{{linesPerRow}}}
-   **Longueur Max Rampe (m):** {{{maxRowLength}}}
-   **Type Émetteur:** {{{emitterType}}}
-   **Débit Émetteur (L/h):** {{{emitterFlowRate}}}
-   **Écart Émetteurs (m):** {{{emitterSpacing}}}
-   **Écart Lignes (m):** {{{lineSpacing}}}
-   **Distance Pompe-Parcelle (m):** {{{pumpDistance}}}
-   **Dénivelé (m):** {{{plotElevation}}} (Si négatif, la station de pompage est plus haute que la parcelle)
-   **Source Énergie:** {{{energySource}}}
-   **Capacité Source Eau (m³/h):** {{{waterSourceCapacity}}}
-   **Diamètre Conduite Principale Prévu (mm):** {{{mainPipeDiameter}}} (si fourni)


**Votre rapport technique (analysisReport) DOIT suivre cette structure exacte :**

---

<h2>1. Cahier des Charges Agronomique</h2>
<p>Calcul des besoins fondamentaux du système. Cette section est essentielle car elle relie les besoins de la plante au matériel.</p>
<ul>
    <li><strong>Analyse des Besoins de la Culture ({{{cropType}}}) :</strong> Commencez par discuter des besoins spécifiques de la culture. Indiquez son besoin en eau typique en période de pointe (par exemple, en mm/jour ou m³/ha/jour). Expliquez si le type d'émetteur ({{{emitterType}}}) est adapté au système racinaire de la culture.</li>
    <li><strong>Débit d'irrigation horaire de la parcelle (pluviométrie horaire) :</strong> Calculez le débit total requis pour toute la parcelle en m³/h. La formule est : ( ( (Surface * 10000) / Écart Lignes ) * Gaines par Ligne ) / Écart Émetteurs * Débit Émetteur / 1000. Montrez votre calcul avec les valeurs fournies. CECI EST LE DÉBIT REQUIS POUR LA POMPE ET LA CONDUITE PRINCIPALE.</li>
    <li><strong>Validation par rapport à la source d'eau :</strong> Comparez le débit calculé avec la Capacité Source Eau. Indiquez clairement si la source est suffisante ou non.</li>
    <li><strong>Débit par rampe :</strong> Calculez le débit pour une seule rampe/goutteur en utilisant la Longueur Max Rampe. Formule : (Longueur Max Rampe / Écart Émetteurs) * Débit Émetteur. C'est crucial pour le dimensionnement des rampes.</li>
    <li><strong>Pression de service requise :</strong> Indiquez la pression de service typique requise à l'entrée de l'émetteur pour le type d'émetteur sélectionné (par exemple, 0.8-1.2 bar pour T-Tape, 1.5-2.5 bar pour les mini-asperseurs).</li>
</ul>

<h2>2. Conception et Dimensionnement du Réseau</h2>
<p>Ceci est la section d'ingénierie principale. Fournissez des calculs et des recommandations concrètes.</p>
<h4>2.1. Dimensionnement des Rampes (Porte-rampes)</h4>
<p>En fonction du débit par rampe et de la Longueur Max Rampe, recommandez un diamètre approprié pour les rampes (par exemple, 16mm, 20mm PE). Avertissez l'utilisateur si la Longueur Max Rampe semble trop longue pour le type d'émetteur et le débit choisis, car cela pourrait entraîner une perte de charge importante et une mauvaise uniformité.</p>

<h4>2.2. Dimensionnement des Conduites (Principale et Secondaires)</h4>
<p>C'est le calcul le plus critique. Vous devez déterminer le diamètre optimal de la conduite principale. Utilisez le débit total calculé. Visez une vitesse de l'eau entre 1.0 et 1.5 m/s pour équilibrer les pertes par frottement et le coût.</p>
<p><strong>Calcul du diamètre requis :</strong> Montrez la formule Q = S * V (où Q est le débit en m³/s, S la section en m², et V la vitesse en m/s). Recommandez un diamètre de tuyau standard (par exemple, 50, 63, 75, 90, 110, 125 mm) en fonction de votre calcul. Si l'utilisateur a fourni un diamètre, comparez-le à votre recommandation et expliquez les avantages et inconvénients.</p>

<h4>2.3. Calcul des Pertes de Charge Totales (HMT)</h4>
<p>Détaillez le calcul de la Hauteur Manométrique Totale (HMT).</p>
<ul>
    <li><strong>Pertes de charge linéaires :</strong> Estimez les pertes par frottement dans la conduite principale sur la Distance Pompe-Parcelle, en utilisant le diamètre et le débit choisis. Donnez une valeur estimée en mètres de colonne d'eau (mCE) ou en bar.</li>
    <li><strong>Pertes de charge singulières :</strong> Indiquez les marges standard pour les filtres (CRITIQUE : typiquement 0.5-0.8 bar ou 5-8 mCE pour un filtre propre), les vannes et les raccords. Donnez une valeur totale estimée.</li>
    <li><strong>Dénivelé (pression statique) :</strong> Utilisez la valeur de Dénivelé (m). Expliquez que si cette valeur est positive, la pompe doit lutter contre la gravité. Si elle est négative (la pompe est plus haute que la parcelle), la gravité aide, et cette valeur sera SOUSTRAITE de la pression totale requise.</li>
    <li><strong>Pression de service :</strong> La pression requise aux émetteurs.</li>
    <li><strong>HMT (Hauteur Manométrique Totale) :</strong> Additionnez toutes les valeurs ci-dessus pour obtenir la pression finale requise à la sortie de la pompe en bar et en mCE. (HMT = Pertes linéaires + Pertes singulières + Dénivelé + Pression de service). SOYEZ TRÈS PRUDENT : si le Dénivelé est négatif, il doit être soustrait. Par exemple : 15 (linéaire) + 8 (singulière) + (-10) (dénivelé) + 10 (service) = 23 mCE.</li>
</ul>

<h2>3. Spécifications de la Station de Pompage</h2>
<p>En fonction de la HMT et du débit total, spécifiez la pompe requise.</p>
<ul>
    <li><strong>Débit de la pompe :</strong> Indiquez le débit requis en m³/h.</li>
    <li><strong>Pression de la pompe :</strong> Indiquez la pression requise en bar (issue de la HMT).</li>
    <li><strong>Type de pompe et puissance :</strong> En fonction de la source d'énergie et des besoins, recommandez un type de pompe (par exemple, "pompe centrifuge électrique", "motopompe diesel"). Ajoutez une phrase expliquant le choix. Pour "électrique", mentionnez l'automatisation et l'efficacité. Pour "diesel" ou "gaz", mentionnez l'autonomie par rapport au réseau. Pour "solaire", mentionnez le débit variable et le besoin potentiel de stockage. Fournissez une puissance *estimée* en kW ou CV. Soulignez que le choix final doit être basé sur la courbe du fabricant de la pompe.</li>
</ul>

<h2>4. Recommandations Finales</h2>
<p>Fournissez un résumé des recommandations clés.</p>
<ul>
    <li>Rappelez à l'utilisateur l'importance de filtres à disques ou à tamis de haute qualité et de leur entretien régulier.</li>
    <li>Recommandez l'installation de manomètres à des points clés (après le filtre, au début de la ligne principale, à la fin d'une rampe représentative) pour le suivi.</li>
    <li>Conseillez l'installation de ventouses (purgeurs d'air) et de clapets anti-retour.</li>
    <li>Si le dénivelé était favorable (négatif), avertissez l'utilisateur du risque de surpression et du besoin potentiel de réducteurs de pression.</li>
    <li>Concluez en indiquant qu'il s'agit d'un guide de conception détaillé et que l'installation doit être effectuée par des professionnels qualifiés.</li>
</ul>

<h2>5. Tableau Récapitulatif de la Solution</h2>
<p>Voici un résumé des spécifications clés pour votre réseau d'irrigation. Ce tableau est une fiche technique à utiliser pour consulter les fournisseurs.</p>
<table style="width:100%; border-collapse: collapse; border: 1px solid hsl(var(--border));">
  <thead style="background-color: hsl(var(--muted));">
    <tr>
      <th style="padding: 8px; border: 1px solid hsl(var(--border)); text-align: left;">Composant</th>
      <th style="padding: 8px; border: 1px solid hsl(var(--border)); text-align: left;">Spécification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><strong>Débit Total Requis</strong></td>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><em>(Insérer ici la valeur calculée en m³/h)</em></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><strong>Pression Totale Requise (HMT)</strong></td>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><em>(Insérer ici la valeur calculée en bar et mCE)</em></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><strong>Diamètre Conduite Principale</strong></td>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><em>(Insérer ici le diamètre recommandé en mm)</em></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><strong>Spécifications Pompe</strong></td>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));">Débit: <em>(valeur)</em> m³/h, Pression: <em>(valeur)</em> bar</td>
    </tr>
     <tr>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><strong>Puissance Estimée Pompe</strong></td>
      <td style="padding: 8px; border: 1px solid hsl(var(--border));"><em>(Insérer ici la puissance estimée en CV ou kW)</em></td>
    </tr>
  </tbody>
</table>

---
`,
});

const designIrrigationNetworkFlow = ai.defineFlow(
  {
    name: 'designIrrigationNetworkFlow',
    inputSchema: DesignIrrigationNetworkInputSchema,
    outputSchema: DesignIrrigationNetworkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
        analysisReport: output!.analysisReport
    }
  }
);
