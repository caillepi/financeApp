// components/ui/CustomContainer.jsx
import React from 'react';
import { Box, Container } from '@mui/material';

/**
 * @param {Object} props
 * @param {'fullScreen' | 'centered' | 'fluid'} variant - Variante du container
 * @param {boolean} disableGutters - Enlève les marges internes
 * @param {React.ReactNode} children
 * @param {Object} sx - Styles supplémentaires
 */
const CustomContainer = ({
  children,
  variant = 'centered',
  disableGutters = false,
  sx = {},
  ...props
}) => {
  const getContainerStyles = () => {
    switch (variant) {
      case 'fullScreen':
        return {
          width: '100vw',
          height: '100vh',
          maxWidth: 'none !important',
          m: 0,
          p: disableGutters ? 0 : 2,
          ...sx,
        };
      case 'fluid':
        return {
          width: '100%',
          maxWidth: 'none !important',
          p: disableGutters ? 0 : 2,
          ...sx,
        };
      case 'centered':
      default:
        return {
          width: '100%',
          maxWidth: "none !important",
          mx: 'auto',
          p: disableGutters ? 0 : 2,
          ...sx,
        };
    }
  };

  return (
    <Container
      maxWidth={variant === 'centered' ? 'lg' : false}
      disableGutters={disableGutters}
      sx={getContainerStyles()}
      {...props}
    >
      {children}
    </Container>
  );
};

export default CustomContainer;