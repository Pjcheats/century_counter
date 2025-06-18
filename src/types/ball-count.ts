
export interface PottedBallStats {
  [ballValue: number]: number; // count of how many times each ball value was potted
}

export interface Player {
  id: string;
  name: string;
  score: number;
  pottedBallsFrequency: PottedBallStats;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  currentPlayerIndex: number;
}

export interface BallDefinition {
  value: number;
  name: string;
  colorHex: string;
  tailwindBg: string;
  tailwindText: string;
  IconComponent?: React.FC<{ className?: string }>;
}

// Details of a single ball action (score or foul) within a turn
export interface PottedBallDetail {
  ballValue: number;
  ballName: string;
  type: 'score' | 'foul'; // Differentiate between a score and a foul
}

// Event representing a completed player turn
export interface TurnEvent {
  id: string;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  pointsScoredThisTurn: number; // Can be negative if fouls outweigh scores
  ballsPottedThisTurn: PottedBallDetail[]; // Array of balls scored or fouled
  timestamp: number; 
}

// State for the currently active turn (data being accumulated)
export interface ActiveTurnState {
  teamId: string | null;
  playerId: string | null;
  playerName: string | null;
  teamName: string | null;
  pointsThisTurn: number;
  ballsPottedThisTurn: PottedBallDetail[];
  turnStartTime: number | null;
}
