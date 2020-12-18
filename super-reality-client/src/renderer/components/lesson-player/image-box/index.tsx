/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ItemImageTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../button-simple";
import "./index.scss";

interface ImageBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  trigger: number | null;
  image: string;
  callback?: (trigger: number) => void;
}

const ImageBox = React.forwardRef<HTMLDivElement, ImageBoxProps>(
  (props, forwardedRef) => {
    const { image, trigger, style, pos, callback } = props;

    return (
      <div
        ref={forwardedRef}
        className="image-box click-on"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <img
          style={{
            maxHeight: trigger ? "calc(100% - 64px)" : "100%",
          }}
          src={image}
        />
        {trigger && (
          <ButtonSimple
            width="200px"
            height="24px"
            margin="auto"
            onClick={
              callback
                ? () => callback(ItemImageTriggers["Click Ok button"])
                : voidFunction
            }
          >
            Ok
          </ButtonSimple>
        )}
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;