import { useEffect } from 'react';

export const useDebugRender = (componentName: string, props: any) => {
  useEffect(() => {
    console.log(`[${componentName}] Rendered with props:`, props);
    
    // Check for non-primitive values in props
    Object.entries(props).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value as any).$$typeof) {
        console.warn(`[${componentName}] Prop "${key}" is an object:`, value);
      }
      if (typeof value === 'boolean') {
        console.warn(`[${componentName}] Prop "${key}" is a boolean:`, value);
      }
      if (typeof value === 'function') {
        console.info(`[${componentName}] Prop "${key}" is a function`);
      }
    });
  }, [componentName, props]);
}; 