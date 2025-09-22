"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the props the component will accept
interface FuturisticRobotProps {
  hatType?: 'civil' | 'tech' | 'safety' | 'none';
  initialPose?: boolean; // Set to false if you don't want the initial animation
}

// A sub-component just for the different hat styles
const Hat: React.FC<{ type: string }> = ({ type }) => {
    let hatPath, hatColor;
    switch (type) {
        case 'civil':
            hatPath = "M 170 80 Q 200 60 230 80 L 240 90 L 160 90 Z";
            hatColor = "#FBBF24"; // Yellow
            break;
        case 'tech':
            hatPath = "M 180 85 h 40 v -10 a 20 20 0 0 0 -40 0 z";
            hatColor = "#3B82F6"; // Blue
            break;
        case 'safety':
            hatPath = "M 175 85 C 175 70, 225 70, 225 85 H 175 Z";
            hatColor = "#22C55E"; // Green
            break;
        default:
            hatPath = "";
            hatColor = "transparent";
    }
    return (
        <motion.path
            d={hatPath}
            fill={hatColor}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        />
    );
};

export default function FuturisticRobot({ hatType = 'none', initialPose = true }: FuturisticRobotProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [eyeOffset, setEyeOffset] = useState([0, 0]);
    const [eyebrowAngle, setEyebrowAngle] = useState(0);

    // Eye blinking animation
    useEffect(() => {
        const blinkTimer = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150); // Blink duration
        }, Math.random() * 4000 + 3000); // Blink every 3-7 seconds
        return () => clearInterval(blinkTimer);
    }, []);

    // Eye looking around animation
    useEffect(() => {
        const lookTimer = setInterval(() => {
            setEyeOffset([Math.random() * 4 - 2, Math.random() * 4 - 2]);
        }, Math.random() * 5000 + 4000);
        return () => clearInterval(lookTimer);
    }, []);

    // Eyebrow shifting animation
    useEffect(() => {
        const eyebrowTimer = setInterval(() => {
            setEyebrowAngle(Math.random() * 10 - 5);
        }, Math.random() * 7000 + 5000);
        return () => clearInterval(eyebrowTimer);
    }, []);

    return (
        <motion.div 
            className="relative w-full max-w-lg mx-auto cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: initialPose ? 0 : 1, y: initialPose ? 50 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className="absolute inset-0 bg-red-500/80 -z-10 rounded-full"
                style={{ filter: 'blur(40px)' }}
                animate={{ opacity: isHovered ? 0.7 : 0 }}
                transition={{ duration: 0.4 }}
            />

            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* Body and Head */}
                <path d="M 200,320 C 150,320 120,280 120,230 L 120,180 L 280,180 L 280,230 C 280,280 250,320 200,320 Z" fill="#E5E7EB" />
                <path d="M 160,180 L 240,180 L 240,170 L 160,170 Z" fill="#9CA3AF" />
                <circle cx="200" cy="120" r="60" fill="#F3F4F6" />
                <circle cx="200" cy="120" r="55" fill="#FFFFFF" />

                {/* Eyebrows */}
                <motion.path d="M 170 105 L 190 105" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ y: eyebrowAngle, rotate: -eyebrowAngle/2 }} />
                <motion.path d="M 210 105 L 230 105" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ y: eyebrowAngle, rotate: eyebrowAngle/2 }} />

                {/* Eyes - Red and Blinking */}
                <motion.g animate={{ x: eyeOffset[0], y: eyeOffset[1] }}>
                    <circle cx="180" cy="120" r="10" fill="#dc2626" />
                    <motion.rect x="170" y="118" width="20" height="4" fill="#FFFFFF" initial={{ scaleY: 1 }} animate={{ scaleY: isBlinking ? 0 : 1 }} transition={{ duration: 0.05 }} />
                </motion.g>
                <motion.g animate={{ x: eyeOffset[0], y: eyeOffset[1] }}>
                    <circle cx="220" cy="120" r="10" fill="#dc2626" />
                    <motion.rect x="210" y="118" width="20" height="4" fill="#FFFFFF" initial={{ scaleY: 1 }} animate={{ scaleY: isBlinking ? 0 : 1 }} transition={{ duration: 0.05 }} />
                </motion.g>
                
                {/* Mouth - Smiles on Hover */}
                <motion.path 
                    d="M 190 140 Q 200 150 210 140" 
                    stroke="#9CA3AF" strokeWidth="2" fill="none" 
                    animate={{ d: isHovered ? "M 190 145 Q 200 155 210 145" : "M 190 140 Q 200 150 210 140" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                
                {/* Hat - changes based on props */}
                <AnimatePresence mode="wait">
                    <Hat key={hatType} type={hatType || 'none'} />
                </AnimatePresence>
            </svg>
        </motion.div>
    );
}