// src/features/routes/components/RouteMapModal/utils/pointLabels.ts
export const generatePointLabel = (type: 'pickup' | 'dropoff', childIndex: number): string => {
    const letter = String.fromCharCode(65 + childIndex);
    const number = type === 'pickup' ? '1' : '2';
    return `${letter}(${number})`;
};

export const getChildIndexMap = (points: RoutePoint[]): Record<string, number> => {
    const uniqueChildren = [...new Set(points.map(p => p.childName))];
    const childIndexMap: Record<string, number> = {};
    uniqueChildren.forEach((child, index) => {
        childIndexMap[child] = index;
    });
    return childIndexMap;
};