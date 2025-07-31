# 🧪 QA Development Cards - F1 Predictions Leaderboard

## 🚨 Critical Priority (Fix Immediately)

### Card 1: Data Synchronization Fix
**Priority:** Critical  
**Estimated Time:** 2-3 hours  
**Component:** CurrentStandings.tsx, Predictions.tsx, Leaderboard.tsx

**Issue:** Components using local state instead of centralized F1ApiService, causing data inconsistency.

**Current Code:**
```typescript
// CurrentStandings.tsx - Lines 6-7
const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
```

**Fix Required:**
```typescript
// Replace with centralized service
import { useStandings } from '../hooks/useStandings';

const { driverStandings, constructorStandings, isLoading, error } = useStandings();
```

**Acceptance Criteria:**
- [ ] All components use F1ApiService consistently
- [ ] Data remains synchronized across all tabs
- [ ] Loading states work properly
- [ ] Error handling is consistent

---

### Card 2: Error Handling in Render Cycle
**Priority:** Critical  
**Estimated Time:** 1-2 hours  
**Component:** Leaderboard.tsx

**Issue:** Throwing errors in render cycle can cause component crashes.

**Current Code:**
```typescript
// Leaderboard.tsx - Line 45
if (!driverPrediction || !constructorPrediction) {
  throw new Error(`Missing predictions for participant: ${participant.name}`);
}
```

**Fix Required:**
```typescript
// Use fallback values instead of throwing
const driverScore = driverPrediction 
  ? calculateDriverPredictionScore(driverPrediction, currentDriverStandings)
  : 0;
```

**Acceptance Criteria:**
- [ ] No errors thrown during render
- [ ] Graceful handling of missing data
- [ ] User-friendly fallback displays
- [ ] Error logging for debugging

---

### Card 3: Array Bounds Validation
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Component:** Predictions.tsx

**Issue:** No validation that index is within bounds of predictions array.

**Current Code:**
```typescript
// Predictions.tsx - Line 108
const predictedItem = userPrediction?.predictions[index] || '-';
```

**Fix Required:**
```typescript
// Add bounds checking
const predictedItem = userPrediction?.predictions[index] || 
  (index < (userPrediction?.predictions.length || 0) ? userPrediction.predictions[index] : '-');
```

**Acceptance Criteria:**
- [ ] No runtime errors from array access
- [ ] Proper fallback for missing predictions
- [ ] Handles edge cases gracefully

---

## ⚠️ High Priority (Fix This Sprint)

### Card 4: Memory Leak in useEffect
**Priority:** High  
**Estimated Time:** 1 hour  
**Component:** Leaderboard.tsx

**Issue:** Missing dependencies in useEffect causing potential stale closures.

**Current Code:**
```typescript
// Leaderboard.tsx - useEffect
useEffect(() => {
  if (!isAutoRefresh) return;
  const interval = setInterval(() => {
    setIsUpdating(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsUpdating(false);
    }, 1000);
  }, 30000);
  return () => clearInterval(interval);
}, [isAutoRefresh]); // Missing dependencies
```

**Fix Required:**
```typescript
// Add missing dependencies or use useCallback
const updateData = useCallback(() => {
  setIsUpdating(true);
  setTimeout(() => {
    setLastUpdated(new Date());
    setIsUpdating(false);
  }, 1000);
}, []);

useEffect(() => {
  if (!isAutoRefresh) return;
  const interval = setInterval(updateData, 30000);
  return () => clearInterval(interval);
}, [isAutoRefresh, updateData]);
```

**Acceptance Criteria:**
- [ ] No stale closure issues
- [ ] Proper cleanup on unmount
- [ ] Auto-refresh works correctly

---

### Card 5: Scoring Calculation Edge Cases
**Priority:** High  
**Estimated Time:** 2 hours  
**Component:** utils/calculations.ts

**Issue:** No handling for missing drivers/constructors in actual standings.

**Current Code:**
```typescript
// calculations.ts - Line 8
prediction.predictions.forEach((predictedDriver, predictedPosition) => {
  const actualDriver = actualStandings.find(d => d.driver === predictedDriver);
  if (actualDriver) {
    const positionDifference = Math.abs(actualDriver.position - (predictedPosition + 1));
    totalScore += positionDifference;
  }
});
```

**Fix Required:**
```typescript
// Add comprehensive error handling
prediction.predictions.forEach((predictedDriver, predictedPosition) => {
  const actualDriver = actualStandings.find(d => d.driver === predictedDriver);
  if (actualDriver) {
    const positionDifference = Math.abs(actualDriver.position - (predictedPosition + 1));
    totalScore += positionDifference;
  } else {
    // Handle missing driver - assign worst possible score
    totalScore += actualStandings.length;
    console.warn(`Driver ${predictedDriver} not found in current standings`);
  }
});
```

**Acceptance Criteria:**
- [ ] Handles missing drivers/constructors gracefully
- [ ] Logs warnings for debugging
- [ ] Assigns appropriate penalty scores
- [ ] No silent failures

---

## 🔧 Medium Priority (Next Sprint)

### Card 6: Mobile Responsiveness Improvements
**Priority:** Medium  
**Estimated Time:** 3-4 hours  
**Component:** TabNavigation.tsx, All table components

**Issue:** Fixed flex layouts may cause text overflow on very small screens.

**Current Code:**
```typescript
// TabNavigation.tsx
<div className="flex">
  {tabs.map((tab, index) => (
    <button className="flex-1 py-3 px-4...">
```

**Fix Required:**
```typescript
// Add responsive text handling
<div className="flex">
  {tabs.map((tab, index) => (
    <button className="flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm...">
      <span className="truncate">{tab.label}</span>
    </button>
  ))}
</div>
```

**Acceptance Criteria:**
- [ ] Text truncation on small screens
- [ ] Responsive breakpoints working
- [ ] No horizontal overflow
- [ ] Touch-friendly button sizes

---

### Card 7: Accessibility Enhancements
**Priority:** Medium  
**Estimated Time:** 4-5 hours  
**Component:** All components

**Issues:**
- Missing `aria-live` regions for dynamic content
- No focus management for tooltips
- Missing skip links

**Fix Required:**
```typescript
// Add aria-live regions
<div aria-live="polite" aria-atomic="true">
  {lastUpdated && <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>}
</div>

// Add focus management for tooltips
const [tooltipVisible, setTooltipVisible] = useState(false);
const tooltipRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (tooltipVisible && tooltipRef.current) {
    tooltipRef.current.focus();
  }
}, [tooltipVisible]);
```

**Acceptance Criteria:**
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] Focus management working

---

### Card 8: Performance Optimizations
**Priority:** Medium  
**Estimated Time:** 3-4 hours  
**Component:** Leaderboard.tsx, Predictions.tsx

**Issues:**
- Large data arrays processed on every render
- No virtualization for large lists
- Missing debouncing on search

**Fix Required:**
```typescript
// Add debouncing to search
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Add virtualization for large lists
import { FixedSizeList as List } from 'react-window';

// Optimize data processing
const processedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

**Acceptance Criteria:**
- [ ] Search debouncing implemented
- [ ] Large lists virtualized
- [ ] Performance metrics improved
- [ ] Smooth scrolling on mobile

---

## 📊 Low Priority (Future Sprints)

### Card 9: Error Boundaries Implementation
**Priority:** Low  
**Estimated Time:** 2-3 hours  
**Component:** App.tsx, Individual components

**Issue:** No error boundaries to catch and handle component errors gracefully.

**Fix Required:**
```typescript
// Create error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

**Acceptance Criteria:**
- [ ] Error boundaries wrap all major components
- [ ] Graceful error recovery
- [ ] Error logging implemented
- [ ] User-friendly error messages

---

### Card 10: Comprehensive Test Suite
**Priority:** Low  
**Estimated Time:** 8-10 hours  
**Component:** All components

**Issue:** No automated tests for critical functionality.

**Test Requirements:**
- Unit tests for calculation functions
- Integration tests for component interactions
- E2E tests for user workflows
- Accessibility tests
- Performance tests

**Acceptance Criteria:**
- [ ] 80%+ code coverage
- [ ] All critical paths tested
- [ ] Accessibility tests passing
- [ ] Performance benchmarks established

---

## 📋 Implementation Checklist

### Before Starting:
- [ ] Set up development environment
- [ ] Review current codebase
- [ ] Create feature branches for each card
- [ ] Set up testing framework

### During Implementation:
- [ ] Follow TypeScript best practices
- [ ] Write tests for new functionality
- [ ] Update documentation
- [ ] Test on multiple devices/browsers

### After Completion:
- [ ] Code review
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] User acceptance testing

## 🎯 Success Metrics

### Quality Metrics:
- Error rate < 1%
- Performance score > 90
- Accessibility score > 95
- Test coverage > 80%

### User Experience Metrics:
- Page load time < 3s
- Time to interactive < 5s
- Mobile usability score > 90
- User satisfaction > 4.5/5

---

**Created by:** Quinn - QA Test Architect  
**Date:** $(date)  
**Version:** 1.0 

# Kanban: F1 Predictions Leaderboard – Historical Seasons Enhancement

## To Do

1. **Add Tabbed View for 2023 and 2024 Seasons**
   - Update the UI to present 2023 and 2024 predictions/results in the same tabbed format as the current season.
   - Ensure seamless navigation between seasons.

2. **Fetch and Store Final Standings for 2023 and 2024**
   - Use the F1 API to fetch final driver and constructor standings for 2023 and 2024.
   - Store these standings as static data (e.g., in a local file or database) to avoid unnecessary API calls.

3. **Implement Standings Comparison Logic**
   - Compare stored final standings with participant predictions for 2023 and 2024.
   - Reuse or adapt the current season's comparison logic for historical seasons.

4. **Enable Scoring Method Toggle for All Seasons**
   - Allow users to toggle between different scoring methods for all seasons (2023, 2024, current).
   - Ensure the toggle updates the displayed scores accordingly.

## In Progress

- _(Move cards here as work begins)_

## Done

- _(Move completed cards here)_ 

# User Stories: Historical Seasons Enhancement

1. **As a user, I want to view my F1 predictions and results for previous seasons (2023 and 2024) in the same way as the current season, so that I can easily compare my performance across years.**

2. **As a user, I want the final standings for past seasons to be accurate and not change, so I can trust the leaderboard reflects the official results.**

3. **As a participant, I want my predictions to be scored using the same method as the current season, so that the scoring is fair and consistent.**

4. **As a user, I want to be able to toggle the scoring method for any season, so I can see how different scoring systems affect my results.**

5. **As a developer, I want to store final standings for past seasons locally, so the app does not make unnecessary API calls for data that will not change.** 