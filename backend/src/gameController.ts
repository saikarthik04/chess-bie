import { WebSocket } from "ws";
import { Constants } from "./constants"
import { Game } from "./game";
export class gameController {
    private Game: Game[]
    private waitingUser!: WebSocket;
    private users!: WebSocket[];
    constructor() {
        this.Game = []
    }
    addUsers(currentUser: WebSocket, payload:any) {
        this.users.push(currentUser)
        const message = JSON.stringify({payload})
        this.addToGame(currentUser,message)
    }
    removeFromGame(currentUser: WebSocket) {
        this.users.filter((user: WebSocket) => user !== currentUser)
    }

    private addToGame(user: WebSocket,payload: any) {
        user.on('message', (data) => {
            let message = JSON.parse(data.toString());
            if (message.type === Constants.START_GAME) {
                if (this.waitingUser) {
                    //start game 
                    const game = new Game(this.waitingUser, user);
                    this.Game.push(game)
                } else {
                    this.waitingUser = user
                }
            }
            if (message.type === Constants.MOVE) {
                const game = this.Game.find((game)=> game.player1Value == user || game.player2Value == user)
                if (game){
                    game.move(user,Constants.MOVE,payload.move)
                }
            }
        })
    }
}