import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const TypingEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(150); // Initial typing speed

  useEffect(() => {
    const handleTyping = () => {
      const currentText = text.substring(0, index);
      setDisplayText(currentText);

      if (!isDeleting && index < text.length) {
        setIndex(index + 1);
        setSpeed(100); // Speed when typing
      } else if (isDeleting && index > 0) {
        setIndex(index - 1);
        setSpeed(75); // Speed when deleting
      } else if (!isDeleting && index === text.length) {
        setIsDeleting(true);
        setSpeed(2000); // Pause before deleting
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
        setSpeed(100); // Reset speed after deleting
      }
    };

    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [text, index, isDeleting, speed]);

  return (
    <Typography
      variant="subtitle2"
      sx={{
        color: 'darkgrey',
        textTransform: 'capitalize',
        fontFamily: 'Montserrat',
        marginTop: '2%',
        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.25rem' }, // Responsive font size
        transition: 'all 0.3s ease-out', // Smooth transition for changes
      }}
    >
      {displayText}
    </Typography>
  );
};

export default TypingEffect;
