import * as signalR from "@microsoft/signalr";


class SignalRService {
 private connection: signalR.HubConnection;


 constructor() {
   this.connection = new signalR.HubConnectionBuilder()
     .withUrl("http://localhost:8112/webui/progressHub")
     .withAutomaticReconnect()
     .configureLogging(signalR.LogLevel.Information)
     .build();
 }


 async startConnection() {
   try {
     await this.connection.start();
     console.log("Connected to SignalR");
   } catch (err) {
     console.error("Error connecting to SignalR:", err);
     setTimeout(() => this.startConnection(), 5000); // Retry on failure
   }
 }


 listenForProgressUpdates(callback: (jobId: string, progress: string) => void) {
   this.connection.on("ReceiveProgressUpdate", (jobId, progress) => {
     callback(jobId, progress);
   });
 }


 async stopConnection(){
   try{
       await this.connection.stop();
       console.log("Connection Ended");
   }catch(error){
       console.error("Failed to end connection")
       setTimeout(() => this.stopConnection(), 5000);
      
   }
 }
}


export default new SignalRService();





