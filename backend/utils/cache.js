const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 hour
const DEFAULT_CLEANUP_INTERVAL_MS = 1000 * 60 * 5; // 5 minutes

class Cache {
    constructor() {
        this.store = new Map();
        // allow overriding via environment variables
        const envTtl = process.env.CACHE_DEFAULT_TTL_MS && Number(process.env.CACHE_DEFAULT_TTL_MS);
        const envCleanup = process.env.CACHE_CLEANUP_INTERVAL_MS && Number(process.env.CACHE_CLEANUP_INTERVAL_MS);
        this.defaultTTL = Number.isFinite(envTtl) ? envTtl : DEFAULT_TTL_MS;
        this.cleanupInterval = Number.isFinite(envCleanup) ? envCleanup : DEFAULT_CLEANUP_INTERVAL_MS;
        this._interval = null;
    }

    init(options = {}) {
        if (options.defaultTTL !== undefined) this.defaultTTL = options.defaultTTL;
        if (options.cleanupInterval !== undefined) this.cleanupInterval = options.cleanupInterval;
        this.startAutoCleanup();
    }

    _now() { return Date.now(); }

    _getEntry(key) {
        const e = this.store.get(key);
        if (!e) return null;
        if (e.expiry && e.expiry <= this._now()) {
            this.store.delete(key);
            return null;
        }
        return e.value;
    }

    get(key) {
        return this._getEntry(key);
    }

    set(key, value, ttlMs = this.defaultTTL) {
        let expiry = null;
        if (ttlMs !== null && ttlMs !== undefined) {
            if (ttlMs > 0) expiry = this._now() + ttlMs;
        }
        this.store.set(key, { value, expiry });
        return value;
    }

    async getOrSet(key, loader, options = {}) {
        const existing = this._getEntry(key);
        if (existing !== null && existing !== undefined) return existing;

        const value = await loader();
        const ttl = options.ttl === undefined ? this.defaultTTL : options.ttl;
        // Use null ttl for never-expire (static data)
        this.set(key, value, ttl);
        return value;
    }

    invalidate(key) {
        return this.store.delete(key);
    }

    invalidatePrefix(prefix) {
        let removed = 0;
        for (const key of Array.from(this.store.keys())) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
                removed++;
            }
        }
        return removed;
    }

    keys() {
        return Array.from(this.store.keys());
    }

    entries() {
        return Array.from(this.store.entries()).map(([key, entry]) => ({
            key,
            value: entry.value,
            expiry: entry.expiry
        }));
    }

    inspect({ full = false, limit = 100 } = {}) {
        const allEntries = this.entries();
        return {
            count: this.store.size,
            keys: allEntries.map(entry => entry.key),
            entries: full ? allEntries.slice(0, limit) : undefined,
            hasMore: full ? allEntries.length > limit : undefined
        };
    }

    clear() {
        this.store.clear();
    }

    _cleanup() {
        const now = this._now();
        for (const [key, entry] of this.store.entries()) {
            if (entry.expiry && entry.expiry <= now) this.store.delete(key);
        }
    }

    startAutoCleanup() {
        if (this._interval) return;
        this._interval = setInterval(() => this._cleanup(), this.cleanupInterval);
        if (this._interval.unref) this._interval.unref();
    }

    stopAutoCleanup() {
        if (!this._interval) return;
        clearInterval(this._interval);
        this._interval = null;
    }
}

// create two instances: static (never expire by default) and dynamic (configurable TTL)
const staticCache = new Cache();
const dynamicCache = new Cache();

// static cache should default to never expire
staticCache.init({ defaultTTL: null, cleanupInterval: Number(process.env.CACHE_CLEANUP_INTERVAL_MS) || DEFAULT_CLEANUP_INTERVAL_MS });

// dynamic cache uses configured TTL
dynamicCache.init({ defaultTTL: process.env.CACHE_DEFAULT_TTL_MS ? Number(process.env.CACHE_DEFAULT_TTL_MS) : DEFAULT_TTL_MS, cleanupInterval: Number(process.env.CACHE_CLEANUP_INTERVAL_MS) || DEFAULT_CLEANUP_INTERVAL_MS });

module.exports = {
    staticCache,
    dynamicCache,
};
