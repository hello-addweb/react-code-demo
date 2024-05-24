export interface PriceCardType {
  priceCardData: {
    cardImage: string;
    cardTitle: string;
    cardDetailsList: string[] | string;
    cardPriceTag: string;
  };
  isButton: boolean;
  className?: string;
}
