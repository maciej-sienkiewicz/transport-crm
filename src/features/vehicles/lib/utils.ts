// src/features/vehicles/lib/utils.ts
export const formatRegistrationNumber = (registration: string): string => {
    return registration.toUpperCase().replace(/\s+/g, ' ').trim();
};

export const isExpiringWithin30Days = (dateString: string): boolean => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
};

export const isExpired = (dateString: string): boolean => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};