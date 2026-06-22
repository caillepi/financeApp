import { useNavigate } from 'react-router-dom';
import './ReportListTable.css';
import { useTicker } from '../hook/useTicker';
import { computeScore } from '../utils/score';
import { getCurrent, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, getSector } from '../utils/requests';

function ReportListTable ({data, setData, setSortConfig}) {
    const navigate = useNavigate();
    const { changeTicker } = useTicker();

    /**
     * Fonction qui permet de ne recharger qu'un seul élément sur demande de l'utilisateur
     * @param {String} name - nom de l'entreprise
     * @param {String} code - code de l'entreprise
     */
    async function handleReloadOneElement (name, code) {
        const dataKpiSma = await getKpiSma(code);
        const dataKpiBollinger = await getKpiBollinger(code);
        const dataKpiMacd = await getKpiMacd(code);
        const dataKpiRsi = parseInt(await getKpiRsi(code));
        const dataCurrent = await getCurrent(code);
        const dataSector = await getSector(code);

        let newData = {
            code: code,
            name: name,
            sector: dataSector,
            current: dataCurrent,
            sma: dataKpiSma,
            bollinger: dataKpiBollinger,
            rsi: dataKpiRsi,
            macd: dataKpiMacd
        }

        setData(prevData => {
            let result = [];
            prevData.forEach((item) => {
                if (item.code === code) {
                    result.push(newData);
                }
                else {
                    result.push(item);
                }
            })
            return result;
        })
        
    }
    
    /**
     * Fonction qui permet d'être redirigé vers la page du ticker cliqué
     * @param {String} code 
     */
    const handleNameClick = (code) => {
        changeTicker(code);
        navigate('/');
    }

    /**
     * Retourne un objet qui va permettre de savoir sur quelle colonne filtrer et dans quelle direction
     * @param {String} key Retourne la clé surlaquelle il va falloir filtrer
     * @returns {Object {String, String}} Retourne la clé et la direction du tri à effectuer
     */
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    return <>
        <table id="reportlist-table" style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th className="reportlist-th" style={{ width: "1%" }}></th>
                    <th className="reportlist-th" style={{ width: "9%" }} onClick={() => handleSort('name')}>Action</th>
                    <th className="reportlist-th" style={{ width: "5%" }} onClick={() => handleSort('code')}>Code</th>
                    <th className="reportlist-th" style={{ width: "7%" }} onClick={() => handleSort('sector')}>Secteur</th>
                    <th className="reportlist-th" style={{ width: "7%" }} onClick={() => handleSort('current')}>Cours actuel</th>
                    <th className="reportlist-th" style={{ width: "5%" }} onClick={() => handleSort('sma')}>MM</th>
                    <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('macd')}>MACD</th>
                    <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('bollinger')}>Bollinger Band</th>
                    <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('rsi')}>RSI</th>
                    <th className="reportlist-th" style={{ width: "3%" }} onClick={() => handleSort('score')}>Note Globale</th>
                    <th className="reportlist-th" style={{ width: "3%" }} onClick={() => handleSort('analystRating')}>Analyst Rating</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((row, index) => {
                        {/* S'il y a eu un problème lors du chargement des données */}
                        if (row.code == 'ML.PA') {
                            row.sector = 'Consumer Cyclical';
                        }
                        if (row.sector === 'N/A') {
                            return (
                                <tr key={row.code}>
                                    <td className="reportlist-td centered">
                                        <button onClick={() => handleReloadOneElement(row.name, row.code)}
                                                title="Recharger l'élément"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            ⟳
                                        </button>
                                    </td>
                                    <td className="reportlist-td" onClick={() => handleNameClick(row.code)}>
                                        <div className="reportlist-td-name">
                                            <div className="reportlist-td-name-entreprise red">
                                                {row.name}                              
                                            </div>
                                            <div className="reportlist-td-name-tooltip-container">
                                                ⓘ
                                                <div className="reportlist-td-name-tooltip">
                                                    {row.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="reportlist-td red">{row.code}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                    <td className="reportlist-td">{'-'}</td>
                                </tr>
                            )
                        } 
                        return (
                            <tr key={row.code}>
                                <td className="reportlist-td centered">
                                    <button onClick={() => handleReloadOneElement(row.name, row.code)}
                                            title="Recharger l'élément"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        ⟳
                                    </button>
                                </td>
                                <td className="reportlist-td" onClick={() => handleNameClick(row.code)}>
                                    <div className="reportlist-td-name">
                                        <div className="reportlist-td-name-entreprise">
                                            {row.name}                              
                                        </div>
                                        <div className="reportlist-td-name-tooltip-container">
                                            ⓘ
                                            <div className="reportlist-td-name-tooltip">
                                                {row.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="reportlist-td">{row.code}</td>
                                <td className="reportlist-td">{row.sector}</td>
                                <td className="reportlist-td">{row.current}</td>
                                <td className="reportlist-td">{Math.round(row.sma * 100) / 100} ({row.smaYesterday})</td>
                                <td className="reportlist-td">{Math.round(row.macd * 100) / 100} ({row.macdYesterday})</td>
                                <td className="reportlist-td">{Math.round(row.bollinger * 100) / 100} ({row.bollingerYesterday})</td>
                                <td className="reportlist-td">{Math.round(row.rsi * 100) / 100} ({row.rsiYesterday})</td>
                                <td className="reportlist-td">{row.score} ({row.scoreYesterday})</td>
                                <td className="reportlist-td">{row.averageAnalystRating}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </>
}

export default ReportListTable;