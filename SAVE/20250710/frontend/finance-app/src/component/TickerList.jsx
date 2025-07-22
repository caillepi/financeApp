import React, { useState } from "react"
import { addTicker, removeTicker, updateTicker } from "../utils/requests"
import './TickerList.css'
import { useNavigate } from "react-router-dom";
import { useTicker } from '../hook/useTicker';
import { useTickersList } from "../hook/useTickerList";

function TickerList() {
    const [form, setForm] = useState({
        name: "",
        code: "",
        isActive: false,
    });
    const { changeTicker } = useTicker ();
    const { tickersList, changeTickersList } = useTickersList();
    const navigate = useNavigate();

    function handleOnCheckBoxClicked(code) {
        let data = tickersList.map((ticker) => {
            if (ticker.code == code) {
                return {
                    ...ticker,
                    isActive: ticker.isActive === 1 ? 0 : 1
                };
            }
            else {
                return ticker;
            }
        })

        changeTickersList(data);
    }

    async function handleUpdateItem (code, isActive) {
        await updateTicker(code, isActive ? 1 : 0);
        let data = tickersList.map((ticker) => {
            if (ticker.code == code) {
                return {
                    ...ticker,
                    isActive: isActive
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

        if (!form.name || !form.code) {
            alert("Tous les champs doivent être remplis");
            return;
        }

        await addTicker(form.name, form.code, form.isActive ? 1 : 0);
        let newTicker = {name: form.name, code: form.code, isActive: form.isActive}
        changeTickersList([...tickersList, newTicker]);

        setForm({ name: "", code: "", isActive: false }); // reset
    };

    return <>
        <div id="tickerlist">
            {/* Formulaire d'ajout */}
            <form onSubmit={handleAddTicker} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="code"
                    placeholder="Code"
                    value={form.code}
                    onChange={handleFormChange}
                />
                <label>
                    Actif
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleFormChange}
                    />
                </label>
                <button type="submit">Ajouter</button>
            </form>

            {/* Tableau des tickers */}
            <table id="tickerlist-table">
                <thead>
                    <tr>
                        <th className="tickerlist-th tickerlist-th-action">Actions</th>
                        <th className="tickerlist-th tickerlist-th-nom">Nom</th>
                        <th className="tickerlist-th tickerlist-th-code">Code</th>
                        <th className="tickerlist-th tickerlist-th-actif">Actif</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tickersList.map(({ name, code, isActive }) => (
                            <tr key={code}>
                                <td className="tickerlist-td tickerlist-table-action">
                                    <button onClick={() => handleDeleteItem(code)} 
                                            title="Supprimer" 
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        🗑️
                                    </button>
                                    <button onClick={() => handleUpdateItem(code, isActive)} 
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
                                    <input type="checkbox" checked={isActive === 1} onChange={() => handleOnCheckBoxClicked(code)}/>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </>
}

export default TickerList;