import { ReactNode } from "react";

export interface FeatureAndImageComponentType {
  shadowPosition: string;
  shadowHeight: string;
  flexDirection: string;
  imagePosition: string;
  title: string;
  description: string;
  imgSrc: string;
  isButton: boolean;
}

export interface NewFeatureAndImageComponentDataTypes {
  children: ReactNode;
  className?: string;
  renderItemInLeft: string;
}
