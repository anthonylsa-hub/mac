import { z } from 'zod';

const MultipleChoiceOption = z.object({
  id: z.string(),
  text: z.string(),
  emoji: z.string().optional(),
  isCorrect: z.boolean(),
});

const TapSelectItem = z.object({
  id: z.string(),
  label: z.string(),
  emoji: z.string(),
  isTarget: z.boolean(),
});

const MatchingPair = z.object({
  leftId: z.string(),
  leftLabel: z.string(),
  rightId: z.string(),
  rightLabel: z.string(),
  leftEmoji: z.string().optional(),
  rightEmoji: z.string().optional(),
});

const ChecklistItem = z.object({
  id: z.string(),
  text: z.string(),
  emoji: z.string().optional(),
});

const DraggableItem = z.object({
  id: z.string(),
  label: z.string(),
  emoji: z.string().optional(),
  targetZoneId: z.string(),
});

const DropZone = z.object({
  id: z.string(),
  label: z.string(),
  emoji: z.string().optional(),
});

const GameRound = z.object({
  roundId: z.string(),
  prompt: z.string(),
  explanation: z.string(),
  hint: z.string(),
  options: z.array(MultipleChoiceOption).optional(),
  items: z.array(TapSelectItem).optional(),
  pairs: z.array(MatchingPair).optional(),
  checklist: z.array(ChecklistItem).optional(),
  draggables: z.array(DraggableItem).optional(),
  dropZones: z.array(DropZone).optional(),
});

export const GeneratedGameSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(200),
  type: z.enum(['multiple_choice', 'tap_to_select', 'matching', 'drag_and_drop', 'observation']),
  instructions: z.string().min(1),
  rounds: z.array(GameRound).min(1).max(10),
  completionMessage: z.string().min(1),
  totalRounds: z.number().int().min(1),
  ageGroup: z.string().optional(),
  skillTrack: z.string().optional(),
  locationContext: z.string().optional(),
});

export function validateGame(raw) {
  const result = GeneratedGameSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Game schema validation failed: ${issues}`);
  }
  return result.data;
}
