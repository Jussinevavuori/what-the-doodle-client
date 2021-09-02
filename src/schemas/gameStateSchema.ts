import { z } from "zod";

export const gameStateSchema = z.object({
  roomId: z.string(),
  status: z.enum(["idle", "choose", "guess", "draw", "final", "finish"]),
  players: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      avatar: z.string(),
      isOnline: z.boolean(),
    })
  ),
  nRounds: z.number().nonnegative().int(),
  currentRoundIndex: z.number().nonnegative().int(),
  drawingTime: z.number().positive().int(),
  cards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      titleOptions: z.array(z.string()),
      cardNumber: z.number().nonnegative().int(),
    })
  ),
  finalGuesses: z.record(z.string()),
  rounds: z.array(
    z.object({
      id: z.string(),
      cardId: z.string(),
      picture: z.string(),
      guess: z.string(),
      title: z.string(),
      drawerId: z.string(),
      guesserId: z.string(),
      roundNumber: z.number().nonnegative().int(),
      cardNumber: z.number().nonnegative().int(),
    })
  ),
  maxPlayers: z.number().positive().int(),
});

export type GameStateSchema = z.TypeOf<typeof gameStateSchema>;

export function isGameStateSchema(arg: any): arg is GameStateSchema {
  return gameStateSchema.safeParse(arg).success;
}

export function getGameStateSchemaValidationError(arg: any) {
  const parseRes = gameStateSchema.safeParse(arg);
  if (!parseRes.success) return parseRes.error;
}
