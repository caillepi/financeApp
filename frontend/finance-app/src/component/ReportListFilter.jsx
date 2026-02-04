import React, { useState } from "react";
import './ReportListFilter.css';
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";



function ReportListFilter({ onFilterChange }) {
    const [filter, setFilter] = useState({
        name: '',
        code: '',
        coursMin: '',
        coursMax: '',
        noteMin: '',
        noteMax: '',
        is_active: 2
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        let newFilter = {};
        newFilter = { ...filter, [name]: value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    return <>
        <Grid container spacing={3}>
            <h2>Filtres</h2>
            <Grid>
                <InputLabel htmlFor="name">
                    Nom
                </InputLabel>
                <TextField
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor="code">
                    Code
                </InputLabel>
                <TextField
                    type="text"
                    name="code"
                    value={filter.code}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor="coursMin">
                    Cours minimal
                </InputLabel>
                <TextField
                    type="number"
                    name="coursMin"
                    value={filter.coursMin}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor="coursMax">
                    Cours maximal
                </InputLabel>
                <TextField
                    type="number"
                    name="coursMax"
                    value={filter.coursMax}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor="noteMin">
                    Score minimal
                </InputLabel>
                <TextField
                    type="number"
                    name="noteMin"
                    value={filter.noteMin}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor="noteMax">
                    Score maximal
                </InputLabel>
                <TextField
                    type="number"
                    name="noteMax"
                    value={filter.noteMax}
                    onChange={handleChange}
                    variant="standard"
                />
            </Grid>
            <Grid>
                <InputLabel id="is_active-label">Wallet</InputLabel>
                <Select
                    labelId="is_active-label"
                    id="is_active"
                    name="is_active"
                    value={filter.is_active ?? 2}
                    onChange={handleChange}
                    label="is_active"
                    variant="standard"
                >
                    <MenuItem value={2}>Tout</MenuItem>
                    <MenuItem value={1}>Oui</MenuItem>
                    <MenuItem value={0}>Non</MenuItem>
                </Select>
            </Grid>
        </Grid>
    </>
}

export default ReportListFilter;