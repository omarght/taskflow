import React from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

interface DeleteButtonProps {
    onClick: () => void;
    isMobile: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, isMobile }) => {
    const theme = useTheme();

    return (
        <Button 
            onClick={onClick} 
            variant="contained" 
            size={isMobile ? 'small' : 'medium'} // Smaller size on mobile
            sx={{
                minWidth: isMobile ? '30px' : '40px', // Reduce button width
                padding: isMobile ? '4px' : '8px', // Reduce padding
                backgroundColor: theme.custom.deleteButtonsBackground,
                color: theme.custom.deleteButtonsText,
                margin: isMobile ? '0px' : '4px 0px', // Adjust margin
                '&:hover': {
                    backgroundColor: theme.custom.deleteButtonsBackgroundHover,
                }
            }}
        >
            <DeleteIcon />
        </Button>
    )
}

export default DeleteButton;