'use server';

/**
 * @fileOverview Generates a detailed case study for a specific crop in a specific context.
 *
 * - generateCaseStudy - A function that handles the case study generation.
 * - GenerateCaseStudyInput - The input type for the function.
 * - GenerateCaseStudyOutput - The return type for the function.
 */

import { z } from 'genkit';

const GenerateCaseStudyInputSchema = z.object({
  crop: z.enum(["tomate", "poivron", "framboise", "courgette", "haricot vert", "melon"]).describe('The crop for the case study.'),
});
export type GenerateCaseStudyInput = z.infer<typeof GenerateCaseStudyInputSchema>;

const GenerateCaseStudyOutputSchema = z.object({
  caseStudyContent: z.string().describe('The generated case study content in clean, well-structured HTML format.'),
});
export type GenerateCaseStudyOutput = z.infer<typeof GenerateCaseStudyOutputSchema>;


const caseStudies: Record<string, string> = {
    tomate: `
<h1>Conduite Technique de la Tomate</h1>
<p><em>Guide stratégique pour une production performante en contexte Souss-Massa (culture sous abri, climat semi-aride).</em></p>
<h2>1. Introduction et Contexte</h2>
<p>La tomate est une culture stratégique majeure. Ce guide se concentre sur une conduite à haut rendement en contexte Souss-Massa, sous abris modernes (multichapelles), en partant de la réception des plants issus de pépinières spécialisées.</p>
<h2>2. Le Choix Variétal</h2>
<p>Le choix de la variété est la décision stratégique la plus importante de la campagne. Il doit être fait en fonction du marché cible et des contraintes de production.</p>
<h3>2.1. Critères Agronomiques</h3>
<ul>
    <li><strong>Potentiel de rendement :</strong> La variété doit être reconnue pour sa productivité élevée dans le contexte local.</li>
    <li><strong>Résistances aux maladies (CRITICAL) :</strong> C'est non-négociable. Le bouquet de résistances doit inclure au minimum : <strong>TYLCV, TSWV, et idéalement ToBRFV</strong>. Choisir une variété sans ces résistances est un pari extrêmement risqué.</li>
    <li><strong>Vigueur et port de la plante :</strong> Vigueur équilibrée, adaptée à des cycles longs et à la conduite sous abri.</li>
    <li><strong>Adaptation au climat :</strong> Bonne nouaison en conditions de chaleur et tolérance aux variations climatiques.</li>
</ul>
<h3>2.2. Critères Commerciaux</h3>
<ul>
    <li><strong>Conformité au marché cible :</strong> Calibre, forme, couleur (ex: rouge intense et brillant), et type (ronde, cocktail, cerise) doivent correspondre aux exigences des clients.</li>
    <li><strong>Qualité du fruit :</strong> <strong>Fermeté</strong> (critère N°1 pour l'export), <strong>coloration</strong> homogène, et bon niveau de <strong>Brix</strong>.</li>
    <li><strong>Durée de conservation (Shelf-life) :</strong> Essentielle pour l'exportation. Une bonne tenue post-récolte est un critère de choix primordial.</li>
</ul>
<h2>3. Préparation et Plantation (Jour 0)</h2>
<h3>3.1. Préparation du Sol</h3>
<p>Un labour profond, un amendement de fond bien décomposé, et une désinfection du sol (solarisation ou chimique) sont les prérequis pour un départ sain. Cette étape ne doit jamais être négligée.</p>
<h3>3.2. Plantation</h3>
<p>La densité de plantation doit être raisonnée : un compromise entre maximiser le nombre de plants et assurer une aération suffisante pour limiter les maladies et garantir la qualité du fruit. Une irrigation immédiate post-plantation avec un stimulateur racinaire est cruciale.</p>
<h2>4. Phase 1 : Enracinement et Démarrage</h2>
<h3>4.1. Objectifs Clés</h3>
<ul>
    <li>Développer un système racinaire puissant.</li>
    <li>Assurer une croissance végétative équilibrée sans excès.</li>
    <li>Maintenir une protection phytosanitaire préventive stricte.</li>
</ul>
<h3>4.2. Fertigation</h3>
<p>Solution équilibrée pour soutenir racines et feuillage, avec une légère dominance du phosphore (P). Équilibre type N-P-K-Ca-Mg : <strong>1 / 0.8 / 1.2 / 1 / 0.4</strong>. EC cible : 1.8-2.2 mS/cm.</p>
<h3>4.3. Programme Sanitaire</h3>
<p>Risques majeurs : Pythium, Rhizoctonia, et les premiers vols d'aleurodes et de thrips. Un traitement fongicide en drench au démarrage est recommandé. L'herméticité des filets insect-proof est non-négociable dès le premier jour.</p>
<h2>5. Phase 2 : Floraison et Nouaison</h2>
<h3>5.1. Objectifs Clés</h3>
<ul>
    <li>Optimiser la floraison et la nouaison.</li>
    <li>Maintenir l'équilibre plante/fruit.</li>
    <li>Renforcer la protection contre les ravageurs et maladies clés.</li>
</ul>
<h3>5.2. Fertigation</h3>
<p>Le potassium (K) devient plus important. Le ratio N/K évolue en faveur du K. Apports suffisants en Bore (B) et Calcium (Ca). Équilibre type : <strong>1 / 0.8 / 1.5 / 1.2 / 0.5</strong>. EC cible : 2.2-2.8 mS/cm.</p>
<h3>5.3. Programme Sanitaire</h3>
<p>Phase critique pour les ravageurs vecteurs de virus : <strong>Aleurodes (TYLCV) et Thrips (TSWV)</strong>. Surveillance accrue de <strong>Tuta absoluta</strong>. Introduction d'auxiliaires de culture (Macrolophus, Nesidiocoris) si la stratégie le permet. Prévention contre le Botrytis et l'Oïdium.</p>
<h3>5.4. Points de Vigilance et Carences</h3>
<ul>
    <li><strong>Carence en Calcium (Ca) :</strong> Nécrose apicale ("cul noir"). Souvent due à une irrigation irrégulière ou un antagonisme avec le K, pas un manque réel dans la solution. Corriger par des pulvérisations foliaires et un pilotage fin de l'irrigation.</li>
    <li><strong>Carence en Bore (B) :</strong> Mauvaise nouaison, déformation des jeunes feuilles. Maintenir un apport constant.</li>
</ul>
<h2>6. Phase 3 : Grossissement et Maturation</h2>
<h3>6.1. Objectifs Clés</h3>
<ul>
    <li>Maximiser le calibre et la qualité des fruits.</li>
    <li>Soutenir la plante face à la charge.</li>
    <li>Gérer les risques de fin de cycle.</li>
</ul>
<h3>6.2. Fertigation</h3>
<p>Dominance forte du potassium (K) pour le remplissage et la coloration. Maintien de l'azote (N) et du calcium (Ca) pour la fermeté et la croissance continue. Surveillance du magnésium (Mg). Équilibre type : <strong>1 / 0.6 / 1.8 / 1.2 / 0.6</strong>. EC cible : 2.5-3.5 mS/cm.</p>
<h3>6.3. Programme Sanitaire</h3>
<p>Risques accrus : Acariens (Tetranychus urticae), Botrytis sur fruits. Respect impératif des délais avant récolte (DAR) pour les traitements.</p>
<h3>6.4. Points de Vigilance</h3>
<ul>
    <li><strong>Antagonisme K/Ca/Mg :</strong> L'excès de K peut induire des carences en Ca et Mg.</li>
    <li><strong>Risques de fissuration (Cracking) :</strong> Liés à des irrigations irrégulières. Maintenir un régime hydrique constant.</li>
</ul>
<hr>
<h2>Annexe : La Brumisation, Outil Climatique</h2>
<p>La brumisation (ou "fogging") est une technique essentielle pour gérer les pics de chaleur et les baisses d'hygrométrie sous abri. Cependant, une mauvaise utilisation peut entraîner des catastrophes sanitaires. La maîtriser, c'est piloter le climat au lieu de le subir.</p>
<h3>1. Objectifs Stratégiques</h3>
<p>L'objectif principal n'est PAS de "mouiller les plantes". C'est de conditionner l'air de la serre.</p>
<ul>
    <li><strong>Baisser la température :</strong> C'est l'effet le plus connu. L'évaporation des fines gouttelettes d'eau absorbe de l'énergie (chaleur latente de vaporisation), refroidissant ainsi l'air ambiant de plusieurs degrés.</li>
    <li><strong>Augmenter l'hygrométrie (HR%) :</strong> En augmentant l'humidité relative, on réduit le stress hydrique de la plante.</li>
    <li><strong>Réduire le Déficit de Pression de Vapeur (VPD) :</strong> C'est l'objectif le plus important. Un VPD trop élevé (air trop sec et chaud) force la plante à transpirer excessivement, ce qui peut entraîner la fermeture des stomates, un arrêt de la photosynthèse, et la chute des fleurs par stress. La brumisation, en augmentant l'HR%, diminue le VPD et maintient la plante dans une zone de confort où elle reste active.</li>
    <li><strong>Améliorer la nouaison :</strong> En période de forte chaleur, le pollen peut perdre sa viabilité. En maintenant une température et une hygrométrie correctes grâce à la brumisation, on améliore significativement le taux de nouaison.</li>
</ul>
<h3>2. Protocole Opérationnel</h3>
<p>La brumisation est une action chirurgicale. On ne brumise pas "au hasard".</p>
<ul>
    <li><strong>Le "Quand" :</strong>
        <ul>
            <li><strong>Fenêtre horaire :</strong> Uniquement durant les heures les plus chaudes et sèches de la journée, typiquement entre 11h et 16h.</li>
            <li><strong>Déclenchement :</strong> Idéalement, piloté par des seuils. Par exemple : démarrer la brumisation si la température dépasse 30-32°C ET que l'hygrométrie descend sous 50-60%.</li>
        </ul>
    </li>
    <li><strong>Le "Comment" : Les Cycles Courts et Répétés</strong>
        <ul>
            <li>La règle d'or est : **"On brumise l'air, pas la plante"**. Le but est que les gouttelettes s'évaporent AVANT d'atteindre le feuillage.</li>
            <li>La meilleure stratégie est d'utiliser des **cycles courts et fréquents**. Par exemple : 15 secondes de brumisation toutes les 10 minutes, plutôt que 2 minutes en continu toutes les heures.</li>
            <li>Cette méthode maintient une ambiance fraîche et humide sans jamais saturer le feuillage en eau, ce qui est la porte ouverte aux maladies.</li>
        </ul>
    </li>
</ul>
<h3>3. Risques et Maîtrise (CRUCIAL)</h3>
<p>Le risque principal est unique et majeur : les **maladies fongiques** (Botrytis, Mildiou).</p>
<ul>
    <li><strong>Le Piège Mortel :</strong> Un feuillage qui reste humide pendant plusieurs heures est un terrain de jeu idéal pour le développement des spores. Brumiser le soir ou la nuit est une erreur catastrophique.</li>
    <li><strong>Les Règles de Sécurité Incontournables :</strong>
        <ol>
            <li><strong>Arrêter la brumisation bien avant le coucher du soleil.</strong> Le feuillage doit avoir le temps de sécher COMPLÈTEMENT avant la tombée de la nuit. En général, on arrête toute brumisation au moins 2 à 3 heures avant le coucher du soleil.</li>
            <li><strong>Assurer une ventilation maximale.</strong> La brumisation doit toujours être associée à une bonne aération de la serre. La ventilation aide à homogénéiser la température et l'humidité, et surtout, elle aide à sécher le feuillage plus rapidement une fois la brumisation terminée. Une brumisation dans une serre fermée et confinée est un pari extrêmement risqué.</li>
            <li><strong>Utiliser une eau de bonne qualité.</strong> Une eau chargée en sels peut laisser des dépôts sur le feuillage, réduisant la photosynthèse et pouvant causer des brûlures.</li>
        </ol>
    </li>
</ul>
<p>En conclusion, la brumisation est un outil proactif de gestion du climat. Raisonnée et bien pilotée, elle permet de traverser les périodes de stress intense. Mal gérée, elle peut créer une crise sanitaire. La clé est de toujours garder à l'esprit la nécessité d'un feuillage sec à la tombée de la nuit.</p>
`,
    poivron: `
<h1>Conduite Technique du Poivron</h1>
<p><em>Guide stratégique pour une production performante en contexte Souss-Massa (culture sous abri, climat semi-aride).</em></p>
<h2>1. Introduction et Contexte</h2>
<p>Le poivron, culture à haute valeur ajoutée, exige une technicité irréprochable. Ce guide est axé sur une production intensive sous abris modernes, pour le marché de l'export.</p>
<h2>2. Le Choix Variétal</h2>
<h3>2.1. Critères Agronomiques</h3>
<ul>
    <li><strong>Potentiel de rendement :</strong> Variété à haut potentiel, avec une bonne capacité de nouaison continue.</li>
    <li><strong>Résistances aux maladies (CRITICAL) :</strong> Le bouquet minimum doit inclure <strong>TSWV, CMV, et idéalement une résistance à l'oïdium (Lt)</strong>. La vigilance est également de mise pour le <strong>ToBRFV</strong> ; même si le poivron n'est pas sa cible principale, des variétés tolérantes ou des mesures de prophylaxie strictes sont recommandées.</li>
    <li><strong>Vigueur et port de la plante :</strong> Plante vigoureuse mais facile à conduire, avec des entre-nœuds courts pour maximiser la production.</li>
</ul>
<h3>2.2. Critères Commerciaux</h3>
<ul>
    <li><strong>Conformité au marché cible :</strong> Type (carré, conique), couleur (rouge, jaune, vert), et calibre (nombre de fruits/kg).</li>
    <li><strong>Qualité du fruit :</strong> <strong>Épaisseur de la paroi</strong> (wall thickness) pour le poids et la tenue, forme régulière (4 lobes pour le type carré), et coloration uniforme et intense.</li>
    <li><strong>Durée de conservation (Shelf-life) :</strong> Essentielle pour l'export.</li>
</ul>
<h2>3. Plantation et Installation</h2>
<p>La préparation du sol et la désinfection sont identiques à celles de la tomate. La densité est un facteur clé pour gérer la compétition pour la lumière. Une irrigation de qualité est indispensable dès le départ.</p>
<h2>4. Phase Végétative et Floraison</h2>
<h3>4.1. Fertigation</h3>
<p>Solution équilibrée au départ, puis enrichie en potassium (K) et en calcium (Ca) à l'approche de la floraison pour assurer une bonne nouaison et des parois cellulaires solides. Équilibre type floraison : <strong>1 / 0.8 / 1.6 / 1.3 / 0.5</strong>.</p>
<h3>4.2. Programme Sanitaire</h3>
<p>Surveillance maximale des <strong>Thrips (vecteur TSWV)</strong> et des pucerons. Prévention active contre l'oïdium. Le poivron est également sensible aux acariens.</p>
<h3>4.3. Conduite de la Culture</h3>
<p>La taille (ébourgeonnage) est une opération cruciale. Il faut laisser 2 ou 3 bras principaux et enlever systématiquement les autres départs pour aérer la plante et concentrer l'énergie sur les fruits de qualité.</p>
<h2>5. Phase de Production</h2>
<h3>5.1. Fertigation</h3>
<p>Les besoins en <strong>Potassium (K)</strong> et <strong>Calcium (Ca)</strong> sont très élevés pour assurer le grossissement des fruits et prévenir la nécrose apicale. Équilibre type production : <strong>1 / 0.5 / 2.0 / 1.5 / 0.6</strong>.</p>
<h3>5.2. Points de Vigilance (TRÈS IMPORTANT)</h3>
<ul>
    <li><strong>Nécrose Apicale ("Cul Noir") :</strong> Extrêmement fréquent sur poivron. Ce n'est PAS une maladie mais une carence en calcium localisée, presque toujours due à un stress hydrique (irrigation irrégulière) ou un antagonisme avec le potassium. Voir annexe.</li>
    <li><strong>Fissuration (Cracking) :</strong> Lié à des variations brutales d'irrigation ou de climat. Voir annexe.</li>
</ul>
<hr>
<h2>Annexe : La Brumisation, Outil Climatique</h2>
<p>La brumisation (ou "fogging") est une technique essentielle pour gérer les pics de chaleur et les baisses d'hygrométrie sous abri. Cependant, une mauvaise utilisation peut entraîner des catastrophes sanitaires. La maîtriser, c'est piloter le climat au lieu de le subir.</p>
<h3>1. Objectifs Stratégiques</h3>
<p>L'objectif principal n'est PAS de "mouiller les plantes". C'est de conditionner l'air de la serre.</p>
<ul>
    <li><strong>Baisser la température :</strong> C'est l'effet le plus connu. L'évaporation des fines gouttelettes d'eau absorbe de l'énergie (chaleur latente de vaporisation), refroidissant ainsi l'air ambiant de plusieurs degrés.</li>
    <li><strong>Augmenter l'hygrométrie (HR%) :</strong> En augmentant l'humidité relative, on réduit le stress hydrique de la plante.</li>
    <li><strong>Réduire le Déficit de Pression de Vapeur (VPD) :</strong> C'est l'objectif le plus important. Un VPD trop élevé (air trop sec et chaud) force la plante à transpirer excessivement, ce qui peut entraîner la fermeture des stomates, un arrêt de la photosynthèse, et la chute des fleurs par stress. La brumisation, en augmentant l'HR%, diminue le VPD et maintient la plante dans une zone de confort où elle reste active.</li>
    <li><strong>Améliorer la nouaison :</strong> En période de forte chaleur, le pollen peut perdre sa viabilité. En maintenant une température et une hygrométrie correctes grâce à la brumisation, on améliore significativement le taux de nouaison.</li>
</ul>
<h3>2. Protocole Opérationnel</h3>
<p>La brumisation est une action chirurgicale. On ne brumise pas "au hasard".</p>
<ul>
    <li><strong>Le "Quand" :</strong>
        <ul>
            <li><strong>Fenêtre horaire :</strong> Uniquement durant les heures les plus chaudes et sèches de la journée, typiquement entre 11h et 16h.</li>
            <li><strong>Déclenchement :</strong> Idéalement, piloté par des seuils. Par exemple : démarrer la brumisation si la température dépasse 30-32°C ET que l'hygrométrie descend sous 50-60%.</li>
        </ul>
    </li>
    <li><strong>Le "Comment" : Les Cycles Courts et Répétés</strong>
        <ul>
            <li>La règle d'or est : **"On brumise l'air, pas la plante"**. Le but est que les gouttelettes s'évaporent AVANT d'atteindre le feuillage.</li>
            <li>La meilleure stratégie est d'utiliser des **cycles courts et fréquents**. Par exemple : 15 secondes de brumisation toutes les 10 minutes, plutôt que 2 minutes en continu toutes les heures.</li>
            <li>Cette méthode maintient une ambiance fraîche et humide sans jamais saturer le feuillage en eau, ce qui est la porte ouverte aux maladies.</li>
        </ul>
    </li>
</ul>
<h3>3. Risques et Maîtrise (CRUCIAL)</h3>
<p>Le risque principal est unique et majeur : le **Botrytis (pourriture grise)**.</p>
<ul>
    <li><strong>Le Piège Mortel :</strong> Un feuillage qui reste humide pendant plusieurs heures est un terrain de jeu idéal pour le développement des spores de Botrytis, surtout sur les fleurs et les jeunes fruits. Brumiser le soir ou la nuit est une erreur catastrophique.</li>
    <li><strong>Les Règles de Sécurité Incontournables :</strong>
        <ol>
            <li><strong>Arrêter la brumisation bien avant le coucher du soleil.</strong> Le feuillage doit avoir le temps de sécher COMPLÈTEMENT avant la tombée de la nuit. En général, on arrête toute brumisation au moins 2 à 3 heures avant le coucher du soleil.</li>
            <li><strong>Assurer une ventilation maximale.</strong> La brumisation doit toujours être associée à une bonne aération de la serre. La ventilation aide à homogénéiser la température et l'humidité, et surtout, elle aide à sécher le feuillage plus rapidement une fois la brumisation terminée. Une brumisation dans une serre fermée et confinée est un pari extrêmement risqué.</li>
            <li><strong>Utiliser une eau de bonne qualité.</strong> Une eau chargée en sels peut laisser des dépôts sur le feuillage, réduisant la photosynthèse et pouvant causer des brûlures.</li>
        </ol>
    </li>
</ul>
<p>En conclusion, la brumisation est un outil proactif de gestion du climat. Raisonnée et bien pilotée, elle permet de traverser les périodes de stress intense. Mal gérée, elle peut créer une crise sanitaire avec le Botrytis. La clé est de toujours garder à l'esprit la nécessité d'un feuillage sec à la tombée de la nuit.</p>
<hr>
<h2>Annexe Spécifique au Poivron : Accidents Physiologiques</h2>
<p>Le poivron est particulièrement sensible à deux défauts de qualité majeurs qui ne sont pas des maladies, mais des réponses à des stress de culture. Les maîtriser est essentiel pour garantir une récolte commercialisable.</p>
<h3>Fissuration des Fruits (Cracking)</h3>
<p>La fissuration se produit lorsque la croissance de la peau (épiderme) du fruit ne peut pas suivre l'expansion rapide de la pulpe interne. C'est une rupture mécanique.</p>
<h4>Causes et Facteurs</h4>
<ul>
    <li><strong>Cause n°1 : Irrigation irrégulière.</strong> C'est le facteur le plus critique. Une période de stress hydrique suivie d'une irrigation abondante provoque un afflux d'eau massif dans le fruit. La pulpe gonfle rapidement, faisant éclater l'épiderme qui est moins élastique.</li>
    <li><strong>Hygrométrie élevée.</strong> Une forte humidité la nuit et tôt le matin limite la transpiration de la plante. La pression racinaire continue de pousser l'eau vers les fruits, augmentant la pression interne jusqu'au point de rupture.</li>
    <li><strong>Fortes variations de température jour/nuit.</strong> Cela peut aussi influencer les mouvements d'eau et le stress sur le fruit.</li>
    <li><strong>Excès d'azote (N).</strong> Une fertilisation trop azotée favorise un feuillage luxuriant et des tissus fragiles, rendant les fruits plus sensibles à l'éclatement.</li>
    <li><strong>Variété sensible.</strong> Certaines variétés sont génétiquement plus sujettes à la fissuration que d'autres.</li>
</ul>
<h4>Prévention et Solutions</h4>
<p>La prévention est la seule solution. Une fois qu'un fruit est fissuré, il est perdu commercialement.</p>
<ul>
    <li><strong>Pilotage fin de l'irrigation :</strong> C'est la clé. Maintenez une humidité constante dans le substrat ou le sol. Utilisez des capteurs (sondes tensiométriques, etc.) pour décider des irrigations. Préférez des apports fréquents et de plus faible volume à des irrigations massives et espacées.</li>
    <li><strong>Gestion de l'EC (Électroconductivité) :</strong> Évitez les variations brutales de l'EC de la solution nutritive. Maintenez une EC stable et adaptée au stade de la culture pour un flux d'eau régulier.</li>
    <li><strong>Contrôle du climat sous abri :</strong>
        <ul>
            <li>Assurez une bonne aération, surtout en fin de nuit et au lever du soleil, pour évacuer l'humidité et réactiver la transpiration de la plante.</li>
            <li>Chauffer légèrement avant le lever du soleil ("chauffage de réactivation") est une technique très efficace pour éviter les pics d'humidité et de pression racinaire.</li>
        </ul>
    </li>
    <li><strong>Nutrition Équilibrée :</strong>
        <ul>
            <li>Limitez l'azote (N) dès la nouaison. Un excès rend les tissus mous.</li>
            <li>Assurez des apports suffisants en <strong>Calcium (Ca)</strong> et en <strong>Bore (B)</strong>, qui sont essentiels pour la solidité et l'élasticité des parois cellulaires. Des applications foliaires préventives de Calcium et de Bore peuvent être bénéfiques.</li>
        </ul>
    </li>
</ul>
<h3>Nécrose Apicale ("Cul Noir")</h3>
<p>C'est une tache noire et sèche qui se développe à l'extrémité du fruit (côté opposé au pédoncule). Ce n'est pas un champignon, mais la mort des tissus due à une carence locale en calcium.</p>
<h4>Cause Fondamentale : Problème de Transport du Calcium</h4>
<p><strong>IMPORTANT :</strong> Dans 99% des cas, la nécrose apicale n'est PAS due à un manque de calcium dans la solution nutritive ou dans le sol. C'est un <strong>problème de transport</strong> du calcium à l'intérieur de la plante.</p>
<p>Le calcium est un élément peu mobile. Il est transporté uniquement par le flux de transpiration (le "flux de sève brute"). Les feuilles, qui transpirent beaucoup, sont des "pompes" à calcium très efficaces. Le fruit, qui transpire très peu, est un "puits" faible. Tout ce qui perturbe la transpiration peut provoquer une carence localisée dans le fruit, même si le reste de la plante est bien pourvu.</p>
<h4>Facteurs Déclenchants</h4>
<ul>
    <li><strong>Stress hydrique :</strong> Irrigation insuffisante ou irrégulière. Si la plante manque d'eau, le flux de transpiration ralentit et le calcium n'arrive plus jusqu'au fruit.</li>
    <li><strong>Salinité élevée (EC trop forte) :</strong> Une EC trop élevée dans la zone racinaire rend l'absorption d'eau plus difficile pour la plante, ce qui équivaut à un stress hydrique.</li>
    <li><strong>Antagonisme K/Ca et NH₄/Ca :</strong> Un excès de Potassium (K⁺) ou d'Ammonium (NH₄⁺) dans la solution nutritive entre en compétition avec le Calcium (Ca²⁺) pour l'absorption par les racines.</li>
    <li><strong>Développement racinaire faible :</strong> Un système racinaire endommagé ou peu développé ne peut pas absorber suffisamment d'eau et de nutriments.</li>
</ul>
<h4>Prévention et Solutions</h4>
<ul>
    <li><strong>Gestion de l'irrigation (encore !) :</strong> La priorité absolue est de maintenir une alimentation en eau constante et régulière. C'est le meilleur traitement préventif.</li>
    <li><strong>Pilotage de l'EC :</strong> Surveillez et ajustez l'EC de la solution nutritive et du drainage. Ne laissez pas l'EC du substrat monter trop haut, surtout pendant les périodes de forte chaleur.</li>
    <li><strong>Équilibre de la solution nutritive :</strong>
        <ul>
            <li>Maintenez un bon ratio K/Ca. En phase de grossissement, même si les besoins en potassium sont élevés, ne négligez jamais l'apport en calcium.</li>
            <li>Limitez l'utilisation d'azote sous forme ammoniacale (NH₄⁺), préférez la forme nitrique (NO₃⁻).</li>
        </ul>
    </li>
    <li><strong>Applications foliaires de Calcium :</strong> C'est une solution curative et préventive efficace. Appliquez du nitrate de calcium, du chlorure de calcium ou des chélates de calcium directement sur le feuillage et les jeunes fruits, de préférence tôt le matin ou en fin de journée. Répétez les applications toutes les semaines en période de risque.</li>
</ul>
`,
    courgette: `
<h1>Conduite Technique de la Courgette</h1>
<p><em>Guide stratégique pour une production performante en contexte Souss-Massa (culture sous abri, climat semi-aride).</em></p>
<h2>1. Introduction</h2>
<p>La courgette est une culture à cycle court et à croissance rapide, très exigeante. La réactivité est la clé du succès. Ce guide vise une production intensive sous abri.</p>
<h2>2. Le Choix Variétal</h2>
<h3>2.1. Critères Agronomiques</h3>
<ul>
    <li><strong>Résistances aux maladies (CRITICAL) :</strong> Le point le plus important. La variété DOIT avoir une résistance au <strong>ToLCNDV (New Delhi Virus)</strong> et idéalement au <strong>ZYMV</strong>. C'est un critère éliminatoire.</li>
    <li><strong>Vigueur :</strong> Plante ouverte pour faciliter la récolte et l'aération, avec des entre-nœuds courts.</li>
    <li><strong>Précocité :</strong> Capacité à produire rapidement pour capter les meilleures fenêtres de marché.</li>
</ul>
<h3>2.2. Critères Commerciaux</h3>
<ul>
    <li><strong>Couleur et brillance :</strong> Fruit d'un vert foncé, brillant et sans défauts.</li>
    <li><strong>Forme :</strong> Cylindrique et droite.</li>
    <li><strong>Tenue post-récolte :</strong> Fruit ferme avec une bonne durée de vie.</li>
</ul>
<h2>3. Plantation et Démarrage</h2>
<p>La densité doit permettre une bonne circulation de l'air. La courgette est très sensible aux maladies fongiques du collet (Pythium), un bon drainage et une irrigation modérée au départ sont donc essentiels.</p>
<h2>4. Phase de Production</h2>
<h3>4.1. Fertigation</h3>
<p>La courgette est une culture "gourmande" avec des besoins élevés et rapides. La fertigation doit être fréquente et bien dosée. Les besoins en potassium (K) sont très importants pour soutenir la production continue de fruits. Équilibre type : <strong>1 / 0.7 / 2.2 / 1.0 / 0.6</strong>.</p>
<h3>4.2. Programme Sanitaire</h3>
<ul>
    <li><strong>Aleurodes (vecteur ToLCNDV) :</strong> Tolérance zéro. Lutte intensive dès le premier jour.</li>
    <li><strong>Oïdium :</strong> Le principal ennemi fongique. Une stratégie préventive est indispensable, en alternant les matières actives.</li>
    <li><strong>Botrytis :</strong> Apparaît souvent sur les fleurs fanées et peut attaquer le jeune fruit. Une bonne aération est cruciale.</li>
</ul>
<h3>4.3. Conduite de la Culture</h3>
<p>La récolte doit être quasi-quotidienne pour maintenir la plante en production et éviter que les fruits ne deviennent trop gros. L'effeuillage régulier de la base de la plante est nécessaire pour améliorer l'aération.</p>
`,
    framboise: `
<h1>Conduite : Framboise & Myrtille</h1>
<p><em>Guide stratégique pour deux cultures à haute valeur ajoutée, aux exigences radicalement différentes.</em></p>
<div style="background-color: hsl(var(--destructive)/0.1); border-left: 4px solid hsl(var(--destructive)); padding: 1rem; margin-bottom: 2rem; border-radius: 0.5rem;">
    <h3 style="margin-top:0; color: hsl(var(--destructive-foreground));">AVERTISSEMENT FONDAMENTAL</h3>
    <p style="color: hsl(var(--foreground));">Ne commettez jamais l'erreur de penser que la framboise et la myrtille sont similaires. C'est la garantie de l'échec de l'une des deux cultures. Leurs besoins en sol sont diamétralement opposés :</p>
    <ul style="color: hsl(var(--foreground));">
        <li><strong>Framboise :</strong> Tolère un pH légèrement acide à neutre (6.0 - 6.8).</li>
        <li><strong>Myrtille :</strong> Exige un <strong>sol très acide (pH 4.5 - 5.5)</strong> pour survivre. Dans un sol neutre, elle mourra.</li>
    </ul>
    <p style="color: hsl(var(--foreground));">Ce guide présente les deux conduites séparément. Respectez leurs spécificités.</p>
</div>

<hr style="margin-top: 2rem; margin-bottom: 2rem;">

<h1>Partie 1 : Framboise</h1>
<h2>1. Introduction</h2>
<p>La framboise est une culture délicate et à très haute valeur ajoutée. La technicité est axée sur la qualité du fruit et la gestion sanitaire.</p>
<h2>2. Le Choix Variétal</h2>
<p>On distingue les variétés remontantes (produisant sur le bois de l'année) et non remontantes. Pour le contexte Souss-Massa, les variétés remontantes (type "primocane") sont les plus adaptées pour une production continue.</p>
<h3>Critères de Choix</h3>
<ul>
    <li><strong>Productivité et calibre :</strong> Variété productive avec des fruits de gros calibre, fermes et faciles à détacher.</li>
    <li><strong>Goût et couleur :</strong> Qualités organoleptiques (Brix, acidité) et couleur rouge brillante.</li>
    <li><strong>Fermeté et Shelf-life :</strong> Le fruit est fragile. La fermeté et la tenue post-récolte sont les critères N°1 pour l'export.</li>
    <li><strong>Résistance aux maladies :</strong> Tolérance à la pourriture grise (Botrytis) et aux maladies racinaires (Phytophthora).</li>
</ul>
<h2>3. Plantation et Conduite</h2>
<p>La plantation se fait souvent en substrat hors-sol (sacs, pots) pour un meilleur contrôle du système racinaire et de l'irrigation. La gestion du pH du substrat est critique (objectif : 6.0 - 6.5).</p>
<h2>4. Fertigation</h2>
<p>La framboise est sensible à la salinité. Il faut travailler avec une EC de solution nutritive modérée (1.6 - 2.0 mS/cm). Les besoins en potassium (K) et en calcium (Ca) sont importants pour la fermeté du fruit. Le fer (Fe) doit être surveillé de près, car les carences sont fréquentes (chlorose ferrique).</p>
<h2>5. Programme Sanitaire</h2>
<ul>
    <li><strong>Botrytis (Pourriture grise) :</strong> L'ennemi numéro 1. Une bonne aération, la gestion de l'humidité et des applications fongicides préventives sont obligatoires.</li>
    <li><strong>Acariens :</strong> Le ravageur principal sur framboise sous abri. Une lutte biologique (avec Phytoseiulus persimilis) donne d'excellents résultats.</li>
    <li><strong>Drosophila suzukii :</strong> Un ravageur redoutable qui pond dans les fruits mûrs. L'utilisation de filets insect-proof et le piégeage sont nécessaires.</li>
</ul>
<h2>6. Récolte</h2>
<p>La récolte est une opération très délicate, nécessitant beaucoup de main d'œuvre. Les fruits doivent être cueillis au bon stade de maturité, directement dans les barquettes finales, et mis au frais immédiatement pour préserver la qualité.</p>

<hr style="margin-top: 2rem; margin-bottom: 2rem;">

<h1>Partie 2 : Myrtille (Bleuet)</h1>
<h2>1. Introduction</h2>
<p>La myrtille est une culture de spécialité avec des exigences très spécifiques, mais qui peut être très rentable si sa principale contrainte est respectée : l'acidité du sol.</p>
<h2>2. Condition Clé : le pH du Sol</h2>
<ul>
    <li><strong>Plante Acidophile Stricte :</strong> La myrtille est une Ericaceae. Elle ne peut pousser que dans un sol ou un substrat avec un <strong>pH très acide, idéalement entre 4.5 et 5.5</strong>.</li>
    <li><strong>Le Risque Mortel :</strong> Si le pH est supérieur à 5.8, la plante développe une <strong>chlorose ferrique sévère</strong>. Les jeunes feuilles deviennent jaunes avec des nervures vertes, la photosynthèse s'arrête, et la plante meurt. C'est la cause N°1 d'échec de cette culture.</li>
    <li><strong>Solution Pratique :</strong> La culture se fait quasi-exclusivement en <strong>hors-sol</strong>, dans des pots ou des bacs remplis d'un substrat acide (ex: mélange de tourbe blonde, écorce de pin compostée, perlite). Cela permet un contrôle total du pH.</li>
</ul>
<h2>3. Le Choix Variétal</h2>
<p>Les variétés sont classées selon leurs besoins en froid hivernal ("low chill", "mid chill", "high chill"). Pour les climats de type marocain, les variétés "Southern Highbush" (faibles besoins en froid) sont les plus adaptées.</p>
<h3>Critères de Choix</h3>
<ul>
    <li><strong>Précocité et adaptation :</strong> Variétés adaptées aux hivers doux pour une production précoce.</li>
    <li><strong>Qualité du fruit :</strong> Gros calibre, fermeté, couleur bleu pruiné caractéristique ("bloom"), et bonne saveur.</li>
    <li><strong>Vigueur du plant :</strong> Port érigé facilitant la récolte.</li>
</ul>
<h2>4. Plantation et Conduite</h2>
<p>Utiliser des pots d'au moins 25-30 litres. Le système d'irrigation doit être très performant (goutte-à-goutte avec plusieurs goutteurs par pot) car le système racinaire de la myrtille est très fin, superficiel et sans poils absorbants, ce qui la rend très sensible au stress hydrique.</p>
<h2>5. Fertigation</h2>
<ul>
    <li><strong>Spécificités :</strong> Utiliser des engrais acidifiants pour maintenir le pH bas. La myrtille a une préférence pour l'<strong>azote sous forme ammoniacale (NH₄⁺)</strong> plutôt que nitrique (NO₃⁻).</li>
    <li><strong>Sensibilité :</strong> Elle est très sensible à la salinité et au chlore. L'EC de la solution nutritive doit être maintenue relativement basse (1.2 - 1.8 mS/cm).</li>
    <li><strong>Nutrition :</strong> Les besoins en Phosphore (P) sont faibles, tandis que ceux en Potassium (K) et en Fer (Fe, sous forme chélatée) sont cruciaux.</li>
</ul>
<h2>6. Programme Sanitaire</h2>
<ul>
    <li><strong>Maladies racinaires :</strong> Le Phytophthora peut être un problème en cas de mauvais drainage du substrat.</li>
    <li><strong>Botrytis :</strong> La pourriture grise sur les fleurs et les fruits reste un risque majeur, nécessitant une bonne aération.</li>
    <li><strong>Ravageurs :</strong> Les pucerons et les cochenilles peuvent être des problèmes. La surveillance de la Drosophila suzukii est également importante.</li>
</ul>
<h2>7. Récolte</h2>
<p>La récolte est manuelle et délicate pour préserver la pruine, cette couche cireuse blanche qui protège le fruit et qui est un signe de fraîcheur. Comme pour la framboise, la mise au frais doit être immédiate.</p>
`,
    "haricot vert": `
<h1>Conduite Technique du Haricot Vert</h1>
<p><em>Guide stratégique pour une production performante en contexte Souss-Massa (culture sous abri, climat semi-aride).</em></p>
<h2>1. Introduction</h2>
<p>Le haricot vert est une culture rapide qui s'intègre bien dans les rotations. La qualité de la gousse (finesse, rectitude) est le principal objectif.</p>
<h2>2. Le Choix Variétal</h2>
<ul>
    <li><strong>Type de gousse :</strong> "Filet" ou "mangetout", selon le marché. Gousses fines, droites, sans fil et d'une couleur verte intense.</li>
    <li><strong>Résistances :</strong> Résistance au virus de la mosaïque commune du haricot (BCMV) et à l'anthracnose.</li>
    <li><strong>Port de la plante :</strong> Variétés naines pour la culture à plat ou volubiles pour la culture tuteurée.</li>
</ul>
<h2>3. Semis et Installation</h2>
<p>Le haricot est une légumineuse, il a donc la capacité de fixer l'azote atmosphérique grâce à des bactéries (Rhizobium). Les besoins en azote au démarrage sont donc modérés. Le sol doit être bien aéré et non compacté.</p>
<h2>4. Fertigation</h2>
<p>Les besoins sont modérés au début, puis augmentent fortement à la floraison et pendant la formation des gousses. Le potassium (K) est essentiel pour la qualité des gousses. Le bore (B) est important pour la floraison.</p>
<h2>5. Programme Sanitaire</h2>
<ul>
    <li><strong>Acariens et Aleurodes :</strong> Les principaux ravageurs sous abri. Une surveillance constante est nécessaire.</li>
    <li><strong>Botrytis :</strong> Peut se développer sur les fleurs et les gousses en conditions humides. Une bonne aération est la meilleure prévention.</li>
    <li><strong>Rouille :</strong> Maladie fongique qui peut apparaître si l'humidité est élevée.</li>
</ul>
<h2>6. Récolte</h2>
<p>La récolte doit être effectuée à un stade jeune pour garantir la finesse des gousses. Des passages fréquents sont nécessaires pour récolter les gousses au fur et à mesure de leur formation.</p>
`,
    melon: `
<h1>Conduite Technique du Melon</h1>
<p><em>Guide stratégique pour une production performante en contexte Souss-Massa (culture sous abri, climat semi-aride).</em></p>
<h2>1. Introduction</h2>
<p>La culture du melon vise la production de fruits de haute qualité gustative (taux de sucre) et d'une bonne présentation. La technicité est élevée.</p>
<h2>2. Le Choix Variétal</h2>
<ul>
    <li><strong>Type :</strong> Charentais, Galia, Cantaloup... en fonction du marché.</li>
    <li><strong>Qualité gustative :</strong> Teneur en sucre élevée (Brix > 12-14%) et arômes intenses.</li>
    <li><strong>Résistances :</strong> Résistance au Fusarium et à l'Oïdium est indispensable.</li>
    <li><strong>Tenue post-récolte :</strong> Bonne conservation pour permettre le transport et la commercialisation.</li>
</ul>
<h2>3. Plantation et Conduite</h2>
<p>La culture est souvent tuteurée verticalement pour améliorer l'aération et la qualité des fruits. La taille est une étape cruciale pour ne garder que les fruits de qualité sur les bonnes ramifications.</p>
<h2>4. Fertigation</h2>
<p>La nutrition est pilotée pour orienter la plante. Une phase végétative au départ, puis un pilotage plus "génératif" pour favoriser la floraison et la nouaison. En fin de cycle, l'irrigation et la fertilisation sont réduites (stress contrôlé) pour concentrer les sucres dans le fruit. Le potassium (K) est l'élément clé de la qualité. Équilibre type remplissage : <strong>1 / 0.6 / 2.5 / 1.0 / 0.5</strong>.</p>
<h2>5. Programme Sanitaire</h2>
<ul>
    <li><strong>Oïdium :</strong> L'ennemi numéro 1. Une lutte préventive est obligatoire.</li>
    <li><strong>Mouches mineuses et Aleurodes :</strong> Ravageurs fréquents sous abri. La lutte biologique peut être envisagée.</li>
    <li><strong>Didymella bryoniae (Chancre gommeux) :</strong> Maladie fongique qui attaque les tiges. Éviter les blessures de taille et maintenir une bonne aération.</li>
</ul>
<h2>6. Récolte</h2>
<p>La récolte se fait au stade de maturité optimal, qui est souvent déterminé par l'apparition d'une craquelure circulaire autour du pédoncule ("écriture"). Le taux de sucre doit être vérifié au réfractomètre.</p>
`
};

export async function generateCaseStudy(input: GenerateCaseStudyInput): Promise<GenerateCaseStudyOutput> {
  const content = caseStudies[input.crop];
  
  if (!content) {
    throw new Error(`Aucune étude de cas n'a été trouvée pour la culture : ${input.crop}`);
  }

  return {
    caseStudyContent: content
  };
}
