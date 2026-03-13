'use server';
/**
 * @fileOverview A Genkit flow for generating personalized spending tips.
 *
 * - generateSpendingTips - A function that handles the generation of spending tips.
 * - GenerateSpendingTipsInput - The input type for the generateSpendingTips function.
 * - GenerateSpendingTipsOutput - The return type for the generateSpendingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpendingTipsInputSchema = z.object({
  incomeEntries: z
    .array(
      z.object({
        description: z.string().describe('Description of the income source.'),
        amount: z.number().describe('Amount of income.'),
      })
    )
    .describe('A list of user income entries.'),
  expenseEntries: z
    .array(
      z.object({
        description: z.string().describe('Description of the expense.'),
        amount: z.number().describe('Amount of expense.'),
      })
    )
    .describe('A list of user expense entries.'),
});
export type GenerateSpendingTipsInput = z.infer<
  typeof GenerateSpendingTipsInputSchema
>;

const GenerateSpendingTipsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise summary of the user's spending habits and overall financial situation."
    ),
  tips: z
    .array(z.string())
    .describe('An array of personalized and actionable spending tips.'),
});
export type GenerateSpendingTipsOutput = z.infer<
  typeof GenerateSpendingTipsOutputSchema
>;

export async function generateSpendingTips(
  input: GenerateSpendingTipsInput
): Promise<GenerateSpendingTipsOutput> {
  return generateSpendingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpendingTipsPrompt',
  input: {schema: GenerateSpendingTipsInputSchema},
  output: {schema: GenerateSpendingTipsOutputSchema},
  prompt: `You are an AI financial assistant expert at providing personalized spending tips and insights.
Analyze the provided income and expense entries to identify areas for improvement and help the user manage their finances more effectively.
Provide a concise summary of their financial situation and a list of actionable spending tips.

Income Entries:
{{#each incomeEntries}}
- {{description}}: ${{amount}}
{{/each}}

Expense Entries:
{{#each expenseEntries}}
- {{description}}: ${{amount}}
{{/each}}

Based on these entries, provide a summary and personalized tips to improve financial management.`,
});

const generateSpendingTipsFlow = ai.defineFlow(
  {
    name: 'generateSpendingTipsFlow',
    inputSchema: GenerateSpendingTipsInputSchema,
    outputSchema: GenerateSpendingTipsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
