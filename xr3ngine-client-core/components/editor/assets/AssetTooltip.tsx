import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * [TooltipContainer used as container tooltip]
 * @type {styled component}
 */
const TooltipContainer = (styled as any).div`
  display: flex;
  width: 600px;
  padding: 12px 0;
`;

/**
 * [TooltipThumbnailContainer used to show thumbnail]
 * @type {Styled Component}
 */
const TooltipThumbnailContainer = (styled as any).div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
`;

/**
 * [TooltipContent used to provide styles for tool tip]
 * @type {Styled component}
 */
const TooltipContent = (styled as any).div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
  div {
    margin-top: 8px;
  }
`;

/**
 * [AssetTooltip used to show tooltip on elements available in asset penal]
 * @param       {[type]} item
 * @constructor
 */
export default function AssetTooltip({ item }) {
  let thumbnail;

  // check if item contains thumbnailUrl then initializing thumbnail
  // else creating thumbnail if there is videoUrl
  // then check if item contains iconComponent then initializing using IconComponent
  //else initialize thumbnail using src from item object
  if (item.thumbnailUrl) {
    thumbnail = <img src={item.thumbnailUrl} />;
  } else if (item.videoUrl) {
    thumbnail = <video src={item.videoUrl} autoPlay muted />;
  } else if (item.iconComponent) {
    const IconComponent = item.iconComponent;
    thumbnail = <IconComponent size={100} />;
  } else {
    thumbnail = <img src={item.src} />;
  }

  //creating tooltip view
  return (
    <TooltipContainer>
      <TooltipThumbnailContainer>{thumbnail}</TooltipThumbnailContainer>
      <TooltipContent>
        <b>{item.label}</b>
        {item.attributions && item.attributions.creator && <div>by {item.attributions.creator.name}</div>}
        {item.description && <div>{item.description}</div>}
      </TooltipContent>
    </TooltipContainer>
  );
}

AssetTooltip.propTypes = {
  item: PropTypes.object
};
