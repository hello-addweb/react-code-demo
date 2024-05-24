import { SetStateAction } from "react";

interface ModelDataType {
  innerLink: string;
  innerValues: any[];
}

export const getNewClassName = (str: string) => {
  const classesOldArray: Record<string, string | undefined> = str
    .split(/\s(?![^\[]*\])/)
    .reduce((acc, curr) => {
      const split = curr.split("-");
      if (split.length === 2) {
        const [key, value] = split;
        acc[key] = value;
      } else {
        acc[curr] = undefined;
      }
      return acc;
    }, {} as Record<string, string | undefined>);

  const classString = Object.entries(classesOldArray)
    .map(([key, value]) => {
      if (value) {
        return `${key}-${value}`;
      } else {
        return key;
      }
    })
    .join(" ");

  return classString;
};

export const handleCardExpand = (
  cardId: string,
  expandedCardId: string | null,
  setExpandedCardId: any
) => {
  setExpandedCardId(cardId === expandedCardId ? null : cardId);
};

export const handleLinkMouseEnter = (
  data: ModelDataType[],
  setModelData: {
    (value: SetStateAction<ModelDataType[]>): void;
    (arg0: ModelDataType[]): void;
  },
  setShowHoverModel: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) => {
  setModelData(data);
  if (data.length > 0) {
    setShowHoverModel(true);
  } else {
    setShowHoverModel(false);
  }
};

export function getThemeColor(theme: string) {
  if (theme !== undefined) {
    switch (theme.toLowerCase()) {
      case "dark":
        return {
          bgColor: "#0d2244",
          textColor: "#ffffff",
          titleColor: "#009bba",
          btnColor: "#ffffff",
        };
      case "blue":
        return {
          bgColor: "#007bff",
          textColor: "#ffffff",
          titleColor: "#ffffff",
          btnColor: "#ffffff",
        };
      case "green":
        return {
          bgColor: "#28a745",
          textColor: "#ffffff",
          titleColor: "#ffffff",
          btnColor: "#ffffff",
        };
      case "red":
        return {
          bgColor: "#ff3300",
          textColor: "#ffffff",
          titleColor: "#ffffff",
          btnColor: "#ffffff",
        };
      case "light":
        return {
          bgColor: "#ffffff",
          textColor: "#111111",
          titleColor: "#009bba",
          btnColor: "#f58220",
        };
      default:
        return {
          bgColor: "#f8f9fa",
          textColor: "#111111",
          titleColor: "#009bba",
          btnColor: "#f58220",
        };
    }
  } else {
    return;
  }
}

export const setShadowPosition = (alignment: string) => {
  switch (alignment) {
    case "left":
      return "top-[36%] left-[30%]";
    case "right":
      return "top-[36%] right-[30%]";
    default:
      return "top-[36%] left-[30%]";
  }
};

export const setShadowDimension = (dimension: string) => {
  switch (dimension) {
    case "small":
      return { width: "100%", height: "283px" };
    case "medium":
      return { width: "100%", height: "310px" };
    case "large":
      return { width: "100%", height: "376px" };
    default:
      return { width: "100%", height: "283px" };
  }
};

export const setImagePosition = (position: string) => {
  switch (position) {
    case "left":
      return "justify-start";
    case "right":
      return "justify-end";
    default:
      return "justify-start";
  }
};

export const openFAQCardHandler = (
  data: string,
  questionID: string,
  isCardExpanded: any,
  setIsCardExpanded: any
) => {
  const isAvailableIndex = isCardExpanded.findIndex(
    (item: { id: string }) => item.id === questionID
  );

  if (isAvailableIndex === -1) {
    setIsCardExpanded([
      ...isCardExpanded,
      { id: questionID, htmlContent: data },
    ]);
  } else {
    const filteredDataSet = isCardExpanded.filter(
      (item: { id: string }) => item.id !== questionID
    );
    setIsCardExpanded(filteredDataSet);
  }
};
