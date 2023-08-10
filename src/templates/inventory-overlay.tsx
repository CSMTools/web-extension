import * as elements from 'typed-html';

interface InventoryOverlayProps {
    float: string;
    fadePercentage: string;
    fadeGradient: string;
    dopplerPhase: string;
}

export default function InventoryOverlay({ float, fadePercentage, fadeGradient, dopplerPhase }: InventoryOverlayProps) {
    return (
        <span>
            <p class="float-text contrasting-background">{float}</p>
            <p class="fade-text" style={`background-image:${fadeGradient};`}>{fadePercentage}%</p>
            <p class="doppler-text">{dopplerPhase}</p>
        </span>
    );
}
