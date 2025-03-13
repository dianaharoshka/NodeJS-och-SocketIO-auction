import { Auction } from "./auction";

export let auctions: Array<Auction> = [];

export function Init() {
  auctions.push(new Auction("M-12", "Fin mugg", 0, "", 0));
  auctions.push(new Auction("A-67", "Ngt annat", 0, "", 0));
  auctions.push(new Auction("S-991", "Fotboll", 0, "", 0));
}
