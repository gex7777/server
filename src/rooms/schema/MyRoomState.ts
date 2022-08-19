import { Schema, Context, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") vote: string = "hello";
}
enum GameStage {
  Waiting = "WAITING",
  Start = "START",
  InProgress = "INPROGRESS",
  Finished = "FINISHED",
}
export class MyRoomState extends Schema {
  @type("number") numberOfPlayers: number = 0; // sent to all clients
  @type("string") gameState: GameStage = GameStage.Waiting;
  @type("number") oneTrues: number = 0;
  @type("number") gameTimer: number;
  players = new MapSchema<Player>();
  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
    this.numberOfPlayers += 1;
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);

    this.numberOfPlayers -= 1;
  }
  changeVote(sessionId: string, vote: string) {
    console.log("vote: ", vote);

    this.players.get(sessionId).vote = vote;
    if (vote === "true") {
      this.oneTrues += 1;
    }
  }
}
