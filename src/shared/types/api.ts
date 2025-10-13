export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            orders: Array<{
                property: string;
                direction: 'ASC' | 'DESC';
            }>;
        };
    };
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface Address {
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    postalCode: string;
    city: string;
}

export type CommunicationPreference = 'SMS' | 'EMAIL' | 'PHONE' | 'APP';