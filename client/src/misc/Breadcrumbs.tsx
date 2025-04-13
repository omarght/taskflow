import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <MUIBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link to="/">
                Home
            </Link>
            {pathnames.map((pathname, index) => {
                const toLink = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                let refinedPath = pathname.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                return isLast ? (
                    <Typography key={toLink} color="text.primary">
                        {decodeURIComponent(refinedPath)}
                    </Typography>
                ) : (
                    <Link key={toLink} to={toLink}>
                        {pathname.charAt(0).toUpperCase() + pathname.slice(1)}
                    </Link>
                )
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;
