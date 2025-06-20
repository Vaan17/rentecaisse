import React from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Paper,
  Button,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { DateNavigatorProps } from '../types';

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const theme = useTheme();
  
  // Format de la date en français
  const formattedDate = dayjs(selectedDate).locale('fr').format('dddd DD MMMM YYYY');
  
  // Fonction pour aller au jour précédent
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  // Fonction pour aller au jour suivant
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  // Fonction pour aller à aujourd'hui
  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onDateChange(today);
  };

  // Fonction pour gérer le changement de date via le DatePicker
  const handleDatePickerChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      const date = newDate.toDate();
      date.setHours(0, 0, 0, 0);
      onDateChange(date);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderRadius: 2,
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={goToPreviousDay} color="primary">
          <ChevronLeftIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mx: 2, 
            textTransform: 'capitalize',
            minWidth: 220,
            textAlign: 'center'
          }}
        >
          {formattedDate}
        </Typography>
        
        <IconButton onClick={goToNextDay} color="primary">
          <ChevronRightIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          startIcon={<TodayIcon />} 
          variant="outlined" 
          color="primary" 
          onClick={goToToday}
          size="small"
          sx={{ 
            minWidth: 'auto',
            px: 1
          }}
        >
          Aujourd'hui
        </Button>
        
        <DatePicker
          label="Choisir une date"
          value={dayjs(selectedDate)}
          onChange={handleDatePickerChange}
          slotProps={{
            field: { clearable: true },
            textField: { 
              size: 'small',
              fullWidth: true
            },
            popper: {
              style: { zIndex: theme.zIndex.modal + 1 }
            }
          }}
          sx={{ minWidth: 180 }}
          format="DD/MM/YYYY"
        />
      </Box>
    </Paper>
  );
};

export default DateNavigator; 