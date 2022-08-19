import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("vote", (client, data) => {
      console.log(
        "StateHandlerRoom received message from",
        client.sessionId,
        ":",
        data
      );
      this.state.changeVote(client.sessionId, data.vote);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.createPlayer(client.sessionId);
    if (this.state.numberOfPlayers === 1) {
      this.clock.setTimeout(() => {
        if (
          this.state.oneTrues >
          this.state.numberOfPlayers - this.state.oneTrues
        ) {
          this.broadcast("two");
        } else if (
          this.state.oneTrues ===
          this.state.numberOfPlayers - this.state.oneTrues
        ) {
          this.broadcast("draw");
        } else {
          this.broadcast("one");
        }
      }, 30000);

      this.state.gameTimer = Math.floor(Date.now() / 1000);
    }
    client.send("startMatch", "yo can start the match");

    this.clock.setTimeout(() => {
      if (this.state.players.get(client.sessionId).vote === undefined) {
        client.send("remake", "remake the match");
        client.leave(1000);
      }
    }, 5000);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
