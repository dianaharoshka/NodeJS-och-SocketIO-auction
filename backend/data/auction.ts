export class Auction {
  constructor(
    public id: string,
    public name: string,
    public minprice: number,
    public highestBidder: string,
    public highestBid: number
  ) {}
}
