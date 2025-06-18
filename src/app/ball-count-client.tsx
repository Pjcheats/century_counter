
"use client";

import React from 'react'; // Ensured React is imported
import Link from 'next/link';
import { useBallCount } from '@/context/BallCountContext';
import { BALL_DEFINITIONS } from '@/config/ball-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ExternalLink, PlayCircle, Check } from 'lucide-react';
import AnimatedScore from '@/components/AnimatedScore';

// This file is effectively being renamed to scoreboard-client.tsx
// Keeping the content here to show what would be in scoreboard-client.tsx

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
  } = useBallCount();


  // Component's JSX rendering starts here.
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-5 md:p-6 items-center font-sans">
      <header className="mb-6 sm:mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight">Pjcheat's Century Tracker</h1>
        <p className="text-muted-foreground mt-2 text-lg sm:text-xl md:text-2xl">Track points per player turn.</p>
      </header>

      <main className="w-full max-w-xl lg:max-w-2xl space-y-8 sm:space-y-10">
        {/* Link to Manage Teams Page - could be a more prominent button/nav item */}
        <div className="text-center mb-6">
            <Link href="/manage-teams" passHref>
                <Button variant="outline" size="lg">Manage Teams & Players</Button>
            </Link>
        </div>
        
        {teams.length > 0 && (
          <>
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl">Scoreboard</CardTitle>
                <div className="mt-2.5 space-y-2">
                  {selectedTeam && selectedTeam.players.length === 0 && (
                    <p className="text-center text-destructive p-2.5 bg-destructive/10 border border-destructive/30 rounded-md text-lg sm:text-xl">Selected team has no players. Add players in the 'Manage Teams' section to start scoring.</p>
                  )}
                  {(!selectedTeamId || !currentPlayer || selectedTeam?.players.length === 0) && teams.length > 0 && (
                    <p className="text-center text-muted-foreground p-2.5 text-lg sm:text-xl">Start a player's turn to begin scoring.</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-6">
                  {teams.map(team => {
                    const { totalScore } = calculateTeamTotals(team);
                    return (
                      <div key={team.id} className={`bg-card rounded-lg shadow-md p-3.5 sm:p-4 ${selectedTeamId === team.id ? 'ring-2 ring-primary' : 'border border-border'}`}>
                        <div className="flex flex-row justify-between items-center mb-4">
                          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary truncate" title={team.name}>{team.name}</CardTitle>
                           <Link href={`/manage-teams?teamId=${team.id}`} passHref>
                             <ExternalLink className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
                           </Link>
                        </div>
                         <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4">
                            Overall Team Score: <AnimatedScore targetValue={totalScore} className="inline-block" />
                         </p>
                        <div className="space-y-3">
                          {team.players.map(player => (
                            <React.Fragment key={player.id}>
                              <div
                                className={`p-3 rounded-md flex items-center justify-between ${currentPlayer?.id === player.id && selectedTeamId === team.id ? 'ring-2 ring-accent bg-accent/10' : 'bg-background/50 border border-border/50'}`}
                              >
                                <div>
                                    <p className="text-xl sm:text-2xl font-semibold truncate" title={player.name}>{player.name}</p>
                                    <p className="text-base sm:text-lg text-muted-foreground">
                                    Score: <AnimatedScore targetValue={player.score} className="font-medium text-foreground inline-block" />
                                    </p>
                                </div>
                                {team.players.length > 0 && (
                                  <Button
                                    variant={currentPlayer?.id === player.id && selectedTeamId === team.id ? "default" : "outline"}
                                    size="lg" // Made button larger
                                    className={`ml-auto text-base sm:text-lg h-12 px-6`} // Adjusted padding and height
                                    onClick={() => handleSetCurrentPlayer(team.id, player.id)}
                                    disabled={currentPlayer?.id === player.id && selectedTeamId === team.id}
                                  >
                                    {currentPlayer?.id === player.id && selectedTeamId === team.id ? <Check className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                                    {currentPlayer?.id === player.id && selectedTeamId === team.id ? (
                                      <>
                                        <span className="sm:hidden">Turn</span>
                                        <span className="hidden sm:inline">Current Turn</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="sm:hidden">Start</span>
                                        <span className="hidden sm:inline">Start Turn</span>
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              {selectedTeamId === team.id && currentPlayer?.id === player.id && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
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
                          {team.players.length === 0 && <p className="text-lg text-muted-foreground italic p-2.5">No players in this team.</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="flex items-center text-2xl sm:text-3xl md:text-4xl"><History className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />Match History</CardTitle>
                <CardDescription className="text-lg sm:text-xl mt-2">A log of all scoring turns.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 pt-0">
                {matchHistory.length === 0 ? (
                  <p className="text-muted-foreground text-xl sm:text-2xl text-center py-4">No turns recorded yet.</p>
                ) : (
                  <div className="w-full">
                    <ul className="space-y-3 sm:space-y-3.5">
                      {matchHistory.map(turn => (
                        <li key={turn.id} className="text-base sm:text-lg p-3 sm:p-3.5 rounded-md border-b border-border/30 last:border-b-0">
                          <div className="flex justify-between items-start mb-1.5">
                            <div>
                              <p className="font-semibold text-primary text-lg sm:text-xl">{turn.playerName}</p>
                              <p className="text-sm sm:text-base text-muted-foreground">{turn.teamName}</p>
                            </div>
                            <span className="text-xl font-bold text-foreground">
                              <AnimatedScore targetValue={turn.pointsScoredThisTurn} /> pts
                            </span>
                          </div>
                          {turn.ballsPottedThisTurn.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2">
                                {turn.ballsPottedThisTurn.map((ballDetail, index) => {
                                  const ballDef = BALL_DEFINITIONS.find(b => b.value === ballDetail.ballValue);
                                  if (!ballDef || !ballDef.IconComponent) return null;
                                  return (
                                    <div
                                      key={index}
                                      className={`w-6 h-6 sm:w-7 sm:h-7 relative p-0.5 ${ballDetail.type === 'foul' ? 'ring-1 ring-destructive ring-offset-1 ring-offset-secondary/10 rounded-full' : ''}`}
                                      title={ballDetail.type === 'foul' ? `${ballDetail.ballName} (Fouled)` : `${ballDetail.ballName} (${ballDetail.ballValue} pts)`}
                                    >
                                      <ballDef.IconComponent className="w-full h-full" />
                                      {ballDetail.type === 'foul' && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-background">F</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                           {turn.ballsPottedThisTurn.length === 0 && ( // Display message if no balls potted
                            <p className="text-sm sm:text-base italic text-muted-foreground">No balls potted or fouled this turn.</p>
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
         {teams.length === 0 && (
              <p className="text-muted-foreground text-center py-4 text-xl">No teams created yet. Go to "Manage Teams & Players" to add teams.</p>
        )}
      </main>
    </div>
  );
}
