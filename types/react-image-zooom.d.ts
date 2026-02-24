declare module "react-image-zooom" {
  import { FC } from "react";

  interface ImageZoomProps {
    className: string;
    id?: string;
    src: string;
    zoom?: number;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }

  //Declare the component and its props
  const ImageZoom: FC<ImageZoomProps>;

  export default ImageZoom;
}
