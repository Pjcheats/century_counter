
// Client-side component for managing teams and players.
// This comment is added to try and resolve a potential subtle parsing issue.
"use client";

import React from 'react';
import Link from 'next/link';
import { useBallCount } from '@/context/BallCountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Trash2, Pencil, Check, X, ArrowLeft, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageTeamsClientPage() {
  const {
    teams,
    editingTeamId,
    setEditingTeamId,
    editingTeamNameInput,
    setEditingTeamNameInput,
    editingPlayerDetails,
    setEditingPlayerDetails,
    editingPlayerNameInput,
    setEditingPlayerNameInput,
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
    handleClearAllScores,
  } = useBallCount();

  const teamEditInputRef = React.useRef<HTMLInputElement>(null);
  const playerEditInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editingTeamId && teamEditInputRef.current) {
        teamEditInputRef.current.focus();
    }
  }, [editingTeamId]);

  React.useEffect(() => {
    if (editingPlayerDetails && playerEditInputRef.current) {
        playerEditInputRef.current.focus();
    }
  }, [editingPlayerDetails]);

  if (!teams) { // Handle null state for teams during initial context load
    return (
      <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center justify-center font-sans animate-fade-in-up">
        <p className="text-muted-foreground text-center py-3 text-xl sm:text-2xl md:text-3xl">Loading team data...</p>
      </div>
    );
  }
  
  if (teams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center justify-center font-sans animate-fade-in-up">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
                    Manage Teams
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-xl mb-4">No teams created yet. Add a team to get started!</p>
                <Button variant="default" size="lg" onClick={() => handleAddTeam()} className="text-xl sm:text-2xl h-12 sm:h-14">
                    <Users className="mr-2 h-6 w-6 sm:h-7 sm:h-8" /> Add New Team
                </Button>
                <Link href="/" passHref className="mt-4 block">
                    <Button variant="outline" size="lg" className="text-xl sm:text-2xl h-12 sm:h-14">
                        <ArrowLeft className="mr-2 h-6 w-6 sm:h-7 sm:h-8" /> Back to Scoreboard
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-3 sm:p-4 md:p-5 items-center font-sans">
      <header className="mb-4 sm:mb-6 text-center w-full max-w-xl lg:max-w-2xl animate-fade-in-up">
        <div className="flex items-center justify-between">
            <Link href="/" passHref>
                <Button variant="outline" size="icon" className="mr-auto h-12 w-12 sm:h-14 sm:w-14">
                    <ArrowLeft className="h-8 w-8 sm:h-9 sm:w-9" />
                </Button>
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight flex-grow text-center">
                Manage Teams
            </h1>
            <div className="w-12 h-12 sm:w-14 sm:w-14"></div> {/* Spacer to balance the back button */}
        </div>
      </header>

      <main className="w-full max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5 animate-fade-in-up">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="flex items-center text-3xl sm:text-4xl">Teams & Players</CardTitle>
            <CardDescription className="text-lg sm:text-xl mt-1">Edit names, add/remove players, or remove teams.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">

            <div className="space-y-4 sm:space-y-5">
            {teams.map(team => (
                <div key={team.id} className="p-3.5 sm:p-4 rounded-lg border border-border bg-card shadow animate-fade-in">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    {editingTeamId === team.id ? (
                    <div className="flex-grow flex items-center gap-2.5 sm:gap-3">
                        <Input
                        ref={teamEditInputRef}
                        type="text"
                        value={editingTeamNameInput}
                        onChange={(e) => setEditingTeamNameInput(e.target.value)}
                        className="text-3xl sm:text-4xl h-14 sm:h-16 flex-grow"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTeamName(team.id); if (e.key === 'Escape') handleCancelEditTeamName(); }}
                        aria-label={`Edit name for ${team.name}`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleSaveTeamName(team.id)} className="h-10 w-10 sm:h-12 sm:w-12"><Check className="h-7 w-7 sm:h-8 text-green-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEditTeamName} className="h-10 w-10 sm:h-12 sm:w-12"><X className="h-7 w-7 sm:h-8 text-muted-foreground" /></Button>
                    </div>
                    ) : (
                    <CardTitle className="text-3xl sm:text-4xl font-semibold flex-grow truncate" title={team.name}>{team.name}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 ml-2.5 sm:ml-3 flex-shrink-0">
                    {editingTeamId !== team.id && (
                        <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12" onClick={() => handleStartEditTeamName(team)} aria-label={`Edit name for ${team.name}`}><Pencil className="h-7 w-7 sm:h-8 text-primary" /></Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12" onClick={() => handleRemoveTeam(team.id)} aria-label={`Remove ${team.name}`}><Trash2 className="h-7 w-7 sm:h-8 text-destructive" /></Button>
                    </div>
                </div>

                <div className="space-y-3 sm:space-y-3.5 pl-3 sm:pl-3.5 md:pl-4 border-l-2 border-primary/30">
                    {team.players.map(player => (
                    <div
                        key={player.id}
                        className={`p-3 sm:p-3.5 rounded-md bg-muted border border-border/70 animate-fade-in`}
                    >
                        <div className="flex items-center justify-between">
                        {editingPlayerDetails?.teamId === team.id && editingPlayerDetails?.playerId === player.id ? (
                            <div className="flex-grow flex items-center gap-2 sm:gap-2.5">
                            <Input
                                ref={playerEditInputRef}
                                type="text"
                                value={editingPlayerNameInput}
                                onChange={(e) => setEditingPlayerNameInput(e.target.value)}
                                className="text-xl sm:text-2xl h-11 sm:h-12 flex-grow"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSavePlayerName(team.id, player.id); if (e.key === 'Escape') handleCancelEditPlayerName(); }}
                                aria-label={`Edit name for player ${player.name}`}
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleSavePlayerName(team.id, player.id)} className="h-9 w-9 sm:h-10 sm:w-10"><Check className="h-6 w-6 sm:h-7 text-green-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={handleCancelEditPlayerName} className="h-9 w-9 sm:h-10 sm:w-10"><X className="h-6 w-6 sm:h-7 text-muted-foreground" /></Button>
                            </div>
                        ) : (
                           <div className="flex-grow">
                                <span className="text-xl sm:text-2xl font-semibold truncate" title={player.name}>{player.name}</span>
                           </div>
                        )}
                        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                            {!(editingPlayerDetails?.teamId === team.id && editingPlayerDetails?.playerId === player.id) && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => handleStartEditPlayerName(team.id, player)} aria-label={`Edit name for player ${player.name}`}>
                                <Pencil className="h-6 w-6 sm:h-7 text-primary/80" />
                            </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => handleRemovePlayer(team.id, player.id)} aria-label={`Remove player ${player.name}`}>
                            <Trash2 className="h-6 w-6 sm:h-7 text-destructive/80" />
                            </Button>
                        </div>
                        </div>
                    </div>
                    ))}
                    {team.players.length === 0 && <p className="text-lg sm:text-xl text-muted-foreground italic p-2">No players in this team yet.</p>}
                    <Button variant="outline" size="default" onClick={() => handleAddPlayer(team.id)} className="mt-3 text-lg sm:text-xl h-11 sm:h-12">
                    <UserPlus className="mr-2 h-7 w-7 sm:h-8" />
                    <span className="sm:hidden">Add Player</span>
                    <span className="hidden sm:inline">Add Player to {team.name}</span>
                    </Button>
                </div>
                </div>
            ))}
            </div>
            <Button variant="default" size="lg" onClick={() => handleAddTeam()} className="mt-5 w-full text-xl sm:text-2xl h-12 sm:h-14">
                <Users className="mr-2 h-7 w-7 sm:h-8" /> Add New Team
            </Button>

            <div className="mt-8 pt-6 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="w-full text-xl sm:text-2xl h-12 sm:h-14">
                    <Trash className="mr-2 h-7 w-7 sm:h-8" /> Clear All Scores
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently reset all player scores,
                      potted ball frequencies, and clear the entire match history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllScores}>
                      Yes, clear all scores
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
               <p className="text-sm text-muted-foreground mt-2 text-center">
                Clearing scores will reset the game for all teams and players.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
    

    







