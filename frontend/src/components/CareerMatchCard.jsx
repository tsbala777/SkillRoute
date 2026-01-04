import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import DecisionInsightsModal from './DecisionInsightsModal';

const CareerMatchCard = ({ careerDecision, onViewInsights }) => {
    const [showModal, setShowModal] = useState(false);

    if (!careerDecision) {
        return null;
    }

    const {
        career,
        confidence = 0,
        skill_match_percentage = 0,
        market_readiness = 0,
        industry_demand = 'stable',
    } = careerDecision;

    const getDemandBadge = (demand) => {
        switch (demand) {
            case 'trending':
                return { bg: 'bg-emerald-500', label: 'High Demand' };
            case 'stable':
                return { bg: 'bg-blue-500', label: 'Stable' };
            default:
                return { bg: 'bg-violet-500', label: 'Emerging' };
        }
    };

    const demandBadge = getDemandBadge(industry_demand);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full mt-6 mb-4"
            >
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">

                    <div className="p-6 pb-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${demandBadge.bg} rounded-full mb-3`}
                                >
                                    <TrendingUp className="w-3 h-3 text-white" />
                                    <span className="text-[11px] font-semibold text-white uppercase tracking-wide">
                                        {demandBadge.label}
                                    </span>
                                </motion.span>

                                <motion.h2
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight"
                                >
                                    {career}
                                </motion.h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Recommended for you
                                </p>
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <span>Insights</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        AI Match
                                    </span>
                                </div>
                                <div className="flex items-end gap-1">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-2xl font-bold text-gray-900 dark:text-white"
                                    >
                                        {confidence}
                                    </motion.span>
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-0.5">%</span>
                                </div>
                                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${confidence}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        className="h-full bg-gray-900 dark:bg-white rounded-full"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Target className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Skill Fit
                                    </span>
                                </div>
                                <div className="flex items-end gap-1">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.45 }}
                                        className="text-2xl font-bold text-gray-900 dark:text-white"
                                    >
                                        {skill_match_percentage}
                                    </motion.span>
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-0.5">%</span>
                                </div>
                                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill_match_percentage}%` }}
                                        transition={{ duration: 0.8, delay: 0.55 }}
                                        className="h-full bg-gray-900 dark:bg-white rounded-full"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Zap className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        Job Ready
                                    </span>
                                </div>
                                <div className="flex items-end gap-1">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-2xl font-bold text-gray-900 dark:text-white"
                                    >
                                        {market_readiness}
                                    </motion.span>
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-0.5">%</span>
                                </div>
                                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${market_readiness}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="h-full bg-gray-900 dark:bg-white rounded-full"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DecisionInsightsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                careerDecision={careerDecision}
            />
        </>
    );
};

export default CareerMatchCard;
