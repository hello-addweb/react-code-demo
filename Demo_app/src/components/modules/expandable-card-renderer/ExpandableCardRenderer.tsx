import Box from "@/components/elements/Box/Box";
import React, { useState } from "react";
import ExpandableCard from "../cards/ExpandableCard/ExpandableCard";
import { handleCardExpand } from "@/utils/helpers";

interface ExpandableCardRendererDataType {
  cardDataSet: {
    cardId: string;
    imgSrc: string;
    title: string;
    description: string;
  }[];
  theme?: string;
}

const ExpandableCardRenderer = ({
  cardDataSet,
  theme,
}: ExpandableCardRendererDataType) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  return (
    <Box
      elementType="div"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full"
    >
      {cardDataSet.map((item, index) => {
        return (
          <ExpandableCard
            key={index}
            moreInfoData={item}
            isExpanded={expandedCardId === item.cardId}
            onCardExpand={() =>
              handleCardExpand(item.cardId, expandedCardId, setExpandedCardId)
            }
            theme={theme}
          />
        );
      })}
    </Box>
  );
};

export default ExpandableCardRenderer;
