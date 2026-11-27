import { ABUNDANCE_LEVELS, DIFFICULTY_BY_ID } from '../data/worlds'

export { DIFFICULTY_BY_ID }

export const WORLDS_ABUNDANCE_LABEL = Object.fromEntries(
  ABUNDANCE_LEVELS.map((level) => [level.id, level.label]),
) as Record<(typeof ABUNDANCE_LEVELS)[number]['id'], string>
