
// src/components/AnimatedScore.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedScoreProps {
  targetValue: number;
  totalAnimationDuration?: number;
  className?: string;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({
  targetValue,
  totalAnimationDuration: initialTotalAnimationDuration,
  className,
}) => {
  const [displayScore, setDisplayScore] = useState(targetValue);
  const prevTargetRef = useRef(targetValue); // Stores the targetValue of the previous animation
  const animationTimeoutIdRef = useRef<number | null>(null);

  const totalAnimationDuration = initialTotalAnimationDuration === undefined ? 400 : initialTotalAnimationDuration;

  useEffect(() => {
    const startValue = prevTargetRef.current;

    if (startValue === targetValue) {
      // If target hasn't changed from what prevTargetRef holds,
      // ensure displayScore matches if it somehow got out of sync.
      if (displayScore !== targetValue) {
         setDisplayScore(targetValue);
      }
      return;
    }

    if (animationTimeoutIdRef.current) {
      clearTimeout(animationTimeoutIdRef.current);
    }

    const difference = targetValue - startValue;
    const steps = Math.abs(difference);

    if (steps === 0) { // Should be caught by startValue === targetValue, but defensive
      setDisplayScore(targetValue);
      prevTargetRef.current = targetValue;
      return;
    }
    
    let stepDelay: number;
    if (steps <= 3) {
      stepDelay = 50; // Faster for very small changes (1-3 points)
    } else if (steps <= 7) {
      stepDelay = 40; // Moderately fast for small changes (4-7 points)
    } else {
      const calculatedDelay = totalAnimationDuration / steps;
      stepDelay = Math.max(15, Math.min(calculatedDelay, 60)); // Clamp: 15ms (min) to 60ms (max) per step
    }
    
    let currentAnimatedDisplayValue = startValue;
    // Set displayScore to startValue before animation if it's not already there.
    // This ensures the animation visually starts from the correct point if interrupted.
    if (displayScore !== startValue) {
        setDisplayScore(startValue);
    }

    const animate = () => {
      if (difference > 0) { // Counting up
        currentAnimatedDisplayValue++;
        if (currentAnimatedDisplayValue >= targetValue) {
          currentAnimatedDisplayValue = targetValue;
        }
      } else { // Counting down
        currentAnimatedDisplayValue--;
        if (currentAnimatedDisplayValue <= targetValue) {
          currentAnimatedDisplayValue = targetValue;
        }
      }

      setDisplayScore(currentAnimatedDisplayValue);

      if (currentAnimatedDisplayValue !== targetValue) {
        animationTimeoutIdRef.current = window.setTimeout(animate, stepDelay);
      } else {
        // Animation complete, update prevTargetRef to the new targetValue
        prevTargetRef.current = targetValue; 
      }
    };

    // Start the animation
    animationTimeoutIdRef.current = window.setTimeout(animate, stepDelay);

    return () => {
      if (animationTimeoutIdRef.current) {
        clearTimeout(animationTimeoutIdRef.current);
      }
      // When the effect re-runs due to targetValue changing,
      // set prevTargetRef to the targetValue this effect instance was for.
      // This ensures the next animation starts from this (now previous) target.
      prevTargetRef.current = targetValue; 
    };
  }, [targetValue, totalAnimationDuration]); // Removed displayScore from dependencies

  return <span className={className}>{displayScore}</span>;
};

export default AnimatedScore;
