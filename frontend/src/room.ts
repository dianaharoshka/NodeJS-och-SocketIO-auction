import { Socket, io } from "socket.io-client";

// // SMARTASTE ROOMHANTERINGEN
const currentRoom = new URLSearchParams(document.location.search).get("room");
//io skapar en socket som kopplar upp sig mot servern
const socket: Socket = io("http://localhost:3000", {
  query: {
    roomName: currentRoom,
  },
});

const auctionName = document.getElementById("auctionName");

if (currentRoom) {
  fetch(`http://localhost:3000/api/auctions/${currentRoom}`)
    .then((response) => response.json())
    .then((data) => {
      if (auctionName) {
        auctionName.textContent = data.name;
      }
    })
    .catch((error) => console.error("Error fetching auction data:", error));
  console.log(currentRoom);
}

socket.on("newBid", (d) => {
  console.log("newBid:", d.name, d.bid);
  let highestBidder = document.getElementById(
    "highestBidder"
  ) as HTMLInputElement;
  let currentBid = document.getElementById("currentBid") as HTMLInputElement;
  highestBidder.innerText = d.name;
  currentBid.innerText = d.bid;
});

const btnPlacebid = document.getElementById("btnPlacebid") as HTMLButtonElement;
btnPlacebid.addEventListener("click", () => {
  console.log("place bid");
  // SOCKET.EMIT skicka till server
  // tar två parametrar, namn på meddelandet och data
  // VI HITTAR PÅ NAMNET placeBid
  //det viktiga är att servern hanterar meddelande med samma namn
  let bidderName = document.getElementById("bidderName") as HTMLInputElement;
  let bidAmount = document.getElementById("bidAmount") as HTMLInputElement;

  let o = { name: bidderName.value, bid: bidAmount.value };
  socket.emit("placeBid", o);
});

socket.on("fel", (feltext) => {
  alert(feltext);
});
