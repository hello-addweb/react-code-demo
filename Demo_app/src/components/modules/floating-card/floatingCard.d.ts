export interface FloatingCardTypes {
  themeColors: any;
  moreInfoData: {
    cardId: string;
    imgSrc: string;
    title: string;
    description: string;
  };
  onCardExpand: () => void;
  isExpanded: boolean;
  theme: string | undefined;
}
