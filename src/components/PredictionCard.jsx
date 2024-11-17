// PredictionCard.jsx
const PredictionCard = ({ currentPrice, roundInfo }) => {
    return (
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Price Info */}
                <div className="space-y-6">
                    <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f]">
                        <h3 className="text-gray-400 text-sm mb-2">Current Price</h3>
                        <div className="text-2xl font-bold text-white">
                            ${currentPrice?.toFixed(2)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1a1b1f] p-4 rounded-xl border border-[#2a2b2f]">
                            <h3 className="text-gray-400 text-sm mb-2">Locked Price</h3>
                            <div className="text-xl font-bold text-white">
                                ${roundInfo?.lockedPrice || '0.00'}
                            </div>
                        </div>
                        <div className="bg-[#1a1b1f] p-4 rounded-xl border border-[#2a2b2f]">
                            <h3 className="text-gray-400 text-sm mb-2">Prize Pool</h3>
                            <div className="text-xl font-bold text-white">
                                {roundInfo?.prizePool || '0.00'} ETH
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Prediction Controls */}
                <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f]">
                    <div className="mb-6">
                        <h3 className="text-gray-400 text-sm mb-4">Your Prediction</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="up-button w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                                UP
                            </button>
                            <button className="down-button w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200">
                                DOWN
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-2">
                            Amount (ETH)
                        </label>
                        <input
                            type="number"
                            className="w-full bg-[#0a0b0f] border border-[#2a2b2f] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3366]"
                            placeholder="0.00"
                        />
                    </div>

                    <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-medium hover:from-[#ff4477] hover:to-[#ff77aa] transition-all duration-200">
                        Place Prediction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;