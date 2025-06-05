import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * InfoTooltip component for displaying helpful information next to form fields
 * @param {string} title - Tooltip text to display
 * @param {React.ReactNode} children - Component to render alongside the tooltip
 * @param {string} placement - Tooltip placement (default: 'top')
 */
const InfoTooltip = ({ title, children, placement = 'top' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {children}
    <Tooltip title={title} arrow placement={placement}>
      <IconButton size="small" sx={{ padding: 0.5 }}>
        <InfoIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  </Box>
);

export default InfoTooltip; 