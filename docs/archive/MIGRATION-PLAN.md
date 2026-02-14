# F1 Dashboard Migration Plan - MVP

## Overview
This document outlines the MVP plan to refactor the F1 Dashboard components, focusing on core functionality and essential improvements.

### Key Objectives
- Consolidate duplicate table components into reusable ones
- Implement basic shared types and constants
- Support both static and API data
- Maintain existing functionality

## Phase 1: Foundation Setup (2-3 days)

### Task 1.1: Create Shared Types and Constants
```typescript
// src/types/common.ts
export type ChampionshipType = 'drivers' | 'constructors';
export type SeasonType = '2023' | '2024' | 'current';

// src/constants/index.ts
export const CHAMPIONSHIP_TYPES = {
  DRIVERS: 'drivers' as const,
  CONSTRUCTORS: 'constructors' as const,
};

export const SEASONS = {
  CURRENT: 'current' as const,
  '2023': '2023' as const,
  '2024': '2024' as const,
};
```

### Task 1.2: Create Base Components
```typescript
// src/components/common/LoadingState.tsx
export const LoadingState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4" />
      <p className="text-navy font-bold">{message}</p>
    </div>
  </div>
);

// src/components/common/DataTable.tsx
interface DataTableProps {
  columns: string[];
  data: any[];
  isLoading?: boolean;
  error?: string;
}
```

## Phase 2: Data Layer (2-3 days)

### Task 2.1: Create Data Fetching Hook
```typescript
// src/hooks/useF1Data.ts
export const useF1Data = (season: SeasonType, championshipType: ChampionshipType) => {
  const isCurrentSeason = season === 'current';
  
  if (isCurrentSeason) {
    return useQuery(['f1', season, championshipType], () => 
      fetchCurrentData(championshipType)
    );
  }

  return {
    data: STATIC_DATA[season][championshipType],
    isLoading: false,
    error: null
  };
};
```

### Task 2.2: Static Data Setup
- Move existing 2023/2024 data to static files
- Basic type safety for data structures

## Phase 3: Component Migration (3-4 days)

### Task 3.1: Create New Components
- SeasonSelector (dropdown)
- ChampionshipToggle (drivers/constructors)
- TabContent (leaderboard/predictions/standings)

### Task 3.2: Create Main Dashboard
```typescript
// src/components/F1Dashboard.tsx
export const F1Dashboard: React.FC = () => {
  const [season, setSeason] = useState<SeasonType>('current');
  const [championshipType, setChampionshipType] = useState<ChampionshipType>('drivers');
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div className="space-y-6">
      <SeasonSelector season={season} onSeasonChange={setSeason} />
      <ChampionshipToggle type={championshipType} onChange={setChampionshipType} />
      <TabContent 
        tab={activeTab}
        season={season}
        championshipType={championshipType}
      />
    </div>
  );
};
```

## Phase 4: Integration (2-3 days)

### Task 4.1: Update App Component
- Replace old components with new F1Dashboard
- Basic error handling
- Basic loading states

### Task 4.2: Clean Up
- Remove old components after verification
- Basic testing of critical paths

## File Changes

### New Files
```
src/
  types/
    common.ts
  constants/
    index.ts
  components/
    common/
      LoadingState.tsx
      DataTable.tsx
    SeasonSelector.tsx
    ChampionshipToggle.tsx
    TabContent.tsx
    F1Dashboard.tsx
  hooks/
    useF1Data.ts
  data/
    staticData/
      2023.ts
      2024.ts
```

### Modified Files
```
src/App.tsx
src/types/index.ts
```

### Deleted Files
```
src/components/DriversPredictions.tsx
src/components/CurrentStandings.tsx
```

## Testing
- Basic component rendering tests
- Critical path testing
- Data fetching verification

## Success Criteria
- All existing functionality works
- Code is more maintainable
- No regression in user experience
