import React, { ReactNode } from 'react';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';

interface LocalizationProviderProps {
  children: ReactNode;
}

const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      {children}
    </MuiLocalizationProvider>
  );
};

export default LocalizationProvider; 