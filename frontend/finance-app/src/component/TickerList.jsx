import React, { useState } from "react"
import { addTicker, getPrimaryInfo, removeTicker, updateTicker } from "../utils/requests"
import './TickerList.css'
import { useNavigate } from "react-router-dom";
import { useTicker } from '../hook/useTicker';
import { useTickersList } from "../hook/useTickerList";
import { Box, Button, Checkbox, FormControl, FormLabel, Grid, InputLabel, TextField, Toolbar } from "@mui/material";
import LayoutSidebar from "./LayoutSidebar";

function TickerList() {
    const [form, setForm] = useState({
        code: "",
        is_active: false
    });
    const { changeTicker } = useTicker ();
    const { tickersList, changeTickersList } = useTickersList();
    const navigate = useNavigate();

    function handleOnCheckBoxClicked(code) {
        let data = tickersList.map((ticker) => {
            if (ticker.code == code) {
                return {
                    ...ticker,
                    is_active: ticker.is_active === true ? false : true
                };
            }
            else {
                return ticker;
            }
        })

        changeTickersList(data);
    }

    async function handleUpdateItem (code, isActive) {
        await updateTicker(code, isActive ? true : false);
        let data = tickersList.map((ticker) => {
            if (ticker.code == code) {
                return {
                    ...ticker,
                    is_active: isActive
                };
            }
            else {
                return ticker;
            }
        })

        changeTickersList(data);
        alert('Element correctement mis à jour');
    }

    async function handleDeleteItem (code) {
        await removeTicker(code);
        let data = tickersList.filter((ticker) => ticker.code !== code);
        changeTickersList(data);
    }

    function handleWatchItemDetails (code) {
        changeTicker(code);
        navigate('../');
    }

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddTicker = async (e) => {
        e.preventDefault();

        if (!form.code) {
            alert("Merci de préciser le code de l'entreprise.");
            return;
        }

        let doublon = false;

        tickersList.forEach((ticker) => {
            if (ticker.code === form.code) {
                alert("Le code de cette entreprise est déjà présent dans la liste.");
                setForm({ name: form.name, 
                    code: "", 
                    is_active: form.is_active, 
                    sector: form.sector, 
                    industry: form.industry, 
                    exchange: form.exchange, 
                    currency: form.currency 
                }); // reset
                doublon = true;
                return;
            }
        })

        if (!doublon) {
            let primaryInfo = await getPrimaryInfo(form.code);
          
            let newTicker = {
                name: primaryInfo.name, 
                code: form.code, 
                is_active: form.is_active,
                sector: primaryInfo.sector,
                industry: primaryInfo.industry,
                exchange: primaryInfo.exchangeName,
                currency: primaryInfo.currency
            }

            await addTicker(newTicker)
            changeTickersList([...tickersList, newTicker]);
    
            setForm({ 
                name: "", 
                code: "", 
                is_active: false,
                sector: "",
                industry: "",
                exchange: "",
                currency: ""
            }); // reset
        }

    };

    return <>
        <Grid container id="tickerlist">
            <LayoutSidebar
                sidebar={
                    <>
                        <h2>Ajouter un ticker</h2>
                        <Box
                            component='form'
                            onSubmit = {handleAddTicker}
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 3,
                            }}
                        >
                            <FormControl>
                                <FormLabel htmlFor ="code">
                                    Code de l'entreprise
                                </FormLabel>
                                <TextField
                                    type="text"
                                    name="code"
                                    placeholder="Code"
                                    value={form.code}
                                    onChange={handleFormChange}
                                    variant="standard"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor='is_active'>
                                    Actif ?
                                </FormLabel>
                                <Checkbox
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <Button type="submit">
                                Ajouter
                            </Button>
                        </Box>
                    </>
                }
                main={
                    <>
                        {/* Tableau des tickers */}
                        <table id="tickerlist-table">
                            <thead>
                                <tr>
                                    <th className="tickerlist-th tickerlist-th-action">Actions</th>
                                    <th className="tickerlist-th tickerlist-th-nom">Nom</th>
                                    <th className="tickerlist-th tickerlist-th-code">Code</th>
                                    <th className="tickerlist-th tickerlist-th-actif">Actif</th>
                                    <th className="tickerlist-th tickerlist-th-actif">Secteur</th>
                                    <th className="tickerlist-th tickerlist-th-actif">Industrie</th>
                                    <th className="tickerlist-th tickerlist-th-actif">Marché</th>
                                    <th className="tickerlist-th tickerlist-th-actif">Monnaie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tickersList.map(({ name, code, is_active, sector, industry, exchange, currency }) => (
                                        <tr key={code}>
                                            <td className="tickerlist-td tickerlist-table-action">
                                                <button onClick={() => handleDeleteItem(code)} 
                                                        title="Supprimer" 
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    🗑️
                                                </button>
                                                <button onClick={() => handleUpdateItem(code, is_active)} 
                                                        title="Mettre à jour" 
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    📝
                                                </button>
                                                <button onClick={() => handleWatchItemDetails(code)} 
                                                        title="Voir le détail" 
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    🔍
                                                </button>
                                            </td> 
                                            <td className="tickerlist-td">{name}</td>
                                            <td className="tickerlist-td">{code}</td>
                                            <td className="tickerlist-td">
                                                <input type="checkbox" checked={is_active === true} onChange={() => handleOnCheckBoxClicked(code)}/>
                                            </td>
                                            <td className="tickerlist-td">{sector}</td>
                                            <td className="tickerlist-td">{industry}</td>
                                            <td className="tickerlist-td">{exchange}</td>
                                            <td className="tickerlist-td">{currency}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                }
            />
        </Grid>
    </>
}

export default TickerList;