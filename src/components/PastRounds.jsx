import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getSignedContract } from '../utils/contractUtils';
import { useActiveAccount } from 'thirdweb/react';
import { ArrowUp, ArrowDown, Trophy, Clock, AlertCircle } from 'lucide-react';

const PastRounds = () => {
    const [pastRounds, setPastRounds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaimLoading, setIsClaimLoading] = useState(false);
    const [claimingEpoch, setClaimingEpoch] = useState(null);
    const [totalWinnings, setTotalWinnings] = useState(0);
    const [selectedRound, setSelectedRound] = useState(null);
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
                let winningsTotal = 0;

                for (let i = 1; i <= 5; i++) {
                    const epoch = Number(currentEpoch) - i;
                    if (epoch < 0) break;

                    const round = await contract.rounds(epoch);
                    const userRound = await contract.ledger(epoch, account.address);
                    
                    const hasWon = !round.cancelled && (userRound.bull === round.bullWon);
                    if (hasWon) {
                        winningsTotal += Number(ethers.formatEther(userRound.amount));
                    }

                    rounds.push({
                        epoch,
                        closePrice: round.closePrice,
                        bullWon: round.bullWon,
                        bearWon: round.bearWon,
                        cancelled: round.cancelled,
                        userAmount: ethers.formatEther(userRound.amount),
                        userBull: userRound.bull,
                        claimed: userRound.claimed,
                        timestamp: new Date(round.timestamp * 1000),
                    });
                }

                setPastRounds(rounds);
                setTotalWinnings(winningsTotal);
            } catch (error) {
                console.error("Error fetching past rounds:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastRounds();
        const intervalId = setInterval(fetchPastRounds, 5 * 60000);

        return () => clearInterval(intervalId);
    }, [account]);

    const handleClaim = async (epoch) => {
        setClaimingEpoch(epoch);
        setIsClaimLoading(true);
        try {
            const signedContract = await getSignedContract();
            const tx = await signedContract.claim(epoch);
            await tx.wait();
            
            // Success notification instead of alert
            showNotification('Success', `Claimed rewards for round #${epoch}`);
            
            setPastRounds(prev => prev.map(round => 
                round.epoch === epoch ? {...round, claimed: true} : round
            ));
        } catch (error) {
            console.error("Error claiming rewards:", error);
            showNotification('Error', 'Failed to claim rewards. Please try again.', 'error');
        }
        setIsClaimLoading(false);
        setClaimingEpoch(null);
    };

    const showNotification = (title, message, type = 'success') => {
        // Implementation would depend on your notification system
        // You could use toast notifications or a custom solution
    };

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
                    <button className="px-4 py-2 bg-[#ff3366] text-white rounded-lg hover:bg-[#ff4477] transition-colors">
                        Connect Wallet
                    </button>
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
                                {((pastRounds.filter(r => !r.cancelled && r.userBull === r.bullWon).length / pastRounds.filter(r => !r.cancelled).length) * 100).toFixed(1)}%
                            </p>
                        </div>
                        <Clock className="text-[#ff3366] w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Table */}
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
                            {pastRounds.map((round) => (
                                <tr 
                                    key={round.epoch}
                                    onClick={() => setSelectedRound(selectedRound?.epoch === round.epoch ? null : round)}
                                    className={`bg-[#1a1b1f]/50 backdrop-blur-sm hover:bg-[#1a1b1f] transition-colors duration-200 cursor-pointer
                                              ${selectedRound?.epoch === round.epoch ? 'bg-[#1a1b1f] border-l-2 border-l-[#ff3366]' : ''}`}
                                >
                                    <td className="px-6 py-4 text-sm text-white font-medium">
                                        <div className="flex items-center gap-2">
                                            #{round.epoch}
                                            <span className="text-xs text-gray-500">
                                                {round.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">
                                        <div className="flex items-center gap-2">
                                            {ethers.formatEther(round.closePrice)} ETH
                                            {round.bullWon ? (
                                                <ArrowUp className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            round.userBull 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {round.userBull ? 'BULL' : 'BEAR'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">
                                        {round.userAmount} ETH
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            round.cancelled 
                                                ? 'bg-gray-500/10 text-gray-400'
                                                : (round.userBull === round.bullWon)
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {round.cancelled ? 'CANCELLED' : (round.userBull === round.bullWon) ? 'WON' : 'LOST'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {!round.claimed && !round.cancelled && (round.userBull === round.bullWon) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClaim(round.epoch);
                                                }}
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
                                            <span className="text-gray-400 text-sm">Claimed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3366] to-transparent opacity-30" />
            </div>

            {/* Selected Round Details (Optional) */}
            {selectedRound && (
                <div className="mt-4 bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f] animate-fadeIn">
                    <h3 className="text-white font-medium mb-4">Round #{selectedRound.epoch} Details</h3>
                    {/* Add more detailed information about the selected round */}
                </div>
            )}
        </div>
    );
};

export default PastRounds;