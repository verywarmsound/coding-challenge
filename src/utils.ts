import { Employee } from "./types";

export function calculateCost(employee: Employee): number {
    const employeeCost = employee.name.startsWith('A') ? 1000 * 0.9 : 1000;
    const dependentsCost = employee.dependents.reduce((total, dependent) => {
        return total + (dependent.name.startsWith('A') ? 500 * 0.9 : 500);
    }, 0);
    const totalAnnualCost = employeeCost + dependentsCost;
    return totalAnnualCost / 26;
}
