import React, { useState } from "react";
import './ReportListFilter.css';

function ReportListFilter({ onFilterChange }) {
    const [filter, setFilter] = useState({
        name: '',
        code: '',
        coursMin: '',
        coursMax: '',
        noteMin: '',
        noteMax: '',
        isActive: 0
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        let newFilter = {};
        if (name !== 'isActive') {
            newFilter = { ...filter, [name]: value };
        }
        else {
            newFilter = { ...filter, [name]: checked ? 1 : 0}
        }
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    return <>
        <div id="reportlistfilter">
            <input
                type="text"
                name="name"
                placeholder="Filtrer par nom"
                value={filter.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="code"
                placeholder="Filtrer par code"
                value={filter.code}
                onChange={handleChange}
            />
            <input
                type="number"
                name="coursMin"
                placeholder="Filtrer par cours minimal"
                value={filter.coursMin}
                onChange={handleChange}
            />
            <input
                type="number"
                name="coursMax"
                placeholder="Filtrer par cours maximal"
                value={filter.coursMax}
                onChange={handleChange}
            />
            <input
                type="number"
                name="noteMin"
                placeholder="Filtrer par note minimale"
                value={filter.noteMin}
                onChange={handleChange}
            />
            <input
                type="number"
                name="noteMax"
                placeholder="Filtrer par note maximale"
                value={filter.noteMax}
                onChange={handleChange}
            />
            <label htmlFor="isActive">isActive</label>
            <input
                type="checkbox"
                name="isActive"
                placeholder="Filtrer par entreprise investie"
                value={filter.isActive}
                onChange={handleChange}
            />
        </div>
    </>
}

export default ReportListFilter;