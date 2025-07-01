import { useEffect } from 'react';

// Helper to detect non-renderable values
export const useDebugReactError = (componentName: string, props: any) => {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    const checkValue = (value: any, path: string) => {
      if (value === null || value === undefined) return;
      
      // Check if it's a non-renderable type
      if (typeof value === 'object' && !Array.isArray(value) && !value.$$typeof) {
        console.warn(`🔴 [${componentName}] Potential React Error #310 at ${path}:`, {
          type: typeof value,
          constructor: value.constructor?.name,
          value: value,
          isReactElement: !!value.$$typeof,
          keys: Object.keys(value)
        });
      }
      
      // Check for BigInt
      if (typeof value === 'bigint') {
        console.warn(`🔴 [${componentName}] BigInt found at ${path}:`, value.toString());
      }
      
      // Recursively check children
      if (Array.isArray(value)) {
        value.forEach((item, index) => checkValue(item, `${path}[${index}]`));
      } else if (value && typeof value === 'object' && value.props) {
        Object.entries(value.props).forEach(([key, val]) => {
          checkValue(val, `${path}.props.${key}`);
        });
      }
    };

    // Check all props
    Object.entries(props).forEach(([key, value]) => {
      checkValue(value, `props.${key}`);
    });
  }, [componentName, props]);
};
