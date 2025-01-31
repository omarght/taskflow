import { isNumber } from '@mui/x-data-grid/internals';
import React from 'react';

interface PriorityGridCellProps {
    priority: 1 | 2 | 3 | 4 | 5 | "scheduled" | "pending" | "completed" | "in-progress" | "on-hold";
    outlined?: boolean;
    colors?: string[];
}

const PriorityGridCell: React.FC<PriorityGridCellProps> = ({ priority, outlined, colors }) => {
    const getPriorityColor = (priority: number | string) => {
        const defaultColors = ['#FF0000', '#FFA600', '#d7c64c', '#32CD32', '#008000'];
        if(isNumber(priority)) {
        return colors?.[priority - 1] || defaultColors[priority - 1];
        } else {
            switch(priority) {
                case 'scheduled':
                    return colors?.[0] || defaultColors[0];
                case 'pending':
                    return colors?.[1] || defaultColors[1];
                case 'completed':
                    return colors?.[2] || defaultColors[2];
                case 'in_progress':
                    return colors?.[3] || defaultColors[3];
                case 'on_hold':
                    return colors?.[4] || defaultColors[4];
            }
        }
    }

    const priorityText = (priority: number | string) => {
        if(isNumber(priority)) {
            return `\u2022 Priority ${priority}`;
        } else {
            switch(priority) {
                case 'scheduled':
                    return 'Scheduled';
                case 'pending':
                    return 'Pending';
                case 'completed':
                    return 'Completed';
                case 'in_progress':
                    return 'In Progress';
                case 'on_hold':
                    return 'On Hold';
            }
        }
    }

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 'normal', 
        textAlign: 'center',
        height: '100%',
    };

    const textStyles: React.CSSProperties = {
        color: !outlined? getPriorityColor(priority) : 'white',
        border: `2px solid ${getPriorityColor(priority)}`,
        backgroundColor: !outlined? 'white' : getPriorityColor(priority),
        padding: '5px 15px',
        borderRadius: '30px',
    };

    return (
        <div style={containerStyles}>
            <p style={textStyles}>
                {priorityText(priority)}
            </p>
        </div>
    );
};

export default PriorityGridCell;