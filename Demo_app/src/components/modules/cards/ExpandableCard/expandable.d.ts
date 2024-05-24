export interface ExpandableCardProps {
  moreInfoData: {
    cardId: string;
    imgSrc: string;
    title: string;
    description: string;
  };
  isExpanded: boolean;
  onCardExpand: () => void;
  theme?: string;
}
