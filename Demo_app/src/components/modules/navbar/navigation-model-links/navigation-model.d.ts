export interface NavigationData {
  innerLink: string;
  innerValues: {
    topic: string;
    subLinks: string[];
  }[];
}

export interface NavigationModelType {
  modelData: NavigationData[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
