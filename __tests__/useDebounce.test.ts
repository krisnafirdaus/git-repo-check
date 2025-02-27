import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/use-debounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  test('should update value after specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    expect(result.current).toBe('initial value');

    // Change the value
    rerender({ value: 'new value', delay: 500 });
    
    // Value should not have changed yet
    expect(result.current).toBe('initial value');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should have updated after the delay
    expect(result.current).toBe('new value');
  });

  test('should reset timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'intermediate value', delay: 500 });
    
    // Fast forward time, but not enough to trigger update
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Value should not have changed yet
    expect(result.current).toBe('initial value');

    // Change the value again, which should restart the timer
    rerender({ value: 'final value', delay: 500 });
    
    // Fast forward time a bit, but not enough for the new delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Value should still not have changed
    expect(result.current).toBe('initial value');
    
    // Fast forward the remaining time
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Value should now update to the final value
    expect(result.current).toBe('final value');
  });

  test('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value and delay
    rerender({ value: 'new value', delay: 1000 });
    
    // Fast forward time to what would be enough for the original delay
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Value should not have changed yet due to increased delay
    expect(result.current).toBe('initial value');
    
    // Fast forward the remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Value should now have updated
    expect(result.current).toBe('new value');
  });

  test('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value to set a new timeout
    rerender({ value: 'new value', delay: 500 });
    
    // Unmount to trigger cleanup
    unmount();
    
    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});