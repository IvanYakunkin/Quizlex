import { CardFlipperProps, CardFlipperStyle } from '@/types/CardFlipperProps';
import { useState, useMemo } from 'react';

export const CardFlipper: React.FC<CardFlipperProps> = (props) => {
  const {
    cardStyles: {
      back,
      front,
    },
    cardZIndex,
    containerStyle,
    containerClassName,
    flipDirection,
    flipSpeedFrontToBack,
    flipSpeedBackToFront,
    infinite,
    isFlipped,
  } = {
    cardStyles: {
      back: {},
      front: {},
    },
    cardZIndex: 'auto',
    containerStyle: {},
    flipDirection: 'horizontal',
    flipSpeedBackToFront: 0.6,
    flipSpeedFrontToBack: 0.6,
    infinite: false,
    isFlipped: false,
    ...props
  }

  const [rotation, setRotation] = useState(0);
  const [lastProp, setLastProp] = useState(isFlipped);

  if (isFlipped !== lastProp) {
    setLastProp(isFlipped);
    setRotation((r) => r + 180);
  }

  const getContainerClassName = useMemo(() => {
    let className = 'react-card-flip';
    if (containerClassName) {
      className += ` ${containerClassName}`;
    }
    return className;
  }, [containerClassName]);

  const getComponent = (key: 0 | 1) => {
    if (props.children.length !== 2) {
      throw new Error(
        'Component ReactCardFlip requires 2 children to function',
      );
    }
    return props.children[key];
  };

  const frontRotateY = `rotateY(${infinite ? rotation : isFlipped ? 180 : 0
    }deg)`;
  const backRotateY = `rotateY(${infinite ? rotation + 180 : isFlipped ? 0 : -180
    }deg)`;
  const frontRotateX = `rotateX(${infinite ? rotation : isFlipped ? 180 : 0
    }deg)`;
  const backRotateX = `rotateX(${infinite ? rotation + 180 : isFlipped ? 0 : -180
    }deg)`;

  const styles: CardFlipperStyle = {
    back: {
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      height: '100%',
      left: '0',
      position: isFlipped ? 'relative' : 'absolute',
      top: '0',
      transform: flipDirection === 'horizontal' ? backRotateY : backRotateX,
      transformStyle: 'preserve-3d',
      transition: `${flipSpeedFrontToBack}s`,
      width: '100%',
      zIndex: isFlipped ? '2' : '1',
      ...back,
    },
    container: {
      zIndex: `${cardZIndex}`,
    },
    flipper: {
      height: '100%',
      perspective: '1000px',
      position: 'relative',
      width: '100%',
    },
    front: {
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      height: '100%',
      left: '0',
      position: isFlipped ? 'absolute' : 'relative',
      top: '0',
      transform: flipDirection === 'horizontal' ? frontRotateY : frontRotateX,
      transformStyle: 'preserve-3d',
      transition: `${flipSpeedBackToFront}s`,
      width: '100%',
      zIndex: '2',
      ...front,
    },
  };

  return (
    <div
      className={getContainerClassName}
      style={{ ...styles.container, ...containerStyle }}
    >
      <div className="react-card-flipper" style={styles.flipper}>
        <div className="react-card-front" style={styles.front}>
          {getComponent(0)}
        </div>

        <div className="react-card-back" style={styles.back}>
          {getComponent(1)}
        </div>
      </div>
    </div>
  );
};