"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useRef, useEffect } from 'react';
import type { Team, Player, BallDefinition as BallDefType, PottedBallStats, TurnEvent, PottedBallDetail, ActiveTurnState } from '@/types/ball-count';
import { BALL_DEFINITIONS } from '@/config/ball-data';

const TEAMS_STORAGE_KEY = 'pjcheat_tracker_teams_v1';
const HISTORY_STORAGE_KEY = 'pjcheat_tracker_history_v1';

// Helper function to find the next player's turn
const findNextPlayerTurn = (
  teams: Team[],
  currentTeamId: string | null,
  currentPlayerId: string | null
): { teamId: string; playerId: string } | null => {
  if (!teams || teams.length === 0) return null;

  const orderedTurns: { teamId: string; playerId: string }[] = [];
  const maxDepth = Math.max(0, ...teams.map(t => t.players.length));

  if (maxDepth === 0) return null; // No players in any team

  for (let depth = 0; depth < maxDepth; depth++) {
    for (const team of teams) {
      if (depth < team.players.length) {
        orderedTurns.push({
          teamId: team.id,
          playerId: team.players[depth].id,
        });
      }
    }
  }

  if (orderedTurns.length === 0) return null;

  if (!currentTeamId || !currentPlayerId) {
    return orderedTurns[0];
  }

  const currentIndex = orderedTurns.findIndex(
    turn => turn.teamId === currentTeamId && turn.playerId === currentPlayerId
  );

  if (currentIndex === -1) {
    return orderedTurns[0];
  }

  const nextPlayerIndex = (currentIndex + 1) % orderedTurns.length;
  return orderedTurns[nextPlayerIndex];
};


const createPlayerClientSide = (name: string): Player => ({
  id: crypto.randomUUID(),
  name,
  score: 0,
  pottedBallsFrequency: {},
});

const initialActiveTurnState: ActiveTurnState = {
  teamId: null,
  playerId: null,
  playerName: null,
  teamName: null,
  pointsThisTurn: 0,
  ballsPottedThisTurn: [],
  turnStartTime: null,
};

interface BallCountContextType {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  selectedTeamId: string | null;
  setSelectedTeamId: React.Dispatch<React.SetStateAction<string | null>>;
  matchHistory: TurnEvent[];
  setMatchHistory: React.Dispatch<React.SetStateAction<TurnEvent[]>>;
  activeTurn: ActiveTurnState;
  setActiveTurn: React.Dispatch<React.SetStateAction<ActiveTurnState>>;
  
  editingTeamId: string | null;
  setEditingTeamId: React.Dispatch<React.SetStateAction<string | null>>;
  editingTeamNameInput: string;
  setEditingTeamNameInput: React.Dispatch<React.SetStateAction<string>>;
  
  editingPlayerDetails: { teamId: string; playerId: string } | null;
  setEditingPlayerDetails: React.Dispatch<React.SetStateAction<{ teamId: string; playerId: string } | null>>;
  editingPlayerNameInput: string;
  setEditingPlayerNameInput: React.Dispatch<React.SetStateAction<string>>;
  
  currentPlayer: Player | null;
  selectedTeam: Team | undefined | null;

  handleStartEditTeamName: (team: Team) => void;
  handleSaveTeamName: (teamIdToSave: string) => void;
  handleCancelEditTeamName: () => void;
  handleRemoveTeam: (teamIdToRemove: string) => void;
  handleAddTeam: (name?: string) => void;

  handleStartEditPlayerName: (teamId: string, player: Player) => void;
  handleSavePlayerName: (teamId: string, playerIdToSave: string) => void;
  handleCancelEditPlayerName: () => void;
  handleAddPlayer: (teamId: string) => void;
  handleRemovePlayer: (teamId: string, playerIdToRemove: string) => void;

  handleSetCurrentPlayer: (targetTeamId: string, targetPlayerId: string, logPreviousTurnIfAny?: boolean) => void;
  handleBallClick: (ballClicked: BallDefType) => void;
  handlePointerDown: (ball: BallDefType, event?: React.SyntheticEvent<HTMLButtonElement>) => void;
  handlePointerUp: (ball: BallDefType, event?: React.SyntheticEvent<HTMLButtonElement>) => void;
  handlePointerLeave: () => void;
  calculateTeamTotals: (team: Team | undefined | null) => { totalScore: number; aggregatedFrequency: PottedBallStats };
  findNextPlayerTurn: (teams: Team[], currentTeamId: string | null, currentPlayerId: string | null) => { teamId: string; playerId: string } | null;
  handleClearAllScores: () => void;
  handleUndoLastActionInTurn: () => void;
}

const BallCountContext = createContext<BallCountContextType | undefined>(undefined);

export const useBallCount = () => {
  const context = useContext(BallCountContext);
  if (!context) {
    throw new Error('useBallCount must be used within a BallCountProvider');
  }
  return context;
};

export const BallCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [matchHistory, setMatchHistory] = useState<TurnEvent[]>([]);
  const [activeTurn, setActiveTurn] = useState<ActiveTurnState>(initialActiveTurnState);

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamNameInput, setEditingTeamNameInput] = useState<string>('');

  const [editingPlayerDetails, setEditingPlayerDetails] = useState<{ teamId: string; playerId: string } | null>(null);
  const [editingPlayerNameInput, setEditingPlayerNameInput] = useState<string>('');

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef<boolean>(false);
  const isLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    const savedTeams = typeof window !== 'undefined' ? localStorage.getItem(TEAMS_STORAGE_KEY) : null;
    const savedHistory = typeof window !== 'undefined' ? localStorage.getItem(HISTORY_STORAGE_KEY) : null;

    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (e) {
        console.error("Failed to parse saved teams", e);
      }
    } else {
      const clientSideInitialTeams: Team[] = [
        {
          id: crypto.randomUUID(),
          name: 'Team Alpha',
          players: [createPlayerClientSide('Parag'), createPlayerClientSide('Ravish')],
          currentPlayerIndex: 0,
        },
        {
          id: crypto.randomUUID(),
          name: 'Team Bravo',
          players: [createPlayerClientSide('Player B1'), createPlayerClientSide('Player B2')],
          currentPlayerIndex: 0,
        },
      ];
      setTeams(clientSideInitialTeams);
    }

    if (savedHistory) {
      try {
        setMatchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse saved history", e);
      }
    }
    isLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(matchHistory));
    }
  }, [matchHistory]);

  const selectedTeam = useMemo(() => {
    if (!selectedTeamId || teams.length === 0) return null;
    return teams.find(t => t.id === selectedTeamId);
  }, [teams, selectedTeamId]);

  const currentPlayer = useMemo(() => {
    if (!selectedTeam || selectedTeam.players.length === 0 || selectedTeam.currentPlayerIndex < 0 || selectedTeam.currentPlayerIndex >= selectedTeam.players.length) {
      return null;
    }
    return selectedTeam.players[selectedTeam.currentPlayerIndex];
  }, [selectedTeam]);


  useEffect(() => {
    if (teams.length === 0) {
      if (selectedTeamId !== null) {
        setSelectedTeamId(null);
      }
      return;
    }
    const selectedTeamStillExists = teams.some(team => team.id === selectedTeamId);
    if (!selectedTeamId || !selectedTeamStillExists) {
      if (teams.length > 0 && teams[0].players.length > 0) {
         const firstTeamWithPlayers = teams.find(t => t.players.length > 0);
         if (firstTeamWithPlayers) {
            setSelectedTeamId(firstTeamWithPlayers.id);
         } else {
            setSelectedTeamId(teams[0].id);
         }
      } else if (teams.length > 0) {
        setSelectedTeamId(teams[0].id);
      } else {
        setSelectedTeamId(null);
      }
    }
  }, [teams, selectedTeamId]);

  useEffect(() => {
    if (!selectedTeamId || teams.length === 0) return;

    const teamToUpdate = teams.find(t => t.id === selectedTeamId);
    if (teamToUpdate) {
      let newPlayerIndex = teamToUpdate.currentPlayerIndex;
      let indexNeedsUpdate = false;

      if (teamToUpdate.players.length > 0) {
        if (newPlayerIndex < 0 || newPlayerIndex >= teamToUpdate.players.length) {
          newPlayerIndex = Math.max(0, Math.min(teamToUpdate.players.length - 1, newPlayerIndex));
          indexNeedsUpdate = true;
        }
      } else {
        if (newPlayerIndex !== 0) { 
          newPlayerIndex = 0;
          indexNeedsUpdate = true;
        }
      }

      if (indexNeedsUpdate) {
        setTeams(prevTeams =>
          prevTeams.map(t =>
            t.id === selectedTeamId ? { ...t, currentPlayerIndex: newPlayerIndex } : t
          ) 
        );
      }
    }
  }, [teams, selectedTeamId]);

  useEffect(() => {
    const currentP = currentPlayer;
    const selectedT = selectedTeam;
    
    if (currentP && selectedT) {
      const cpId = currentP.id;
      const stId = selectedT.id;
      const cpName = currentP.name;
      const stName = selectedT.name;

      if (activeTurn.playerId !== cpId || activeTurn.teamId !== stId) {
        setActiveTurn({
          teamId: stId,
          playerId: cpId,
          playerName: cpName,
          teamName: stName,
          pointsThisTurn: 0,
          ballsPottedThisTurn: [],
          turnStartTime: Date.now(),
        });
      }
    } else {
      if (activeTurn.playerId) {
         setActiveTurn(initialActiveTurnState);
      }
    }
  }, [currentPlayer, selectedTeam, activeTurn]);


  const calculateTeamTotals = (team: Team | undefined | null) => {
    if (!team) return { totalScore: 0, aggregatedFrequency: {} };
    let totalScore = 0;
    const aggregatedFrequency: PottedBallStats = {};
    team.players.forEach(player => {
      totalScore += player.score;
      Object.entries(player.pottedBallsFrequency).forEach(([ballValue, count]) => {
        aggregatedFrequency[Number(ballValue)] = (aggregatedFrequency[Number(ballValue)] || 0) + count;
      });
    });
    return { totalScore, aggregatedFrequency };
  };
  
  const handleAddTeam = (name: string = `Team ${String.fromCharCode(65 + (teams.length || 0))}`) => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: name.trim() || `Team ${String.fromCharCode(65 + (teams.length || 0))}`,
      players: [],
      currentPlayerIndex: 0,
    };
    setTeams(prevTeams => [...prevTeams, newTeam]);
    if (teams.length === 0) { 
      setSelectedTeamId(newTeam.id);
    }
  };

  const handleStartEditTeamName = (team: Team) => {
    setEditingTeamId(team.id);
    setEditingTeamNameInput(team.name);
    setEditingPlayerDetails(null); 
  };

  const handleSaveTeamName = (teamIdToSave: string) => {
    if (editingTeamNameInput.trim() === '') return;

    const trimmedName = editingTeamNameInput.trim();
    setTeams(prevTeams =>
      prevTeams.map(t =>
        t.id === teamIdToSave ? { ...t, name: trimmedName } : t
      ) 
    );
    setEditingTeamId(null);
  };

  const handleCancelEditTeamName = () => setEditingTeamId(null);

  const handleRemoveTeam = (teamIdToRemove: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamIdToRemove);
    setTeams(updatedTeams);
    if (selectedTeamId === teamIdToRemove) {
      setSelectedTeamId(updatedTeams.length > 0 ? updatedTeams.find(t => t.id !== teamIdToRemove)?.id ?? null : null);
    }
  };

  const handleStartEditPlayerName = (teamId: string, player: Player) => {
    setEditingPlayerDetails({ teamId, playerId: player.id });
    setEditingPlayerNameInput(player.name);
    setEditingTeamId(null); 
  };

  const handleSavePlayerName = (teamId: string, playerIdToSave: string) => {
    if (editingPlayerNameInput.trim() === '') return;

    const trimmedName = editingPlayerNameInput.trim();
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            players: t.players.map(p => {
              if (p.id === playerIdToSave) {
                return { ...p, name: trimmedName };
              }
              return p;
            }),
          };
        }
        return t;
      }) 
    );
    setEditingPlayerDetails(null);
  };

  const handleCancelEditPlayerName = () => setEditingPlayerDetails(null);

  const handleAddPlayer = (teamId: string) => {
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamId) {
          const newPlayerNumber = t.players.length + 1;
          const newPlayer = createPlayerClientSide(`Player ${newPlayerNumber}`);
          const newCurrentPlayerIndex = t.players.length === 0 ? 0 : t.currentPlayerIndex;
          return { ...t, players: [...t.players, newPlayer], currentPlayerIndex: newCurrentPlayerIndex };
        }
        return t;
      }) 
    );
  };

  const handleRemovePlayer = (teamId: string, playerIdToRemove: string) => {
    const playerIsActiveTurn = activeTurn.playerId === playerIdToRemove;
    let turnToLogFromRemoval: TurnEvent | null = null;

    if (playerIsActiveTurn && activeTurn.teamId && activeTurn.playerId && activeTurn.playerName && activeTurn.teamName && activeTurn.turnStartTime) {
       turnToLogFromRemoval = {
        id: crypto.randomUUID(),
        teamId: activeTurn.teamId,
        teamName: activeTurn.teamName,
        playerId: activeTurn.playerId,
        playerName: activeTurn.playerName,
        pointsScoredThisTurn: activeTurn.pointsThisTurn,
        ballsPottedThisTurn: activeTurn.ballsPottedThisTurn,
        timestamp: activeTurn.turnStartTime,
      };
    }
    
    if(turnToLogFromRemoval){
      setMatchHistory(prevHistory => [turnToLogFromRemoval!, ...prevHistory]);
    }

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamId) {
          const playerToRemoveIndex = t.players.findIndex(p => p.id === playerIdToRemove);
          const updatedPlayers = t.players.filter(p => p.id !== playerIdToRemove);
          
          let newCurrentPlayerIndex = t.currentPlayerIndex;
          if (updatedPlayers.length === 0) {
            newCurrentPlayerIndex = 0; 
          } else if (playerToRemoveIndex === t.currentPlayerIndex) {
            newCurrentPlayerIndex = Math.min(playerToRemoveIndex, updatedPlayers.length - 1);
          } else if (playerToRemoveIndex < t.currentPlayerIndex) {
            newCurrentPlayerIndex = t.currentPlayerIndex - 1;
          }
          newCurrentPlayerIndex = Math.max(0, Math.min(newCurrentPlayerIndex, updatedPlayers.length - 1));
          if (updatedPlayers.length === 0) newCurrentPlayerIndex = 0; 

          return { ...t, players: updatedPlayers, currentPlayerIndex: newCurrentPlayerIndex };
        }
        return t;
      }) 
    );
    if (playerIsActiveTurn) {
        const nextPlayer = findNextPlayerTurn(teams.map(team => 
          team.id === teamId ? { ...team, players: team.players.filter(p => p.id !== playerIdToRemove) } : team
        ), activeTurn.teamId, null); 
        if (nextPlayer) {
            handleSetCurrentPlayer(nextPlayer.teamId, nextPlayer.playerId, false); 
        } else {
            setActiveTurn(initialActiveTurnState);
        }
    }
  };

  const handleSetCurrentPlayer = (targetTeamId: string, targetPlayerId: string, logPreviousTurnIfAny: boolean = true) => {
    if (logPreviousTurnIfAny && activeTurn.playerId && activeTurn.teamId && activeTurn.playerName && activeTurn.teamName && activeTurn.turnStartTime) {
        const isSamePlayerAndTeam = activeTurn.teamId === targetTeamId && activeTurn.playerId === targetPlayerId;
        if (!isSamePlayerAndTeam) { 
            const turnEvent: TurnEvent = {
                id: crypto.randomUUID(),
                teamId: activeTurn.teamId,
                teamName: activeTurn.teamName,
                playerId: activeTurn.playerId,
                playerName: activeTurn.playerName,
                pointsScoredThisTurn: activeTurn.pointsThisTurn,
                ballsPottedThisTurn: activeTurn.ballsPottedThisTurn,
                timestamp: activeTurn.turnStartTime,
            };
            if (turnEvent.pointsScoredThisTurn !== 0 || turnEvent.ballsPottedThisTurn.length > 0) {
                 setMatchHistory(prevHistory => [turnEvent, ...prevHistory]);
            }
        }
    }

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === targetTeamId) {
          const playerIndex = t.players.findIndex(p => p.id === targetPlayerId);
          if (playerIndex !== -1) {
            return { ...t, currentPlayerIndex: playerIndex };
          }
        }
        return t;
      }) 
    );

    if (selectedTeamId !== targetTeamId) {
      setSelectedTeamId(targetTeamId);
    }
  };

  const handleBallClick = (ballClicked: BallDefType) => {
    if (!selectedTeam || !currentPlayer || selectedTeam.players.length === 0 || !selectedTeamId) {
      return;
    }
    const ballDefinition = BALL_DEFINITIONS.find(b => b.value === ballClicked.value);
    if (!ballDefinition) {
      console.error("Ball definition not found for value:", ballClicked.value);
      return;
    }
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === selectedTeamId) {
        return {
          ...team,
          players: team.players.map(player => {
            if (player.id === currentPlayer.id) {
              const updatedPlayer = { ...player };
              updatedPlayer.pottedBallsFrequency = { ...(player.pottedBallsFrequency || {}) };
              updatedPlayer.pottedBallsFrequency[ballDefinition.value] = (updatedPlayer.pottedBallsFrequency[ballDefinition.value] || 0) + 1;
              updatedPlayer.score += ballDefinition.value;
              return updatedPlayer;
            }
            return player;
          })
        };
      }
      return team;
    }));

    setActiveTurn(prev => ({
      ...prev,
      pointsThisTurn: prev.pointsThisTurn + ballDefinition.value,
      ballsPottedThisTurn: [
        ...prev.ballsPottedThisTurn,
        { ballValue: ballDefinition.value, ballName: ballDefinition.name, type: 'score' }
      ]
    }));
  };

  const handlePointerDown = (ball: BallDefType, event?: React.SyntheticEvent<HTMLButtonElement>) => {
    if (event && event.type.startsWith('touch')) event.preventDefault();
    isLongPressTriggeredRef.current = false; 
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true; 
      if (!teams || !selectedTeam || !currentPlayer || selectedTeam.players.length === 0 || !selectedTeamId || !activeTurn.teamId || !activeTurn.playerId || !activeTurn.playerName || !activeTurn.teamName || !activeTurn.turnStartTime) {
        return;
      }
      const ballDefinition = BALL_DEFINITIONS.find(b => b.value === ball.value);
      if (!ballDefinition) return;
      
      const foulPenalty = Math.max(4, ballDefinition.value);
      
      const turnEventDataForFoul: TurnEvent = {
        id: crypto.randomUUID(),
        teamId: activeTurn.teamId,
        teamName: activeTurn.teamName,
        playerId: activeTurn.playerId,
        playerName: activeTurn.playerName,
        pointsScoredThisTurn: activeTurn.pointsThisTurn - foulPenalty, 
        ballsPottedThisTurn: [
          ...activeTurn.ballsPottedThisTurn,
          { ballValue: ballDefinition.value, ballName: ballDefinition.name, type: 'foul' }
        ],
        timestamp: activeTurn.turnStartTime, 
      };
      setMatchHistory(prevHistory => [turnEventDataForFoul, ...prevHistory]);

      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id === selectedTeamId) {
          return {
            ...team,
            players: team.players.map(p => {
              if (p.id === currentPlayer.id) {
                return { ...p, score: p.score - foulPenalty };
              }
              return p;
            })
          };
        }
        return team;
      }));

      const nextTurnDetails = findNextPlayerTurn(teams, selectedTeamId, currentPlayer.id);
      if (nextTurnDetails) {
        handleSetCurrentPlayer(nextTurnDetails.teamId, nextTurnDetails.playerId, false); 
      } else {
         setActiveTurn(initialActiveTurnState); 
      }
    }, 700);
  };

  const handlePointerUp = (ball: BallDefType, event?: React.SyntheticEvent<HTMLButtonElement>) => {
    if (event && event.type.startsWith('touch') && !isLongPressTriggeredRef.current) {
       event.preventDefault();
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressTriggeredRef.current) { 
      handleBallClick(ball);
    }
    isLongPressTriggeredRef.current = false; 
  };

  const handlePointerLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleClearAllScores = () => {
    setTeams(prevTeams =>
      prevTeams.map(team => ({
        ...team,
        players: team.players.map(player => ({
          ...player,
          score: 0,
          pottedBallsFrequency: {},
        })),
      }))
    );
    setMatchHistory([]);
    setActiveTurn(initialActiveTurnState);
  };

  const handleUndoLastActionInTurn = () => {
    if (!activeTurn.playerId || activeTurn.ballsPottedThisTurn.length === 0) {
      return; 
    }

    const lastAction = activeTurn.ballsPottedThisTurn[activeTurn.ballsPottedThisTurn.length - 1];
    let pointsToAdjustReal = 0; 
    let pointsToAdjustTurn = 0; 

    if (lastAction.type === 'score') {
      pointsToAdjustReal = -lastAction.ballValue;
      pointsToAdjustTurn = -lastAction.ballValue;
    } else if (lastAction.type === 'foul') {
      const foulPenalty = Math.max(4, lastAction.ballValue);
      pointsToAdjustReal = foulPenalty; 
      pointsToAdjustTurn = foulPenalty; 
    }

    setTeams(prevTeams =>
      prevTeams.map(team => {
        if (team.id === activeTurn.teamId) {
          return {
            ...team,
            players: team.players.map(player => {
              if (player.id === activeTurn.playerId) {
                const updatedPlayer = {
                  ...player,
                  score: player.score + pointsToAdjustReal,
                };
                if (lastAction.type === 'score') {
                  updatedPlayer.pottedBallsFrequency = {
                    ...(updatedPlayer.pottedBallsFrequency || {}),
                  };
                  updatedPlayer.pottedBallsFrequency[lastAction.ballValue] =
                    (updatedPlayer.pottedBallsFrequency[lastAction.ballValue] || 1) - 1;
                  if (updatedPlayer.pottedBallsFrequency[lastAction.ballValue] <= 0) {
                    delete updatedPlayer.pottedBallsFrequency[lastAction.ballValue];
                  }
                }
                return updatedPlayer;
              }
              return player;
            }),
          };
        }
        return team;
      })
    );

    setActiveTurn(prev => ({
      ...prev,
      pointsThisTurn: prev.pointsThisTurn + pointsToAdjustTurn,
      ballsPottedThisTurn: prev.ballsPottedThisTurn.slice(0, -1), 
    }));
  };


  const value = {
    teams, setTeams,
    selectedTeamId, setSelectedTeamId,
    matchHistory, setMatchHistory,
    activeTurn, setActiveTurn,
    editingTeamId, setEditingTeamId,
    editingTeamNameInput, setEditingTeamNameInput,
    editingPlayerDetails, setEditingPlayerDetails,
    editingPlayerNameInput, setEditingPlayerNameInput,
    currentPlayer,
    selectedTeam,
    handleStartEditTeamName,
    handleSaveTeamName,
    handleCancelEditTeamName,
    handleRemoveTeam,
    handleAddTeam,
    handleStartEditPlayerName,
    handleSavePlayerName,
    handleCancelEditPlayerName,
    handleAddPlayer,
    handleRemovePlayer,
    handleSetCurrentPlayer,
    handleBallClick,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
    calculateTeamTotals,
    findNextPlayerTurn,
    handleClearAllScores,
    handleUndoLastActionInTurn,
  };

  return <BallCountContext.Provider value={value}>{children}</BallCountContext.Provider>;
};
