# Documentation de la table `tickerScore`

## Description générale
Cette table stocke les **scores** associés aux tickers financiers, calculés à partir de différents indicateurs techniques utilisés pour évaluer la performance d’un actif sur le marché. Chaque enregistrement contient les valeurs des indicateurs techniques pour un ticker spécifique à un instant donné.

---

## Structure de la table

| Attribut        | Type                        | Description                                                                                     | Notes / Subtilités                                                                                     |
|-----------------|-----------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| id              | bigint (PK, auto-incrément) | Identifiant unique du score.                                                                    | Généré automatiquement par la base.                                                                    |
| code            | varchar                     | Code du ticker auquel ce score est associé.                                                     | Clé étrangère vers la table `ticker(code)`.                                                              |
| created_at      | timestamp with time zone    | Date et heure de création du score (UTC).                                                      | Valeur par défaut : `now()`.                                                                           |
| updated_at      | timestamp without time zone | Date et heure de la dernière mise à jour du score.                                              | Valeur par défaut : `now()`.                                                                           |
| mm              | real                        | Valeur de l’indicateur **MM (Moyenne Mobile)** pour le ticker.                                   | Ne peut pas être null.                                                                                 |
| macd            | real                        | Valeur de l’indicateur **MACD (Moving Average Convergence Divergence)** pour le ticker.          | Ne peut pas être null.                                                                                 |
| bollinger       | real                        | Valeur de l’indicateur **Bollinger Bands** pour le ticker.                                       | Ne peut pas être null.                                                                                 |
| rsi             | real                        | Valeur de l’indicateur **RSI (Relative Strength Index)** pour le ticker.                         | Ne peut pas être null.                                                                                 |
| score           | real                        | Score global calculé à partir des indicateurs techniques.                                         | Ne peut pas être null.                                                                                 |
| score_version   | varchar                     | Version du calcul du score, permettant de distinguer les différentes méthodes de calcul utilisées. | Ne peut pas être vide.                                                                                 |

---

## Contraintes

| Contrainte                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| tickerScore_pkey                  | Clé primaire sur `id`.                                                     |
| tickerScore_code_fkey             | Clé étrangère : `code` référence `ticker(code)`.                           |

---

## Notes importantes

- **Lien avec le ticker** : Chaque score est associé à un ticker via le champ `code`, qui fait référence à la table `ticker`. Cela permet d'associer chaque score à un actif spécifique.
- **Indicateurs techniques** : Les champs `mm`, `macd`, `bollinger`, et `rsi` contiennent des valeurs issues d’indicateurs techniques populaires utilisés dans l’analyse des marchés financiers. Ces valeurs sont calculées en fonction des données historiques du ticker.
- **Score global** : Le champ `score` résume l’évaluation globale de l’actif, prenant en compte les différents indicateurs. Ce score peut être utilisé pour des stratégies de trading ou d'investissement.
- **Version du score** : Le champ `score_version` permet de savoir quelle méthode a été utilisée pour calculer le score, ce qui peut être utile si les méthodes de calcul sont révisées ou mises à jour au fil du temps.
- **Mise à jour des scores** : Le champ `updated_at` est mis à jour à chaque modification du score, permettant de suivre l’historique des ajustements apportés à ces valeurs.

---
