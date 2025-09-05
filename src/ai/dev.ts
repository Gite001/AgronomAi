import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-fertigation-adjustments.ts';
import '@/ai/flows/count-pests.ts';
import '@/ai/flows/interpret-lab-report.ts';
import '@/ai/flows/analyze-plant-image.ts';
import '@/ai/flows/calculate-target-balance.ts';
import '@/ai/flows/calculate-coic-lesaint.ts';
import '@/ai/flows/generate-guide.ts';
import '@/ai/flows/calculate-soil-fertilization.ts';
import '@/ai/flows/ask-agronomist.ts';
import '@/ai/flows/design-irrigation-network.ts';
import '@/ai/flows/generate-case-study.ts';
import '@/ai/flows/estimate-yield.ts';
