import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Employee } from "../types";

const mock = new MockAdapter(axios);

const loadEmployees = (): Employee[] => {
    const data = localStorage.getItem('employees');
    return data ? JSON.parse(data) : [
        {
            id: 1,
            name: 'John Doe',
            dependents: [
                { id: 1, name: 'Jane Doe' },
                { id: 2, name: 'Alice Doe' },
            ],
        },
    ];
};

const saveEmployees = (employees: Employee[]) => {
    localStorage.setItem('employees', JSON.stringify(employees));
};

let employees = loadEmployees();

mock.onGet('/employees').reply(200, employees);

mock.onPost('/employees').reply((config) => {
    const employee = JSON.parse(config.data);
    employee.id = Date.now();
    employees.push(employee);
    saveEmployees(employees);
    return [200, employee];
});

mock.onPut(/\/employees\/\d+/).reply((config) => {
    const updatedEmployee = JSON.parse(config.data);
    const index = employees.findIndex((e) => e.id === updatedEmployee.id);
    if (index !== -1) {
        employees[index] = updatedEmployee;
        saveEmployees(employees);
        return [200, updatedEmployee];
    } else {
        return [404];
    }
});

mock.onDelete(/\/employees\/\d+/).reply((config) => {
    if (config.url) {
        const id = parseInt(config.url.split('/')[2]);
        const index = employees.findIndex((e) => e.id === id);
        if (index !== -1) {
            employees.splice(index, 1);
            saveEmployees(employees);
            return [200];
        } else {
            return [404];
        }
    }
    return [500];
});
