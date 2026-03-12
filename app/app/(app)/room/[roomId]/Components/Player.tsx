import YouTube, { YouTubeProps } from 'react-youtube';

type Props = {
  videoId: string;
  onNextStream: () => void;
}

const Player = ({videoId, onNextStream}: Props) => {
  



  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <YouTube onEnd={onNextStream} className="w-full h-full" videoId={videoId} opts={opts} />
  )
}

export default Player