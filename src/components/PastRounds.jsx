import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getSignedContract } from '../utils/contractUtils';
import { useActiveAccount } from 'thirdweb/react';
import { Trophy, ArrowUp, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const PastRounds = () => {
    const [pastRounds, setPastRounds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaimLoading, setIsClaimLoading] = useState(false);
    const [claimingEpoch, setClaimingEpoch] = useState(null);
    const account = useActiveAccount();

    useEffect(() => {
        const fetchPastRounds = async () => {
            if (!account) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const contract = getContract();
                const currentEpoch = await contract.currentEpoch();
                const rounds = [];

                for (let i = 1; i <= 5; i++) {
                    const epoch = Number(currentEpoch) - i;
                    if (epoch < 0) break;

                    try {
                        const round = await contract.rounds(epoch);
                        const userRound = await contract.ledger(epoch, account.address);
                        
                        const userAmount = ethers.formatEther(userRound.amount);
                        
                        // Only add rounds with actual participation
                        if (Number(userAmount) > 0) {
                            rounds.push({
                                epoch,
                                closePrice: round.closePrice,
                                lockPrice: round.lockPrice,
                                bullAmount: round.bullAmount,
                                bearAmount: round.bearAmount,
                                bullWon: round.bullWon,
                                bearWon: round.bearWon,
                                cancelled: round.cancelled,
                                userAmount,
                                userBull: userRound.bull,
                                claimed: userRound.claimed,
                                timestamp: Number(round.closeTimestamp) * 1000,
                            });
                        }
                    } catch (err) {
                        console.error(`Error fetching round ${epoch}:`, err);
                    }
                }

                setPastRounds(rounds);
            } catch (error) {
                console.error("Error fetching past rounds:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastRounds();
        const intervalId = setInterval(fetchPastRounds, 30000); // Update every 30 seconds

        return () => clearInterval(intervalId);
    }, [account]);

    const handleClaim = async (epoch) => {
        if (!account) return;
        
        setClaimingEpoch(epoch);
        setIsClaimLoading(true);
        
        try {
            const signedContract = await getSignedContract();
            const tx = await signedContract.claim([epoch]);
            await tx.wait();
            
            // Update the claimed status locally
            setPastRounds(prev => prev.map(round => 
                round.epoch === epoch ? { ...round, claimed: true } : round
            ));

            showNotification('Success', `Successfully claimed rewards for round #${epoch}`);
        } catch (error) {
            console.error("Error claiming rewards:", error);
            showNotification('Error', 'Failed to claim rewards. Please try again.', 'error');
        } finally {
            setIsClaimLoading(false);
            setClaimingEpoch(null);
        }
    };

    // Calculate statistics only from valid rounds
    const validRounds = pastRounds.filter(round => !round.cancelled && Number(round.userAmount) > 0);
    const totalWinnings = validRounds.reduce((total, round) => {
        const won = round.userBull === round.bullWon;
        return won ? total + Number(round.userAmount) : total;
    }, 0);
    
    const winRate = validRounds.length > 0
        ? (validRounds.filter(round => round.userBull === round.bullWon).length / validRounds.length) * 100
        : 0;

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative w-12 h-12">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#ff3366] rounded-full animate-ping opacity-20" />
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#ff3366] rounded-full animate-spin" />
                    </div>
                    <span className="text-gray-400 mt-4">Loading past rounds...</span>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="bg-[#1a1b1f] p-8 rounded-xl border border-[#2a2b2f] text-center">
                    <AlertCircle className="w-12 h-12 text-[#ff3366] mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Please connect your wallet to view past rounds</p>
                </div>
            </div>
        );
    }

    if (pastRounds.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="bg-[#1a1b1f] p-8 rounded-xl border border-[#2a2b2f] text-center">
                    <Trophy className="w-12 h-12 text-[#ff3366] mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No rounds played yet</p>
                    <p className="text-sm text-gray-500">Make your first prediction to start playing!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f] hover:border-[#ff3366]/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Rounds Played</p>
                            <p className="text-2xl font-bold text-white">{pastRounds.length}</p>
                        </div>
                        <Trophy className="text-[#ff3366] w-6 h-6" />
                    </div>
                </div>
                
                <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f] hover:border-[#ff3366]/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Winnings</p>
                            <p className="text-2xl font-bold text-white">{totalWinnings.toFixed(4)} ETH</p>
                        </div>
                        <div className="text-emerald-500">
                            <ArrowUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f] hover:border-[#ff3366]/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                            <p className="text-2xl font-bold text-white">
                                {winRate.toFixed(1)}%
                            </p>
                        </div>
                        <Clock className="text-[#ff3366] w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Past Rounds Table */}
            <div className="relative rounded-xl overflow-hidden bg-[#1a1b1f]/80 backdrop-blur-sm border border-[#2a2b2f]">
                <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3366] to-transparent opacity-30" />
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#1a1b1f]">
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Round</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Close Price</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Your Position</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2b2f]">
                            {pastRounds.map((round) => {
                                const isWon = !round.cancelled && round.userBull === round.bullWon;
                                const formattedTime = new Date(round.timestamp).toLocaleString();
                                const closePrice = ethers.formatEther(round.closePrice);

                                return (
                                    <tr 
                                        key={round.epoch}
                                        className="bg-[#1a1b1f]/50 backdrop-blur-sm hover:bg-[#1a1b1f] transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 text-sm text-white font-medium">
                                            <div className="flex items-center gap-2">
                                                #{round.epoch}
                                                <span className="text-xs text-gray-500">
                                                    {formattedTime}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            <div className="flex items-center gap-2">
                                                {Number(closePrice).toFixed(8)} ETH
                                                {round.bullWon ? (
                                                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                round.userBull 
                                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                                    : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {round.userBull ? (
                                                    <>
                                                        <ArrowUp className="w-3 h-3" />
                                                        BULL
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowDown className="w-3 h-3" />
                                                        BEAR
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            {Number(round.userAmount).toFixed(4)} ETH
                                        </td>
                                        <td className="px-6 py-4">
                                            {round.cancelled ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
                                                    <AlertCircle className="w-3 h-3" />
                                                    CANCELLED
                                                </span>
                                            ) : isWon ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    WON
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                                    <XCircle className="w-3 h-3" />
                                                    LOST
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!round.cancelled && isWon && !round.claimed && (
                                                <button
                                                    onClick={() => handleClaim(round.epoch)}
                                                    disabled={isClaimLoading && claimingEpoch === round.epoch}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
                                                             bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white
                                                             hover:from-[#ff4477] hover:to-[#ff77aa] transition-all duration-200
                                                             disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                                >
                                                    {isClaimLoading && claimingEpoch === round.epoch ? (
                                                        <>
                                                            <span className="opacity-0">Claim</span>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        'Claim'
                                                    )}
                                                </button>
                                            )}
                                            {round.claimed && (
                                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Claimed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3366] to-transparent opacity-30" />
            </div>
        </div>
    );
};

// Helper function for notifications (implement based on your notification system)
const showNotification = (title, message, type = 'success') => {
    // Implement your notification system here
    console.log(`${type}: ${title} - ${message}`);
};

export default PastRounds;