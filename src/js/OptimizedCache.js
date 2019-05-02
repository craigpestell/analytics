import {InMemoryCache} from 'apollo-boost';

const getQueryName = (query) => {
    const defs = query.definitions;
    if (defs && defs.length) {
        const operationDefinition = defs.filter(
            ({kind}) => kind === 'OperationDefinition'
        );
        return (
            operationDefinition.length &&
            operationDefinition[0].name &&
            operationDefinition[0].name.value
        );
    }
    return null;
};

/**
 * Optimized version of InMemoryCache which caches the first execution 
 * of `initialQueryName` named query for the initial pageload.
 */
export default class OptimizedInMemoryCache extends InMemoryCache {
    constructor({initialQueryName, ...rest}) {
        super(rest);
        this.initialQueryName = initialQueryName;
    }

    extract(optimistic) {
        const normalizedCache = super.extract(optimistic);
        return {_INITIAL_QUERY: this._INITIAL_QUERY, ...normalizedCache};
    }

    restore(data) {
        this._INITIAL_QUERY = data._INITIAL_QUERY;
        return super.restore(data);
    }

    reset() {
        this._INITIAL_QUERY = null;
        return super.reset();
    }

    write(write) {
        /*if (
            this.initialQueryName &&
            this.initialQueryName === getQueryName(write.query) &&
            !this._INITIAL_QUERY
        ) {
            // Save the first query, don't normalize this to the cache
            this._INITIAL_QUERY = {
                result: write.result,
                variables: write.variables
            };
            super.broadcastWatches();
            return;
        }*/
        console.log({write})
        super.write(write);
    }

    read(query) {
        if (this.useInitialQuery(query)) {
            return this._INITIAL_QUERY.result;
        }
        return super.read(query);
    }

    diff(query) {
        if (this.useInitialQuery(query)) {
            return {result: this._INITIAL_QUERY.result, complete: true};
        }
        return super.diff(query);
    }

    useInitialQuery(query) {
        return (
            this.initialQueryName &&
            this.initialQueryName === getQueryName(query.query) &&
            this._INITIAL_QUERY &&
            isEqual(this._INITIAL_QUERY.variables, query.variables)
        );
    }
}