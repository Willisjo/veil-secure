import React from 'react';
import Svg, { Path, Circle, G, LinearGradient, Stop, Defs } from 'react-native-svg';

/**
 * Veil VPN Logo component
 * A stylish shield-based logo with the requested color scheme
 */
const VeilVPNLogo = ({ width = 100, height = 100 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#e74c3c" />
          <Stop offset="1" stopColor="#c0392b" />
        </LinearGradient>
        <LinearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3498db" />
          <Stop offset="1" stopColor="#2c3e50" />
        </LinearGradient>
      </Defs>
      
      {/* Shield Background */}
      <Path
        d="M50,5 L90,20 C90,50 85,75 50,95 C15,75 10,50 10,20 L50,5 Z"
        fill="url(#blueGradient)"
        stroke="#34495e"
        strokeWidth="2"
      />
      
      {/* Inner Shield */}
      <Path
        d="M50,15 L80,26 C80,50 75,70 50,85 C25,70 20,50 20,26 L50,15 Z"
        fill="#2c3e50"
        stroke="#596275"
        strokeWidth="1"
      />
      
      {/* Lock Circle */}
      <Circle cx="50" cy="48" r="22" fill="#34495e" stroke="#596275" strokeWidth="1" />
      
      {/* V Shape (representing both "V" in Veil and a shield) */}
      <Path
        d="M37,35 L50,65 L63,35"
        stroke="url(#primaryGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Horizontal Line through the V */}
      <Path
        d="M35,50 L65,50"
        stroke="#ecf0f1"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Network Lines around the shield */}
      <G opacity="0.5">
        <Path d="M25,32 L15,28" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
        <Path d="M25,40 L12,40" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
        <Path d="M25,48 L10,52" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
        <Path d="M75,32 L85,28" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
        <Path d="M75,40 L88,40" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
        <Path d="M75,48 L90,52" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="round" />
      </G>
    </Svg>
  );
};

export default VeilVPNLogo;
