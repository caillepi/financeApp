# Documentation de la table `market_orders`

## Description générale
Cette table stocke les **ordres d’achat/vente** passés sur le marché. Elle permet de suivre l’état, le type, la quantité, le prix et les frais associés à chaque ordre.

---

## Structure de la table

| Attribut            | Type                        | Description                                                                                     | Notes / Subtilités                                                                                     |
|---------------------|-----------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| id                  | bigint (PK, auto-incrément) | Identifiant unique de l’ordre.                                                                 | Généré automatiquement par la base.                                                                    |
| code_ticker         | varchar                     | Code du ticker (ex: "AAPL", "BTC").                                                            | Clé étrangère vers `ticker(code)`. Peut être null si l’ordre n’est pas encore associé à un ticker.   |
| order_type          | varchar                     | Type de l’ordre : "buy" (achat) ou "sell" (vente).                                             | Valeur par défaut : chaîne vide.                                                                       |
| order_kind          | varchar                     | Type d’exécution : "market" (au marché), "limit" (limité), "stop" (stop loss/take profit), "stop_limit" (stop + limite). | Valeur par défaut : chaîne vide.                            |
| quantity            | integer                     | Quantité d’actifs concernés par l’ordre.                                                      | Doit être > 0.                                                                                          |
| price_order         | real                        | Prix unitaire de l’ordre (pour les ordres LIMIT).                                             | Null pour les ordres MARKET.                                                                           |
| stop_price          | real                        | Prix déclencheur pour les ordres STOP.                                                        | Null si l’ordre n’est pas de type STOP.                                                                |
| status              | varchar                     | Statut de l’ordre : "PENDING", "FILLED", "PARTIALLY_FILLED", "CANCELLED".                     | Valeur par défaut : chaîne vide.                                                                       |
| filled_quantity     | integer                     | Quantité déjà exécutée.                                                                        | <= quantity. Null si non encore exécuté.                                                              |
| avg_filled_price    | real                        | Prix moyen d’exécution pour la quantité déjà remplie.                                        | Null si non encore exécuté.                                                                           |
| fees                | real                        | Frais de transaction.                                                                          | Calculés en fonction du broker et du type d’ordre.                                                     |
| created_at          | timestamp with time zone   | Date et heure de création de l’ordre (UTC).                                                   | Obligatoire. Généré automatiquement côté backend.                                                     |
| executed_at         | timestamp                  | Date et heure d’exécution de l’ordre.                                                        | Null si l’ordre n’est pas encore exécuté. Peut être mis à jour automatiquement avec `NOW()`.         |

---

## Contraintes

| Contrainte                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| market_orders_pkey                | Clé primaire sur `id`.                                                     |
| market_ordres_code_fkey           | Clé étrangère : `code_ticker` référence `ticker(code)`.                    |

---

## Notes importantes

- **Lien avec le ticker** : `code_ticker` fait référence à un enregistrement de la table `ticker` par la clé étrangère. Cette relation garantit que chaque ordre est associé à un ticker valide.
- **Type et nature de l'ordre** : `order_type` et `order_kind` doivent être correctement définis pour distinguer les différents types d’ordres (ex. : "limite", "marché", "stop", etc.). Ces champs peuvent influencer la logique de gestion des ordres.
- **Quantité et prix** : `quantity` et `price_order` sont cruciaux pour définir les caractéristiques d'un ordre d'achat ou de vente. Ils doivent être remplis correctement pour assurer une bonne gestion des ordres.
- **Ordres partiellement remplis** : La colonne `filled_quantity` représente la quantité déjà exécutée pour cet ordre. Si cette valeur est inférieure à `quantity`, cela signifie que l'ordre est toujours partiellement en attente d'exécution.
- **Prix moyen rempli** : `avg_filled_price` indique le prix moyen des actifs déjà échangés dans le cadre de cet ordre.
- **Frais** : Les frais associés à l'ordre sont stockés dans `fees`. Ceux-ci peuvent être calculés différemment en fonction du type d'ordre ou de l'exécution (par exemple, frais fixes ou variables).
- **Dates d'exécution** : `created_at` est la date de création de l'ordre, tandis que `executed_at` est la date où l'ordre a été exécuté. Si cet ordre n'a pas encore été exécuté, `executed_at` sera null.

