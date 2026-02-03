# Documentation de la table `market_trades`

## Description générale
Cette table stocke les **transactions (trades)** effectuées sur le marché, liées aux ordres (`market_orders`). Chaque trade représente une exécution partielle ou totale d’un ordre.

---

## Structure de la table

| Attribut        | Type                        | Description                                                                                     | Notes / Subtilités                                                                                     |
|-----------------|-----------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| id              | bigint (PK, auto-incrément) | Identifiant unique du trade.                                                                    | Généré automatiquement par la base.                                                                    |
| created_at      | timestamp with time zone   | Date et heure de création du trade (UTC).                                                      | Valeur par défaut : `now()`.                                                                           |
| code_ticker     | varchar                     | Code du ticker (ex: "AAPL", "BTC").                                                            | Clé étrangère vers `ticker(code)`. Peut être null si le trade n’est pas encore associé à un ticker.   |
| order_id        | bigint                      | Identifiant de l’ordre (`market_orders.id`) auquel ce trade est lié.                           | Clé étrangère vers `market_orders(id)`.                                                                |
| trade_type      | varchar                     | Type de trade : "BUY" (achat) ou "SELL" (vente).                                                | Doit correspondre au `order_type` de l’ordre parent.                                                   |
| quantity        | integer                     | Quantité d’actifs échangés dans ce trade.                                                      | Doit être > 0.                                                                                          |
| price           | real                        | Prix unitaire du trade.                                                                        | Toujours renseigné.                                                                                   |
| fees            | real                        | Frais de transaction pour ce trade.                                                            | Peut être calculé en pourcentage ou en valeur fixe.                                                    |
| executed_at     | timestamp                  | Date et heure d’exécution effective du trade.                                                 | Peut être différent de `created_at` si le trade est exécuté plus tard. Null si non encore exécuté.   |

---

## Contraintes

| Contrainte                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| market_trades_pkey                | Clé primaire sur `id`.                                                     |
| market_trades_code_fkey           | Clé étrangère : `code_ticker` référence `ticker(code)`.                    |
| market_trades_order_id_fkey       | Clé étrangère : `order_id` référence `market_orders(id)`.                  |

---

## Notes importantes

- **Lien avec les ordres** : Un trade est toujours lié à un ordre (`order_id`), mais un ordre peut avoir plusieurs trades (exécution partielle).
- **Type de trade** : `trade_type` doit toujours correspondre au `order_type` de l’ordre parent.
- **Frais** : Les frais (`fees`) peuvent être différents pour chaque trade, même au sein d’un même ordre.
- **Dates** : `executed_at` peut être différent de `created_at` si le trade est planifié ou retardé.

---