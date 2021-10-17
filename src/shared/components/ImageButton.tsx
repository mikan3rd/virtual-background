import React from 'react';
import ThumbnailButton from './TumbnailButton';
import useImageThumbnail from '../hooks/useImageThumbnail';

type ImageButtonProps = {
  imageUrl: string;
  active: boolean;
  onClick: () => void;
};

function ImageButton(props: ImageButtonProps) {
  const { imageUrl, active, onClick } = props;

  const [thumbnailUrl, revokeThumbnailUrl] = useImageThumbnail(imageUrl);

  return <ThumbnailButton thumbnailUrl={thumbnailUrl} active={active} onClick={onClick} onLoad={revokeThumbnailUrl} />;
}

export default ImageButton;
