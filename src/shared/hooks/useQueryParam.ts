// src/shared/hooks/useQueryParam.ts
import { useCallback, useEffect, useState } from 'react';
import { getQueryParams, updateQueryParams } from '../utils/urlParams';

/**
 * Hook do synchronizacji pojedynczego query parametru z state
 */
export const useQueryParam = (
    key: string,
    defaultValue: string
): [string, (value: string) => void] => {
    // Inicjalizacja z URL lub default
    const [value, setValue] = useState<string>(() => {
        const params = getQueryParams();
        return params.get(key) || defaultValue;
    });

    // Aktualizuj URL gdy zmienia się wartość
    const updateValue = useCallback(
        (newValue: string) => {
            setValue(newValue);
            updateQueryParams({ [key]: newValue });
        },
        [key]
    );

    // Nasłuchuj zmian w URL (browser back/forward)
    useEffect(() => {
        const handlePopState = () => {
            const params = getQueryParams();
            const urlValue = params.get(key);
            if (urlValue && urlValue !== value) {
                setValue(urlValue);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [key, value]);

    return [value, updateValue];
};