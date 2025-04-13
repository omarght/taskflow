import { isNumber } from '@mui/x-data-grid/internals';
import React from 'react';

interface PriorityGridCellProps {
    priority: 1 | 2 | 3 | 4 | 5 | "scheduled" | "pending" | "completed" | "in-progress" | "on-hold";
    outlined?: boolean;
    colors?: string[]; // Custom colors can still be passed
}

const PriorityGridCell: React.FC<PriorityGridCellProps> = ({ priority, outlined, colors }) => {
    const getPriorityColor = (priority: number | string) => {
        // Default priority colors for priority values 1-5
        const defaultPriorityColors = [
            "#ff4d4f", // Urgent (Red)
            "#ff9900", // High (Orange)
            "#ffcc00", // Medium (Yellow)
            "#66cc66", // Low (Green)
            "#99ccff", // Long-term (Blue)
        ];
        
        // Status colors (keeping as is)
        const defaultStatusColors = ['#86aaf0', '#e1c26e', '#929191', '#95cf95', '#ee8484'];
        
        if (isNumber(priority)) {
            // For numeric priorities (1-5), use the priority colors
            return colors?.[priority - 1] || defaultPriorityColors[priority - 1];
        } else {
            // For status values like "scheduled", "pending", etc., use the status colors
            switch (priority) {
                case 'scheduled':
                    return colors?.[0] || defaultStatusColors[0];
                case 'pending':
                    return colors?.[1] || defaultStatusColors[1];
                case 'completed':
                    return colors?.[2] || defaultStatusColors[2];
                case 'in_progress':
                    return colors?.[3] || defaultStatusColors[3];
                case 'on_hold':
                    return colors?.[4] || defaultStatusColors[4];
            }
        }
    };

    const priorityText = (priority: number | string) => {
        if (isNumber(priority)) {
            switch (priority) {
                case 1:
                    return 'Urgent';
                case 2:
                    return 'High';
                case 3:
                    return 'Normal';
                case 4:
                    return 'Low';
                case 5:
                    return 'Long Term';
            }
        } else {
            switch (priority) {
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
    };

    // Responsive styles
    const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 'normal',
        textAlign: 'center',
        height: '100%',
        width: '100%', // Ensure full width on mobile
    };

    const textStyles: React.CSSProperties = {
        // For priority values (1-5), make it just colored text, no background
        color: isNumber(priority) ? getPriorityColor(priority) : 'white',  // Only color the text for priority
        backgroundColor: isNumber(priority) ? 'transparent' : getPriorityColor(priority), // No background for priority
        padding: isMobile ? '3px 8px' : '5px 10px', // Same padding for both priority and status
        borderRadius: '30px',
        fontSize: isMobile ? '12px' : '12px', // Same font size for both priority and status
        maxWidth: isMobile ? '120px' : '140px', // Limit width on mobile
        whiteSpace: 'nowrap', // Prevent text wrapping
        overflow: 'hidden',
        textOverflow: 'ellipsis', // Handle overflow
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
