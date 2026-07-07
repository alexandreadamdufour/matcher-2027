import thesesData from "../../content/theses.json";
import alphaCandidate from "../../content/candidates/alpha.json";
import betaCandidate from "../../content/candidates/beta.json";
import gammaCandidate from "../../content/candidates/gamma.json";
import deltaCandidate from "../../content/candidates/delta.json";
import alphaPositions from "../../content/positions/alpha.json";
import betaPositions from "../../content/positions/beta.json";
import gammaPositions from "../../content/positions/gamma.json";
import deltaPositions from "../../content/positions/delta.json";

import {
  ThesisSchema,
  CandidateSchema,
  PositionSchema,
  type Thesis,
  type Candidate,
  type Position,
} from "./schemas";

import { z } from "zod";

const theses: Thesis[] = z.array(ThesisSchema).parse(thesesData);

const candidates: Candidate[] = z
  .array(CandidateSchema)
  .parse([alphaCandidate, betaCandidate, gammaCandidate, deltaCandidate]);

const positions: Position[] = z
  .array(PositionSchema)
  .parse([
    ...alphaPositions,
    ...betaPositions,
    ...gammaPositions,
    ...deltaPositions,
  ]);

export function getTheses(): Thesis[] {
  return theses;
}

export function getCandidates(): Candidate[] {
  return candidates;
}

export function getPositions(): Position[] {
  return positions;
}

export function getPositionsForCandidate(candidateId: string): Position[] {
  return positions.filter((p) => p.candidate_id === candidateId);
}

export function getPosition(
  candidateId: string,
  thesisId: string,
): Position | undefined {
  return positions.find(
    (p) => p.candidate_id === candidateId && p.thesis_id === thesisId,
  );
}
