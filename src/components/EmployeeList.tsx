import React, { useState } from 'react';
import { useAddEmployee, useDeleteEmployee, useEmployees, useUpdateEmployee } from "../hooks/useEmployees";
import { Employee, Dependent } from "../types";
import {calculateCost} from "../utils";

function EmployeeList() {
    const { data: employees, isLoading } = useEmployees();
    const addEmployee = useAddEmployee();
    const updateEmployee = useUpdateEmployee();
    const deleteEmployee = useDeleteEmployee();
    const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
    const [newDependentNames, setNewDependentNames] = useState<{ [key: number]: string }>({});
    const [electionChanges, setElectionChanges] = useState<{ [key: number]: Employee }>({});

    if (isLoading) return <div>Loading...</div>;
    const handleElectionChange = (employeeId: number, changes: Partial<Employee>) => {
        setElectionChanges({
            ...electionChanges,
            [employeeId]: {
                ...electionChanges[employeeId],
                ...changes,
            },
        });
    };
    const handleAddDependent = (employee: Employee) => {
        const newDependent: Dependent = {
            id: Date.now(),
            name: newDependentNames[employee.id] || '',
        };
        const updatedEmployee = {
            ...employee,
            dependents: [...employee.dependents, newDependent],
        };
        updateEmployee.mutate(updatedEmployee);
        setNewDependentNames({ ...newDependentNames, [employee.id]: '' });
        handleElectionChange(employee.id, updatedEmployee);
    };

    const handleDeleteDependent = (employee: Employee, dependentId: number) => {
        const updatedEmployee = {
            ...employee,
            dependents: employee.dependents.filter(dependent => dependent.id !== dependentId),
        };
        updateEmployee.mutate(updatedEmployee);
        handleElectionChange(employee.id, updatedEmployee);
    };

    const handleDependentNameChange = (employeeId: number, name: string) => {
        setNewDependentNames({ ...newDependentNames, [employeeId]: name });
    };


    return (
        <div className="employee-list">
            {employees?.map((employee: Employee) => (
                <div key={employee.id} className="employee-item">
                    {editingEmployee === employee.id ? (
                        <input
                            defaultValue={employee.name}
                            onBlur={(e) => {
                                updateEmployee.mutate({...employee, name: e.target.value});
                                setEditingEmployee(null);
                            }}
                        />
                    ) : (
                        <span onDoubleClick={() => setEditingEmployee(employee.id)}>
              {employee.name}
            </span>
                    )}
                    <button className="delete-button" onClick={() => deleteEmployee.mutate(employee.id)}>X</button>
                    <div className="dependents-list">
                        <strong>Dependents:</strong>
                        <ul>
                            {employee.dependents.map(dependent => (
                                <li key={dependent.id}>
                                    {dependent.name}
                                    <button onClick={() => handleDeleteDependent(employee, dependent.id)}>Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="add-dependent">
                            <input
                                type="text"
                                value={newDependentNames[employee.id] || ''}
                                onChange={(e) => handleDependentNameChange(employee.id, e.target.value)}
                                placeholder="New Dependent Name"
                            />
                            <button className="add-dependent-button" onClick={() => handleAddDependent(employee)}>Add
                                Dependent
                            </button>
                        </div>
                    </div>
                    <div className="cost">
                        Cost per paycheck: ${calculateCost(electionChanges[employee.id] || employee).toFixed(2)}
                    </div>
                    {electionChanges[employee.id] && (
                        <div className="preview">
                            Preview of calculated benefits: ${calculateCost(electionChanges[employee.id]).toFixed(2)}
                        </div>
                    )}
                </div>
            ))}
            <button className="add-employee-button"
                    onClick={() => addEmployee.mutate({name: 'New Employee', dependents: []})}>
                Add Employee
            </button>
        </div>
    );
}

export default EmployeeList;
