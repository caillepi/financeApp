# Documentation de la table `ticker`

## Description générale
Cette table contient des informations sur les **tickers** des actifs financiers, tels que les actions, les crypto-monnaies, ou d’autres instruments négociés sur des bourses. Elle permet de référencer ces actifs en fonction de leur code, secteur, industrie, et autres paramètres essentiels.

---

## Structure de la table

| Attribut      | Type                        | Description                                                                                     | Notes / Subtilités                                                                                     |
|---------------|-----------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| id            | bigint (PK, auto-incrément) | Identifiant unique du ticker.                                                                    | Généré automatiquement par la base.                                                                    |
| created_at    | timestamp with time zone    | Date et heure de création du ticker (UTC).                                                      | Valeur par défaut : `now()`.                                                                           |
| updated_at    | timestamp without time zone | Date et heure de la dernière mise à jour du ticker.                                              | Valeur par défaut : `now()`.                                                                           |
| name          | varchar                     | Nom de l'actif ou de l'instrument financier.                                                     | Ne peut pas être vide.                                                                                 |
| code          | varchar                     | Code unique du ticker (ex : "AAPL", "BTC").                                                      | Clé unique.                                                                                           |
| exchange      | varchar                     | Nom de la bourse sur laquelle l'actif est négocié.                                               | Ne peut pas être vide.                                                                                 |
| currency      | varchar                     | Devise dans laquelle l'actif est coté (ex : USD, EUR).                                           | Ne peut pas être vide.                                                                                 |
| sector        | varchar                     | Secteur économique auquel l'actif appartient (ex : Technologie, Santé).                          | Peut être vide.                                                                                       |
| industry      | varchar                     | Industrie spécifique de l'actif (ex : Logiciels, Biotechnologie).                                | Peut être vide.                                                                                       |
| is_active     | boolean                     | Indique si le ticker est actif (true) ou inactif (false).                                        | Ne peut pas être null.                                                                                 |

---

## Contraintes

| Contrainte                     | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| ticker_pkey                    | Clé primaire sur `id`.                                                     |
| ticker_code_key                | Clé unique sur `code`, garantissant l’unicité du ticker.                  |
| ticker_id_key                  | Clé unique sur `id`.                                                       |

---

## Notes importantes

- **Lien avec les ordres et trades** : Le `code` du ticker est une clé de référence pour d'autres tables comme `market_orders` et `market_trades`, facilitant l'association des trades et ordres avec un actif spécifique.
- **Secteur et industrie** : `sector` et `industry` peuvent aider à catégoriser les tickers, mais ces informations sont optionnelles et peuvent être laissées vides.
- **État actif/inactif** : `is_active` permet de filtrer les tickers actifs, utile pour les systèmes qui ne veulent plus négocier ou traiter des actifs inactifs.
- **Mise à jour des tickers** : Le champ `updated_at` est mis à jour à chaque modification du ticker, permettant de savoir quand une modification a été effectuée.

---
