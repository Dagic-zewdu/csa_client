import socketIOClient from "socket.io-client";
import { server } from "./components/config/config";

export const webSocket = socketIOClient(server,{
    reconnectionDelayMax: 10000
  }) 