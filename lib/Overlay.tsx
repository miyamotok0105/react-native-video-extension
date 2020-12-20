import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useVideoCtx } from './ScreenContainer';
import { useOpacity } from './animation';

export type OverlayProps = {};

const Overlay = ({ children }: React.PropsWithChildren<OverlayProps>) => {
  const [forced, forceUpdate] = useState({});
  const { consoleHidden, setConsoleHidden, paused } = useVideoCtx();
  const opacityAnim = useOpacity(consoleHidden);
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!consoleHidden && !paused) {
      id = setTimeout(
        () => setConsoleHidden((bool) => (!bool ? true : bool)),
        3000,
      );
    }
    return () => clearTimeout(id);
  }, [consoleHidden, paused]);
  return (
    <Animated.View
      onStartShouldSetResponder={(event) => {
        return event.nativeEvent.touches.length <= 1;
      }}
      onResponderRelease={() => {
        setConsoleHidden((bool) => !bool);
      }}
      pointerEvents={consoleHidden ? 'box-only' : 'auto'}
      style={StyleSheet.flatten([styles.overlay, { opacity: opacityAnim }])}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
});

export default Overlay;
