import React from "react";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string; // Adding className support as it's used in VoiceUnlockScreen
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
    return (
        <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
