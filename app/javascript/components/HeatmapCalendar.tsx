import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import styled from 'styled-components';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// Étendre dayjs avec les plugins nécessaires
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

interface HeatmapData {
  date: string;
  count: number;
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  title?: string;
}

interface Dimensions {
  containerWidth: number;
  squareSize: number;
  gap: number;
  showLabels: boolean;
}

const HeatmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
`;

const MonthsContainer = styled.div<{ dimensions: Dimensions }>`
  display: flex;
  margin-left: ${({ dimensions }) => dimensions.showLabels ? '20px' : '0px'};
  font-size: ${({ dimensions }) => Math.max(9, dimensions.squareSize * 0.85)}px;
  color: #7c7c7c;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  margin-bottom: 4px;
`;

const MonthLabel = styled.div<{ width: number; centerOffset?: number }>`
  width: ${({ width }) => width}px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  transform: translateX(${({ centerOffset = 0 }) => centerOffset}px);
  transition: transform 0.3s ease;
`;

const CalendarGrid = styled.div<{ dimensions: Dimensions }>`
  display: flex;
  gap: ${({ dimensions }) => dimensions.gap}px;
  transition: all 0.3s ease;
`;

const WeekDaysContainer = styled.div<{ dimensions: Dimensions }>`
  display: ${({ dimensions }) => dimensions.showLabels ? 'flex' : 'none'};
  flex-direction: column;
  gap: ${({ dimensions }) => dimensions.gap}px;
  font-size: ${({ dimensions }) => Math.max(7, dimensions.squareSize * 0.7)}px;
  color: #7c7c7c;
  width: 15px;
  transition: all 0.3s ease;
`;

const WeekColumn = styled.div<{ dimensions: Dimensions }>`
  display: flex;
  flex-direction: column;
  gap: ${({ dimensions }) => dimensions.gap}px;
`;

const DaySquare = styled.div<{ level: number; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => Math.max(1, size * 0.2)}px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ level }) => {
    switch (level) {
      case 0: return '#F8F9FA'; // Gris très clair (pas d'activité)
      case 1: return '#FFF8E1'; // Jaune très clair
      case 2: return '#FFE0B2'; // Orange très clair  
      case 3: return '#FFCC02'; // Jaune doré
      case 4: return '#FF8F00'; // Orange foncé (votre couleur principale)
      default: return '#F8F9FA';
    }
  }};
  
  border: 1px solid ${({ level }) => {
    switch (level) {
      case 0: return 'rgba(0,0,0,0.05)';
      case 1: return 'rgba(255, 193, 7, 0.2)';
      case 2: return 'rgba(255, 193, 7, 0.3)';
      case 3: return 'rgba(255, 193, 7, 0.4)';
      case 4: return 'rgba(255, 143, 0, 0.5)';
      default: return 'rgba(0,0,0,0.05)';
    }
  }};
  
  &:hover {
    outline: 2px solid rgba(255, 143, 0, 0.3);
    outline-offset: -1px;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(255, 143, 0, 0.2);
  }
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #7c7c7c;
  margin-top: 8px;
`;

const LegendSquare = styled.div<{ level: number }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid ${({ level }) => {
    switch (level) {
      case 0: return 'rgba(0,0,0,0.05)';
      case 1: return 'rgba(255, 193, 7, 0.2)';
      case 2: return 'rgba(255, 193, 7, 0.3)';
      case 3: return 'rgba(255, 193, 7, 0.4)';
      case 4: return 'rgba(255, 143, 0, 0.5)';
      default: return 'rgba(0,0,0,0.05)';
    }
  }};
  background-color: ${({ level }) => {
    switch (level) {
      case 0: return '#F8F9FA'; // Gris très clair (pas d'activité)
      case 1: return '#FFF8E1'; // Jaune très clair
      case 2: return '#FFE0B2'; // Orange très clair  
      case 3: return '#FFCC02'; // Jaune doré
      case 4: return '#FF8F00'; // Orange foncé (votre couleur principale)
      default: return '#F8F9FA';
    }
  }};
`;

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ data, title = "Activité sur l'année" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    containerWidth: 800,
    squareSize: 10,
    gap: 2,
    showLabels: true
  });

  // Créer un map pour un accès rapide aux données
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {} as Record<string, number>);

  // Calculer les dimensions optimales
  const calculateDimensions = useCallback((containerWidth: number): Dimensions => {
    const totalWeeks = 53; // Nombre maximum de semaines dans une année
    const labelWidth = 20; // Largeur des labels des jours
    const minSquareSize = 8;
    const maxSquareSize = 14;
    
    // Calculer l'espace disponible
    const availableWidth = containerWidth - (containerWidth < 600 ? 0 : labelWidth);
    const maxGap = 4;
    const minGap = 2;
    
    // Calculer la taille optimale des carrés avec une meilleure proportion
    let squareSize = Math.floor((availableWidth - (totalWeeks * minGap)) / totalWeeks);
    squareSize = Math.max(minSquareSize, Math.min(maxSquareSize, squareSize));
    
    // Calculer le gap optimal avec une meilleure répartition
    const remainingSpace = availableWidth - (totalWeeks * squareSize);
    let gap = Math.floor(remainingSpace / (totalWeeks - 1)); // -1 car il y a n-1 gaps entre n éléments
    gap = Math.max(minGap, Math.min(maxGap, gap));
    
    // Ajustement final pour éviter le débordement
    const totalUsedWidth = totalWeeks * squareSize + (totalWeeks - 1) * gap;
    if (totalUsedWidth > availableWidth) {
      gap = Math.max(minGap, gap - 1);
    }
    
    return {
      containerWidth,
      squareSize,
      gap,
      showLabels: containerWidth >= 600
    };
  }, []);

  // Observer pour détecter les changements de taille
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setDimensions(calculateDimensions(width));
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Calcul initial
      const initialWidth = containerRef.current.offsetWidth;
      setDimensions(calculateDimensions(initialWidth));
    }

    return () => resizeObserver.disconnect();
  }, [calculateDimensions]);

  // Générer les semaines de l'année
  const generateWeeks = () => {
    const weeks = [];
    const startOfYear = dayjs().startOf('year');
    const endOfYear = dayjs().endOf('year');
    
    // Commencer au début de la première semaine de l'année (lundi)
    let currentDate = startOfYear.startOf('week').add(1, 'day'); // Commencer le lundi
    
    // Ajuster si nécessaire pour inclure la première semaine complète
    if (currentDate.isAfter(startOfYear)) {
      currentDate = currentDate.subtract(1, 'week');
    }
    
    while (currentDate.isBefore(endOfYear) || currentDate.isSame(endOfYear, 'week')) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = currentDate.add(i, 'day');
        const dateKey = date.format('YYYY-MM-DD');
        const count = dataMap[dateKey] || 0;
        
        // Déterminer le niveau d'intensité (0-4) avec une progression plus douce
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 2) level = 2;
        if (count >= 4) level = 3;
        if (count >= 7) level = 4;
        
        week.push({
          date: dateKey,
          count,
          level,
          dayOfWeek: i,
          isCurrentYear: date.year() === dayjs().year(),
          month: date.month(),
          dayOfMonth: date.date()
        });
      }
      weeks.push(week);
      currentDate = currentDate.add(1, 'week');
    }
    
    return weeks;
  };

  // Générer les mois pour l'en-tête avec positions correctes
  const generateMonths = (weeks: any[]) => {
    const months: Array<{
      name: string;
      width: number;
      startWeek: number;
      endWeek: number;
      centerOffset: number;
    }> = [];
    
    const monthsData: { 
      [key: string]: { 
        name: string;
        startWeek: number;
        endWeek: number;
        daysInMonth: number;
        firstDayOfMonth: number;
        lastDayOfMonth: number;
      } 
    } = {};
    
    // Premier passage : identifier tous les mois et leurs semaines
    weeks.forEach((week, weekIndex) => {
      week.forEach((day: any, dayIndex: number) => {
        if (day.isCurrentYear) {
          const monthKey = dayjs(day.date).format('YYYY-MM');
          const monthName = dayjs(day.date).format('MMM');
          const dayOfMonth = dayjs(day.date).date();
          
          if (!monthsData[monthKey]) {
            monthsData[monthKey] = {
              name: monthName,
              startWeek: weekIndex,
              endWeek: weekIndex,
              daysInMonth: dayjs(day.date).daysInMonth(),
              firstDayOfMonth: dayOfMonth === 1 ? dayIndex : 7,
              lastDayOfMonth: dayOfMonth === dayjs(day.date).daysInMonth() ? dayIndex : -1
            };
          } else {
            monthsData[monthKey].endWeek = weekIndex;
            if (dayOfMonth === 1) {
              monthsData[monthKey].firstDayOfMonth = dayIndex;
            }
            if (dayOfMonth === dayjs(day.date).daysInMonth()) {
              monthsData[monthKey].lastDayOfMonth = dayIndex;
            }
          }
        }
      });
    });
    
    // Deuxième passage : calculer les positions et largeurs optimales
    Object.values(monthsData).forEach(month => {
      const totalWeeksSpanned = month.endWeek - month.startWeek + 1;
      const baseWidth = totalWeeksSpanned * (dimensions.squareSize + dimensions.gap);
      
      // Calculer le décalage pour centrer le label sur les jours réels du mois
      let centerOffset = 0;
      
      if (totalWeeksSpanned > 1) {
        // Pour les mois qui s'étendent sur plusieurs semaines
        const firstWeekDays = 7 - month.firstDayOfMonth;
        const lastWeekDays = month.lastDayOfMonth + 1;
        const middleWeeks = Math.max(0, totalWeeksSpanned - 2);
        
        // Position du centre réel du mois
        const realCenterPosition = (firstWeekDays + middleWeeks * 7 + lastWeekDays) / 2;
        const totalPossibleDays = totalWeeksSpanned * 7;
        const visualCenterPosition = totalPossibleDays / 2;
        
        // Ajustement du décalage en pixels
        const dayWidth = (dimensions.squareSize + dimensions.gap);
        centerOffset = (realCenterPosition - visualCenterPosition) * dayWidth / 7;
      }
      
      months.push({
        name: month.name,
        width: Math.max(baseWidth - dimensions.gap, dimensions.squareSize * 3), // Largeur minimum
        startWeek: month.startWeek,
        endWeek: month.endWeek,
        centerOffset: centerOffset
      });
    });
    
    return months;
  };

  const weeks = generateWeeks();
  const months = generateMonths(weeks);
  const weekDays = ['', 'L', '', 'M', '', 'V', ''];

  return (
    <Box>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '14px', fontWeight: 600 }}>
        {title}
      </Typography>
      
      <HeatmapContainer ref={containerRef}>
        {/* En-tête des mois */}
        <MonthsContainer dimensions={dimensions}>
          {months.map((month, index) => (
            <MonthLabel 
              key={index} 
              width={month.width}
              centerOffset={month.centerOffset}
            >
              {month.name}
            </MonthLabel>
          ))}
        </MonthsContainer>
        
        {/* Calendrier principal */}
        <CalendarGrid dimensions={dimensions}>
          {/* Jours de la semaine */}
          <WeekDaysContainer dimensions={dimensions}>
            {weekDays.map((day, index) => (
              <div key={index} style={{ 
                height: `${dimensions.squareSize}px`, 
                lineHeight: `${dimensions.squareSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {day}
              </div>
            ))}
          </WeekDaysContainer>
          
          {/* Colonnes des semaines */}
          {weeks.map((week, weekIndex) => (
            <WeekColumn key={weekIndex} dimensions={dimensions}>
              {week.map((day) => (
                <Tooltip 
                  key={day.date}
                  title={`${day.count} emprunt${day.count > 1 ? 's' : ''} le ${dayjs(day.date).format('DD/MM/YYYY')}`}
                  arrow
                  placement="top"
                >
                  <DaySquare 
                    level={day.level} 
                    size={dimensions.squareSize}
                    style={{ 
                      opacity: day.isCurrentYear ? 1 : 0.3 
                    }}
                  />
                </Tooltip>
              ))}
            </WeekColumn>
          ))}
        </CalendarGrid>
        
        {/* Légende */}
        <LegendContainer>
          <span>Moins</span>
          <LegendSquare level={0} />
          <LegendSquare level={1} />
          <LegendSquare level={2} />
          <LegendSquare level={3} />
          <LegendSquare level={4} />
          <span>Plus</span>
        </LegendContainer>
      </HeatmapContainer>
    </Box>
  );
};

export default HeatmapCalendar;
