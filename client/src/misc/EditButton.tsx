import React from 'react';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

interface EditButtonProps {
    onClick: () => void;
    isMobile: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, isMobile }) => {
    const theme = useTheme();

    return (
        <Button 
            onClick={onClick} 
            variant="contained" 
            size={isMobile ? 'small' : 'medium'} // Smaller size on mobile
            sx={{
                minWidth: isMobile ? '30px' : '40px', // Reduce button width
                padding: isMobile ? '4px' : '8px', // Reduce padding
                backgroundColor: theme.custom.editButtonsBackground,
                color: theme.custom.editButtonsText,
                margin: isMobile ? '0px' : '4px 0px', // Adjust margin
                '&:hover': {
                    backgroundColor: theme.custom.editButtonsBackgroundHover,
                }
            }}
        >
            <EditIcon />
        </Button>
    )
}

export default EditButton;