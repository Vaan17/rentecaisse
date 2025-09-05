import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { modernTheme } from './theme';
import styled from 'styled-components';

interface Option {
    value: string;
    label: string;
}

interface ModernFilterProps {
    options: Option[];
    filterCallback: (filterBy: string | undefined, searchValue: string) => void;
    placeholder?: string;
}

const FilterContainer = styled(Box)`
    display: flex;
    gap: ${modernTheme.spacing.md};
    align-items: center;
    flex-wrap: wrap;
    padding: ${modernTheme.spacing.lg};
    background: ${modernTheme.colors.background.tertiary};
    border-radius: ${modernTheme.borderRadius.lg};
    margin-bottom: ${modernTheme.spacing.lg};
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const SearchField = styled(TextField)`
    && {
        flex: 1;
        min-width: 300px;
        
        @media (max-width: 768px) {
            min-width: 100%;
        }
        
        .MuiOutlinedInput-root {
            background: white;
            border-radius: ${modernTheme.borderRadius.md};
            
            &:hover {
                .MuiOutlinedInput-notchedOutline {
                    border-color: ${modernTheme.colors.primary[500]};
                }
            }
        }
    }
`;

const FilterSelect = styled(TextField)`
    && {
        min-width: 200px;
        
        @media (max-width: 768px) {
            min-width: 100%;
        }
        
        .MuiOutlinedInput-root {
            background: white;
            border-radius: ${modernTheme.borderRadius.md};
        }
    }
`;

const FilterLabel = styled(Box)`
    display: flex;
    align-items: center;
    gap: ${modernTheme.spacing.xs};
    color: ${modernTheme.colors.text.secondary};
    font-weight: 500;
    font-size: 0.875rem;
    
    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const ActiveFiltersContainer = styled(Box)`
    display: flex;
    gap: ${modernTheme.spacing.xs};
    flex-wrap: wrap;
    align-items: center;
`;

const ModernFilter: React.FC<ModernFilterProps> = ({ 
    options, 
    filterCallback, 
    placeholder = "Rechercher..." 
}) => {
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        filterCallback(selectedProperty || undefined, searchValue);
    }, [selectedProperty, searchValue]);

    const handleClearFilter = () => {
        setSelectedProperty('');
        setSearchValue('');
    };

    const hasActiveFilter = selectedProperty || searchValue;

    return (
        <FilterContainer>
            <FilterLabel>
                <FilterListIcon fontSize="small" />
                Filtrer et rechercher :
            </FilterLabel>
            
            <FilterSelect
                size="small"
                label="Filtrer par"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                select
                variant="outlined"
            >
                <MenuItem value="">
                    <em>Tous les champs</em>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </FilterSelect>
            
            <SearchField
                size="small"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />
            
            {hasActiveFilter && (
                <ActiveFiltersContainer>
                    {selectedProperty && (
                        <Chip
                            label={`Filtre: ${options.find(o => o.value === selectedProperty)?.label}`}
                            onDelete={() => setSelectedProperty('')}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    {searchValue && (
                        <Chip
                            label={`Recherche: "${searchValue}"`}
                            onDelete={() => setSearchValue('')}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    <Chip
                        label="Effacer tout"
                        onClick={handleClearFilter}
                        size="small"
                        color="secondary"
                        variant="outlined"
                    />
                </ActiveFiltersContainer>
            )}
        </FilterContainer>
    );
};

export default ModernFilter;
