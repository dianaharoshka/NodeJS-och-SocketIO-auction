import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import * as data from "./data/database";
import cors from "cors";
import { Auction } from "./data/auction";

const app = express();
app.use(cors());
const server = http.createServer(app);
// detta är websocket servern (TELEFONVÄXELN)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Serve static files (frontend)
app.use(express.static("public"));

// Socket.IO connection
io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);
  //SMARTASTE ROOMHANTERINGEN
  var query = socket.handshake.query;
  var roomName = query.roomName as string;
  socket.join(roomName);

  const auction = data.auctions.find(
    (auction: Auction) => auction.id === roomName
  ) as Auction;
  socket.emit("newBid", {
    name: auction.highestBidder,
    bid: auction.highestBid,
  });

  socket.on("placeBid", (d) => {
    const auction = data.auctions.find(
      (auction: Auction) => auction.id === roomName
    ) as Auction;

    console.log("placeBid:", d.name, d.bid);
    if (d.bid > auction?.highestBid && d.bid > auction.minprice) {
      auction.highestBid = d.bid;
      auction.highestBidder = d.name;
      io.to(roomName).emit("newBid", {
        name: auction.highestBidder,
        bid: auction.highestBid,
      });
    } else {
      socket.emit("fel", "För lågt");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// när nån anropar localhost:3000/api/auctions så körs denna
app.get("/api/auctions", (req, res) => {
  res.json(data.auctions);
});

app.get("/api/auctions/:id", (req, res) => {
  res.json(data.auctions.filter((auction) => auction.id === req.params.id)[0]);
});

// Start the server
data.Init();
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
