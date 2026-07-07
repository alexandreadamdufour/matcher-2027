import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { z } from "zod";
import { StanceSchema, WeightSchema, type UserAnswer } from "./schemas";

const DuoTupleSchema = z.tuple([z.string(), StanceSchema, WeightSchema]);

const DuoDataSchema = z.object({
  n: z.string().max(40).optional(),
  a: z.array(DuoTupleSchema).min(1).max(200),
});

export type DuoPayload = {
  name?: string;
  answers: UserAnswer[];
};

/**
 * Encodes a set of answers (and an optional display name) into a compact,
 * URL-safe string. Everything lives in the link itself — nothing is ever
 * sent to or stored on a server.
 */
export function encodeDuoPayload(answers: UserAnswer[], name?: string): string {
  const data = {
    a: answers.map((a) => [a.thesis_id, a.stance, a.weight] as const),
    ...(name?.trim() ? { n: name.trim().slice(0, 40) } : {}),
  };
  return compressToEncodedURIComponent(JSON.stringify(data));
}

/**
 * Decodes a duo payload from an untrusted URL fragment. Returns null on any
 * malformed, tampered, or unparseable input rather than throwing.
 */
export function decodeDuoPayload(encoded: string): DuoPayload | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = DuoDataSchema.parse(JSON.parse(json));
    return {
      name: parsed.n,
      answers: parsed.a.map(([thesis_id, stance, weight]) => ({
        thesis_id,
        stance,
        weight,
      })),
    };
  } catch {
    return null;
  }
}
