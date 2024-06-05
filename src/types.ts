export interface Dependent {
    id: number;
    name: string;
}

export interface Employee {
    id: number;
    name: string;
    dependents: Dependent[];
}
