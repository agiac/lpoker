const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});

socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
