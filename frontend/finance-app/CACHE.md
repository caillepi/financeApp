# Cache (frontend & backend) — Guide rapide

## Principe
- Backend: deux caches en mémoire côté serveur
  - `staticCache`: données peu changeantes (ex: `ticker` -> `name`, `sector`, `description`). Par défaut sans expiry (TTL null).
  - `dynamicCache`: données qui changent (ex: `market_trades`, `market_orders`, `current`, KPI). TTL configurable (par défaut 1h).

- Frontend: deux caches dans `localStorage`
  - `reportStaticCache`: stocke les métadonnées peu changeantes par code de ticker.
  - `reportDynamicCache`: stocke les valeurs dynamiques par code de ticker avec un `timestamp`.

Le but: éviter les appels redondants vers le backend tout en permettant un rafraîchissement contrôlé des données dynamiques.

## Emplacements et clés
- Backend (Node): `backend/utils/cache.js` exports `staticCache` et `dynamicCache`.
  - Env vars de configuration: `CACHE_DEFAULT_TTL_MS` (ms), `CACHE_CLEANUP_INTERVAL_MS` (ms).

- Frontend (localStorage):
  - `reportStaticCache` — JSON object { date, tickersListSnapshot, data: { [code]: { name, sector, description, is_active } } }
  - `reportDynamicCache` — JSON object { data: { [code]: { current, low, high, lastOpen, lastClose, min, max, dividend, sma, bollinger, macd, rsi, score, timestamp } } }

## TTLs et stratégie
- Backend dynamic default: 1 hour (configurable via `CACHE_DEFAULT_TTL_MS`).
- Frontend dynamic default used in code: 1 hour (`DYNAMIC_CACHE_TTL_MS` in hooks). Vous pouvez réduire ce TTL pour obtenir des valeurs plus fraîches.

Stratégie recommandée: `stale-while-revalidate` côté frontend — afficher le cache si valide, lancer un refresh en arrière-plan pour remplacer la valeur si obsolète.

## Opérations courantes
- Vider le cache frontend: dans DevTools -> Application -> Local Storage, supprimer `reportStaticCache` et/ou `reportDynamicCache`.
- Vider le cache backend: redémarrer le serveur (la mémoire est en RAM) ou ajouter utilitaire d'invalidation (écrire un endpoint admin si nécessaire).
- Changer TTL backend: définir `CACHE_DEFAULT_TTL_MS` dans `.env` puis redémarrer le serveur.

## Debug / vérification
- Frontend: ouvrir DevTools -> Application -> Local Storage et vérifier les clés `reportStaticCache` / `reportDynamicCache`.
- Backend: logs de service + compter les hits sur la base de données. (Option: ajouter endpoint `/debug/cache` pour exposer les clés/tailles si nécessaire — je peux l'ajouter sur demande.)

## Extensions / bonnes pratiques
- Nommez clairement les clés (préfix `reportStaticCache` / `reportDynamicCache`) pour éviter les collisions.
- Utilisez `invalidatePrefix(prefix)` côté backend pour nettoyer un groupe de clés (implémenté dans `backend/utils/cache.js`).
- Documentez toute autre cache ajoutée pour que l'équipe comprenne la séparation static/dynamic.

## Questions rapides
- Supprimer le cache frontend ? Non recommandé — il améliore l'UX et réduit les appels. Préférez la séparation static/dynamic (déjà appliquée).
- Faire du cache partagé (Redis) ? Possible si vous scalez plusieurs instances serveur.
