import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PageTitleProps {
    title: string;
}

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.custom.darkPaper,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
}));

const TitleText = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    fontSize: '2rem',
}));

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <TitleContainer>
            <TitleText variant="h1">{title}</TitleText>
        </TitleContainer>
    );
};
export default PageTitle;