import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTezosPrice } from '../utils/api';
import useContract from '../hooks/useContract';
import { Clock, Lock, TimerReset, TrendingUp } from 'lucide-react';

const ROUND_DURATION = 7 * 60; // 7 minutes
const LOCK_DURATION = 2 * 60; // 2 minutes

const RoundManager = ({ currentPrice, roundInfo }) => {
    const [timeLeft, setTimeLeft] = useState();
    const [isProcessing, setIsProcessing] = useState(false);
    const contract = useContract();

    useEffect(() => {
        if (!contract || !roundInfo) return;

        const updateRound = async () => {
            const now = Math.floor(Date.now() / 1000);
            const start = Number(roundInfo.startTimestamp);
            const end = start + ROUND_DURATION;
            const lockTime = start + LOCK_DURATION;
            const timeRemaining = end - now;

            setTimeLeft(Math.max(timeRemaining, 0));

            if (now >= lockTime && !roundInfo.lockPrice) {
                await handleLockRound();
            }

            if (now >= end && !roundInfo.closePrice) {
                await handleEndRound();
            }

            if (now >= end && roundInfo.closePrice) {
                await handleStartRound();
            }
        };

        const interval = setInterval(updateRound, 1000);
        return () => clearInterval(interval);
    }, [contract, roundInfo, setTimeLeft]);

    const handleStartRound = async () => {
        setIsProcessing(true);
        try {
            const tx = await contract.startRound();
            await tx.wait();
            showNotification('Success', 'New round started successfully!');
        } catch (err) {
            console.error("Error starting new round:", err);
            showNotification('Error', 'Failed to start new round', 'error');
        }
        setIsProcessing(false);
    };

    const handleLockRound = async () => {
        setIsProcessing(true);
        try {
            const price = await getTezosPrice();
            const tx = await contract.lockRound(ethers.parseUnits(price.toString(), 8));
            await tx.wait();
            showNotification('Success', `Round locked at price: $${price}`);
        } catch (err) {
            console.error("Error locking round:", err);
            showNotification('Error', 'Failed to lock round', 'error');
        }
        setIsProcessing(false);
    };

    const handleEndRound = async () => {
        setIsProcessing(true);
        try {
            const price = await getTezosPrice();
            const tx = await contract.endRound(ethers.parseUnits(price.toString(), 8));
            await tx.wait();
            showNotification('Success', `Round ended at price: $${price}`);
        } catch (err) {
            console.error("Error ending round:", err);
            showNotification('Error', 'Failed to end round', 'error');
        }
        setIsProcessing(false);
    };

    if (!roundInfo) {
        return (
            <div className="bg-[#1a1b1f] rounded-xl p-6 flex items-center justify-center h-32">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#ff3366] animate-ping" />
                    <span className="text-gray-400">Loading round data...</span>
                </div>
            </div>
        );
    }

    // Determine round state
    const now = Math.floor(Date.now() / 1000);
    const start = Number(roundInfo.startTimestamp);
    const lockTime = start + LOCK_DURATION;
    const end = start + ROUND_DURATION;
    const isLocked = roundInfo.lockTimestamp <= now;
    
    const remainingTime = isLocked ? (end - now > 0 ? end - now : 0) : lockTime - now;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    // Determine progress percentage
    const totalDuration = isLocked ? ROUND_DURATION - LOCK_DURATION : LOCK_DURATION;
    const elapsedTime = isLocked ? end - now : lockTime - now;
    const progress = ((totalDuration - elapsedTime) / totalDuration) * 100;

    return (
        <div className="bg-[#1a1b1f] rounded-xl border border-[#2a2b2f] overflow-hidden">
            {/* Progress bar */}
            <div className="relative h-1 bg-[#2a2b2f]">
                <div 
                    className="absolute h-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Round Status */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a2b2f]/50 flex items-center justify-center">
                            {isLocked ? (
                                <Lock className="w-6 h-6 text-[#ff3366]" />
                            ) : (
                                <TimerReset className="w-6 h-6 text-[#ff3366]" />
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Round Status</p>
                            <p className="text-white font-medium">
                                {isLocked ? 'Locked' : 'Betting Open'}
                            </p>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a2b2f]/50 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#ff3366]" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">
                                {isLocked ? 'Time Left' : 'Betting Closes In'}
                            </p>
                            <p className="text-white font-medium">
                                {minutes}:{seconds.toString().padStart(2, '0')}
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a2b2f]/50 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[#ff3366]" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Current Price</p>
                            <p className="text-white font-medium">
                                ${currentPrice ? currentPrice.toFixed(5) : '---'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Processing overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-[#1a1b1f]/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#ff3366] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400">Processing transaction...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Optional: Add a notification system
const showNotification = (title, message, type = 'success') => {
    // Implement your notification system here
    console.log(`${type}: ${title} - ${message}`);
};

export default RoundManager;