declare module "react-rating-stars-component" {
  import { ComponentType, ReactNode } from "react";

  interface ReactStarsProps {
    count: number; //The number of stars to display
    value?: number; // The current rating value
    size?: number; // The size of each star
    isHalf?: boolean; //if true, allows half stars ratings
    edit?: boolean; // if false, the ratings is readonly
    activeColor?: string; //The color of the active
    color?: string; // The color of the inactive stars
    emptyIcon?: ReactNode; // Custom icon for empty star
    halfIcon?: ReactNode; // Custom icon for half star
    filledIcon?: ReactNode; // Custom icon for filled star
    onChange?: (newValue: number) => void; //Function trigger
    className?: string;
  }
  const ReactStars: ComponentType<ReactStarsProps>;
  export default ReactStars;
}
