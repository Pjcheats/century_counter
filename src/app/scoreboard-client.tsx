
// Client-side component for the main scoreboard page.
// This comment is added to try and resolve a potential subtle parsing issue.
"use client";

import React from 'react';
import Link from 'next/link';
import { useBallCount } from '@/context/BallCountContext';
import { BALL_DEFINITIONS } from '@/config/ball-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Users, ClipboardList, Users2, Target, Undo2 } from 'lucide-react';
import AnimatedScore from '@/components/AnimatedScore';

export default function ScoreboardClientPage() {
  const {
    teams,
    selectedTeamId,
    matchHistory,
    activeTurn,
    currentPlayer,
    selectedTeam,
    handleSetCurrentPlayer,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
    calculateTeamTotals,
    findNextPlayerTurn,
    handleUndoLastActionInTurn,
  } = useBallCount();

  if (!Array.isArray(teams)) {
    return (
      <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center justify-center font-sans animate-fade-in-up">
        <p className="text-muted-foreground text-center py-3 text-3xl sm:text-4xl md:text-5xl">Loading team data...</p>
      </div>
    );
  }
  
  if (teams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center justify-center font-sans animate-fade-in-up">
        <p className="text-muted-foreground text-center py-3 text-3xl sm:text-4xl md:text-5xl">No teams created yet. Go to "Manage Teams & Players" to add teams.</p>
        <Link href="/manage-teams" passHref className="mt-4">
            <Button variant="default" size="lg" className="text-3xl sm:text-4xl h-16 sm:h-20">
                <Users className="mr-2 h-9 w-9 sm:h-10" /> Manage Teams & Players
            </Button>
        </Link>
      </div>
    );
  }

  // Component's JSX rendering starts here.
  return (
    <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center font-sans">
      <header className="mb-4 sm:mb-6 text-center animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">Pjcheat's Century Tracker</h1>
        <p className="text-muted-foreground mt-1 text-lg sm:text-xl md:text-2xl">Track points per player turn.</p>
      </header>

      <main className="w-full max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6 animate-fade-in-up">
        <div className="text-center mb-3">
            <Link href="/manage-teams" passHref>
                <Button variant="outline" size="lg" className="text-xl sm:text-2xl h-12 sm:h-14">
                  <Users className="mr-1.5 h-7 w-7 sm:h-9" />
                  <span className="sm:hidden">Manage</span>
                  <span className="hidden sm:inline">Manage Teams & Players</span>
                </Button>
            </Link>
        </div>
        
        {teams.length > 0 && (
          <>
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="p-1.5 sm:p-2">
                <CardTitle className="flex items-center text-2xl sm:text-3xl md:text-4xl">
                  <ClipboardList className="mr-1.5 h-8 w-8 sm:h-9 md:h-10" />
                  Scoreboard
                </CardTitle>
                <div className="mt-1 space-y-1">
                  {selectedTeam && selectedTeam.players.length === 0 && (
                    <p className="text-center text-destructive p-1.5 bg-destructive/10 border border-destructive/30 rounded-md text-lg sm:text-xl">Selected team has no players. Add players in the 'Manage Teams' section to start scoring.</p>
                  )}
                  {(!selectedTeamId || !currentPlayer || selectedTeam?.players.length === 0) && teams.length > 0 && (
                    <p className="text-center text-muted-foreground p-1.5 text-lg sm:text-xl">Start a player's turn to begin scoring.</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-1.5 sm:p-2 pt-0 space-y-2 sm:space-y-2.5">
                <div className="space-y-4 sm:space-y-5">
                  {teams.map(team => {
                    const { totalScore } = calculateTeamTotals(team);
                    return (
                      <div 
                        key={team.id} 
                        className={`rounded-lg p-2.5 sm:p-3 border animate-fade-in ${selectedTeamId === team.id ? 'ring-2 ring-primary border-primary' : 'border-border bg-card'}`}
                      >
                        <div className="flex flex-row justify-between items-center mb-3 sm:mb-4"> 
                          <CardTitle className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold text-primary truncate mr-2" title={team.name}>
                            <Users2 className="mr-1.5 h-8 w-8 sm:h-9 md:h-10 shrink-0" />
                            <span className="truncate">{team.name}</span>
                          </CardTitle>
                          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary whitespace-nowrap">
                            <AnimatedScore targetValue={totalScore} className="inline-block" />
                          </p>
                        </div>
                        <div className="space-y-2.5 sm:space-y-3">
                          {team.players.map(player => (
                            <React.Fragment key={player.id}>
                              <div
                                className={`p-2.5 sm:p-3 rounded-md flex items-center justify-between animate-fade-in ${currentPlayer?.id === player.id && selectedTeamId === team.id ? 'ring-2 ring-accent bg-primary/10' : 'bg-muted border border-border/50'}`}
                              >
                                <div>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold truncate" title={player.name}>{player.name}</p>
                                    <p className="text-base sm:text-lg text-muted-foreground flex items-center">
                                      <Target className="mr-1 h-7 w-7 sm:h-8 text-red-500"/> Reds - <AnimatedScore targetValue={player.pottedBallsFrequency[15] || 0} className="font-medium text-foreground inline-block ml-1 text-base sm:text-lg" />
                                    </p>
                                </div>
                                {team.players.length > 0 && (
                                   currentPlayer?.id === player.id && selectedTeamId === team.id ? (
                                    <Button
                                      variant="destructive"
                                      size="sm" 
                                      className="ml-auto text-base sm:text-lg h-10 sm:h-11 px-4 sm:px-5"
                                      onClick={() => {
                                        if (currentPlayer && findNextPlayerTurn) {
                                          const nextPlayerDetails = findNextPlayerTurn(teams, selectedTeamId, currentPlayer.id);
                                          if (nextPlayerDetails) {
                                            handleSetCurrentPlayer(nextPlayerDetails.teamId, nextPlayerDetails.playerId);
                                          }
                                        }
                                      }}
                                    >
                                      <span className="sm:hidden">Next</span>
                                      <span className="hidden sm:inline">Next Turn</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="default"
                                      size="sm" 
                                      className="ml-auto text-base sm:text-lg h-10 sm:h-11 px-4 sm:px-5"
                                      onClick={() => handleSetCurrentPlayer(team.id, player.id)}
                                    >
                                      <span className="sm:hidden">Start</span>
                                      <span className="hidden sm:inline">Start Turn</span>
                                    </Button>
                                  )
                                )}
                              </div>
                              {selectedTeamId === team.id && currentPlayer?.id === player.id && (
                                <div className="mt-3 pt-3 border-t border-border animate-fade-in-up">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xl sm:text-2xl font-medium text-foreground"> 
                                      Break: <AnimatedScore 
                                        targetValue={activeTurn.pointsThisTurn} 
                                        className="inline-block font-semibold text-xl sm:text-2xl text-accent" 
                                      />
                                    </p>
                                    {activeTurn.ballsPottedThisTurn.length > 0 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleUndoLastActionInTurn}
                                        className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-primary"
                                        disabled={activeTurn.ballsPottedThisTurn.length === 0}
                                        aria-label="Undo last ball action"
                                      >
                                        <Undo2 className="h-6 w-6 sm:h-7 sm:w-7" />
                                      </Button>
                                    )}
                                  </div>

                                  {activeTurn.ballsPottedThisTurn.length > 0 && (
                                    <div className="mt-2 flex flex-col items-center space-y-2">
                                      <div className="flex flex-wrap justify-center gap-1.5">
                                        {activeTurn.ballsPottedThisTurn.map((ballDetail, index) => {
                                          const ballDef = BALL_DEFINITIONS.find(b => b.value === ballDetail.ballValue);
                                          if (!ballDef || !ballDef.IconComponent) return null;
                                          return (
                                            <div
                                              key={`${ballDetail.ballValue}-${index}-turn-active-${Date.now()}`} 
                                              className={`w-6 h-6 relative ${ballDetail.type === 'foul' ? 'ring-1 ring-destructive ring-offset-1 ring-offset-background/10 rounded-full opacity-70' : ''}`}
                                              title={ballDetail.type === 'foul' ? `${ballDef.name} (Fouled)` : `${ballDef.name} (${ballDef.value} pts)`}
                                            >
                                              <ballDef.IconComponent className="w-full h-full" />
                                              {ballDetail.type === 'foul' && (
                                                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-background">F</span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-3">
                                    {BALL_DEFINITIONS.map(ball => (
                                      <Button
                                        key={ball.value}
                                        variant="outline"
                                        className="h-auto p-0.5 sm:p-1 flex items-center justify-center aspect-square shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary"
                                        disabled={!selectedTeamId || !currentPlayer || selectedTeam?.players.length === 0}
                                        aria-label={`Record ${ball.value} points`}
                                        data-ai-hint={`${ball.name} ball`}
                                        onMouseDown={(e) => handlePointerDown(ball, e)}
                                        onMouseUp={(e) => handlePointerUp(ball, e)}
                                        onMouseLeave={handlePointerLeave}
                                        onTouchStart={(e) => handlePointerDown(ball, e)}
                                        onTouchEnd={(e) => handlePointerUp(ball, e)}
                                        onContextMenu={(e) => e.preventDefault()}
                                      >
                                        <ball.IconComponent className="w-3/5 h-3/5" />
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                          {team.players.length === 0 && <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground italic p-1.5">No players in this team.</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-md animate-fade-in-up"> 
              <CardHeader className="p-2.5 sm:p-3">
                <CardTitle className="flex items-center text-2xl sm:text-3xl md:text-4xl"><History className="mr-1.5 h-8 w-8 sm:h-9 md:h-10 text-primary" />Match History</CardTitle>
                
              </CardHeader>
              <CardContent className="p-2.5 sm:p-3 pt-0">
                {matchHistory.length === 0 ? (
                  <p className="text-muted-foreground text-lg sm:text-xl text-center py-3.5">No turns recorded yet.</p>
                ) : (
                  <div className="w-full">
                    <ul className="space-y-3 sm:space-y-3.5">
                      {matchHistory.map(turn => (
                        <li key={turn.id} className="text-base sm:text-lg p-2.5 sm:p-3 rounded-md border border-border/50 bg-card/80 shadow-sm animate-fade-in">
                          <div className="flex justify-between items-start mb-1.5">
                            <div>
                              <p className="font-semibold text-primary text-lg sm:text-xl md:text-2xl">{turn.playerName}</p>
                              <p className="text-base sm:text-lg text-muted-foreground">{turn.teamName}</p>
                            </div>
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                              <AnimatedScore targetValue={turn.pointsScoredThisTurn} /> pts
                            </span>
                          </div>
                          {turn.ballsPottedThisTurn.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {turn.ballsPottedThisTurn.map((ballDetail, index) => {
                                  const ballDef = BALL_DEFINITIONS.find(b => b.value === ballDetail.ballValue);
                                  if (!ballDef || !ballDef.IconComponent) return null;
                                  return (
                                    <div
                                      key={index}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 relative p-0.5 ${ballDetail.type === 'foul' ? 'ring-1 ring-destructive ring-offset-1 ring-offset-secondary/10 rounded-full' : ''}`}
                                      title={ballDetail.type === 'foul' ? `${ballDetail.ballName} (Fouled)` : `${ballDetail.ballName} (${ballDetail.ballValue} pts)`}
                                    >
                                      <ballDef.IconComponent className="w-full h-full" />
                                      {ballDetail.type === 'foul' && (
                                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">F</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                           {turn.ballsPottedThisTurn.length === 0 && ( 
                            <p className="text-base sm:text-lg italic text-muted-foreground">No balls potted or fouled this turn.</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
         {Array.isArray(teams) && teams.length === 0 && (
              <p className="text-muted-foreground text-center py-3 text-xl sm:text-2xl md:text-3xl">No teams created yet. Go to "Manage Teams & Players" to add teams.</p>
        )}
      </main>
    </div>
  );
}
    

    

















