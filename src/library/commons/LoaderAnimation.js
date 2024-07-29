import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Modal} from 'react-native';

const LoaderAnimation = ({loading, message}) => {
  const animValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (loading) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [loading]);

  const startAnimation = () => {
    const animations = animValues.map(anim =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    Animated.parallel(animations).start();
  };

  const stopAnimation = () => {
    animValues.forEach(anim => anim.stopAnimation());
  };

  const interpolations = animValues?.map((anim, index) => ({
    translateX: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, index % 2 === 0 ? 50 : -50],
    }),
    translateY: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, index < 2 ? 50 : -50],
    }),
  }));

  return (
    <Modal transparent={false} visible={loading}>
      <View style={styles.container}>
        <View style={styles.puzzleContainer}>
          {interpolations.map((style, index) => (
            <Animated.View key={index} style={[styles.piece, style]} />
          ))}
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  puzzleContainer: {
    width: 100,
    height: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: '#6200ee',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default LoaderAnimation;
