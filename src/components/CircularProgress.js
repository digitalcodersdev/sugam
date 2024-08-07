import React from 'react';
import {Svg, Circle, Text} from 'react-native-svg';

const CircularProgress = ({
  percentage,
  fillColor = 'blue',
  backgroundColor = 'gray',
  textColor = 'black',
}) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <Svg height="80" width="80" viewBox="0 0 120 120">
      <Circle
        cx="60"
        cy="60"
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx="60"
        cy="60"
        r={radius}
        stroke={fillColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
      <Text
        x="60"
        y="60"
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fill={textColor}>
        {`${percentage}%`}
      </Text>
    </Svg>
  );
};

export default CircularProgress;
