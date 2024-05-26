import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { Constants } from "./constants";
export class Game {
    private player1: WebSocket;
    private player2: WebSocket;
    private board: Chess;
    private startDateTime: Date;
    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess(); 
        this.startDateTime = new Date();
        this.player1.send(JSON.stringify({
            type:Constants.START_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type:Constants.START_GAME,
            payload:{
                color:"black"
            }
        }))
    }
    
    public get player1Value() : WebSocket {
        return this.player1
    }
    public get player2Value() : WebSocket {
        return this.player2
    }
    
    move(socket: WebSocket,tyep:string, move: {from:string, to:string}) {
        if (this.board.move.length %2 === 0 && socket!== this.player1){
            return;
        }
        if (this.board.move.length %2 !==0 && socket!== this.player2){
            return;
        }

       try{
        this.board.move(move)
       } catch(error){
        socket.on('error', ()=>{
            socket.send(JSON.stringify(error));
        })
       }

       if(this.board.isCheck()){
        socket.send(JSON.stringify(Constants.CHECK));
       }
       if(this.board.isDraw()){
        socket.send(JSON.stringify(Constants.DRAW));
       }
       if(this.board.isCheckmate()){
        socket.send(JSON.stringify(Constants.CHECK_MATE));
       }
       if(this.board.isStalemate()){
        socket.send(JSON.stringify(Constants.STALE_MATE));
       }
       if(this.board.isGameOver()){
        this.player1.emit(JSON.stringify({
            type : Constants.GAME_OVER,
            payload: {
                winner : this.board.turn() === "w" ? "black" :"white"
            }
        }))
        this.player2.emit(JSON.stringify({
            type : Constants.GAME_OVER,
            payload: {
                winner : this.board.turn() === "w" ? "black" :"white"
            }
        }))
        return;
       }
       if (this.board.moves.length % 2=== 0){
        this.player2.emit(JSON.stringify({
            type : Constants.MOVE,
            payload: move
        }))
       }else{
            this.player2.emit(JSON.stringify({
                type : Constants.MOVE,
                payload: move
            }))
       }
       
    }
}