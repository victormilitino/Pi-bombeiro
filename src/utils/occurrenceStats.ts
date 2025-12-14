import { Occurrence } from "../components/OccurrencesContext";

// Contagem genérica
export function countBy<T extends keyof Occurrence>(
  occurrences: Occurrence[],
  key: T
) {
  return occurrences.reduce((acc: any, curr) => {
    const value = curr[key];
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

// Filtro por data
export function filterByDate(
  occurrences: Occurrence[],
  start?: string,
  end?: string
) {
  return occurrences.filter((occ) => {
    const date = new Date(occ.timestamp);
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    return (!startDate || date >= startDate) &&
           (!endDate || date <= endDate);
  });
}
