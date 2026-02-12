import React, { useState } from "react";
import './ReportListFilter.css';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";



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
        <Grid container spacing={3} direction="column"
            sx={{ justifyContent: "flex-start", alignItems: "center" }}
        >
            <h2>Filtres</h2>
            <Grid item size={12}>
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
            <Grid item size={12}>
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
            
            <Grid item container direction="column" spacing={1} size={12}>
                <InputLabel htmlFor="cours-range">Cours (min - max)</InputLabel>
                <Grid container item direction="row" spacing={1}>
                    <Grid item size={6}>
                        <TextField
                            type="number"
                            name="coursMin"
                            value={filter.coursMin}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            type="number"
                            name="coursMax"
                            value={filter.coursMax}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item container direction="column" spacing={1} size={12}>
                <InputLabel htmlFor="cours-range">Score (min - max)</InputLabel>
                <Grid container item direction="row" spacing={1}>
                    <Grid item size={6}>
                        <TextField
                            type="number"
                            name="noteMin"
                            value={filter.noteMin}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            type="number"
                            name="noteMax"
                            value={filter.noteMax}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item size={12}>
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