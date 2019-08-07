import {
    fetchUtils,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'react-admin';

/**
 * Maps react-admin queries to jsqel API
 *
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson) => {
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertDataRequestToHTTP = (type, resource, params) => {
        let url = '';
        let jsqlParams = {};
        
        switch (type) {
            case GET_LIST: 
                jsqlParams = {
                    asc_or_desc : params.sort.order,
                    filter_sort : params.sort.field,
                    table       : resource,
                    filter_field : params.filter && Object.keys(params.filter).length ? Object.keys(params.filter)[0] : null,       // Only 1 filter supported
                    filter      : params.filter && Object.keys(params.filter).length ? params.filter[Object.keys(params.filter)[0]] : null,
                    perPage     : params.pagination.perPage,
                    page        : (params.pagination.page-1)*params.pagination.perPage,
                }
                url = params.filter && Object.keys(params.filter).length ? `${apiUrl}/get_list_with_filter` : `${apiUrl}/get_list`;
                break;
            
            case GET_ONE:
                jsqlParams = {
                    table       : resource,
                    filter_field : 'id',
                    filter      : params.id,
                }
                url = `${apiUrl}/get_one`;
                break;

            case GET_MANY: 
                jsqlParams = {
                    table       : resource,
                    filter_field : 'id',
                    filter     : params.ids, // array of ids
                }
                url = `${apiUrl}/get_many`;
                break;
            
            case GET_MANY_REFERENCE: 
                jsqlParams = {
                    asc_or_desc : params.sort.order,
                    filter_sort : params.sort.field,
                    table       : resource,
                    filter_field : params.filter && Object.keys(params.filter).length ? Object.keys(params.filter)[0] : null,
                    filter      : params.filter && Object.keys(params.filter).length ? params.filter[Object.keys(params.filter)[0]] : null,
                    perPage     : params.pagination.perPage,
                    page        : params.pagination.page,
                    target      : params.target,
                    target_id   : params.id,
                }

                url = params.filter && Object.keys(params.filter).length ? `${apiUrl}/get_reference_with_filter` : `${apiUrl}/get_reference`;
                break;
            

            case UPDATE: 
                jsqlParams = {
                    table       : resource,
                    filter_field : 'id',
                    filter      : params.id,
                    data        : params.data
                }
                 
                url = `${apiUrl}/update_one`;
                break;
            
            case CREATE: 
                 jsqlParams = {
                    table       : resource,
                    data        : params.data
                }
                url = `${apiUrl}/create`;
                break;
            
            case DELETE: 
                jsqlParams = {
                    table       : resource,
                    filter_field : 'id',
                    filter      : params.id,
                }
                
                url = `${apiUrl}/delete_one`;
                break;

            case DELETE_MANY : 
                jsqlParams = {
                    table       : resource,
                    filter_field : 'id',
                    filter      : params.ids,
                }
                
                url = `${apiUrl}/delete_many`;
                break;

            default:
                throw new Error(`Unsupported fetch action type ${type}`);
        }
        let options = {};
        options.method = 'POST';
        options.body = JSON.stringify( jsqlParams );    
        return { url, options };
    };

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} Data response
     */
    const convertHTTPResponse = (response, type, resource, params) => {
        const { json } = response;
        let jsqlParams = {};
        let url = '';
        let options = {};
        options.method = 'POST';

        switch (type) {
            case GET_LIST:    
                jsqlParams = {
                    asc_or_desc : params.sort.order,
                    filter_sort : params.sort.field,
                    table       : resource,
                    filter_field : params.filter && Object.keys(params.filter).length ? Object.keys(params.filter)[0] : null,       // Only 1 filter supported
                    filter      : params.filter && Object.keys(params.filter).length ? params.filter[Object.keys(params.filter)[0]] : null,
                };
                options.body = JSON.stringify( jsqlParams );
                url = params.filter && Object.keys(params.filter).length ? `${apiUrl}/count_list_with_filter` : `${apiUrl}/count_list`;
                return httpClient(url, options).then(responseCount => ({ data: json, total: responseCount.json && responseCount.json.length && responseCount.json[0].total ? parseInt(responseCount.json[0].total) : 0}))

            case GET_MANY_REFERENCE:
                // need an additional query to get the count
                jsqlParams = {
                    asc_or_desc : params.sort.order,
                    filter_sort : params.sort.field,
                    table       : resource,
                    filter_field : params.filter && Object.keys(params.filter).length ? Object.keys(params.filter)[0] : null,
                    filter      : params.filter && Object.keys(params.filter).length ? params.filter[Object.keys(params.filter)[0]] : null,
                    target      : params.target,
                    target_id   : params.id,
                }
                options.body = JSON.stringify( jsqlParams );
                url = params.filter && Object.keys(params.filter).length ? `${apiUrl}/count_reference_with_filter` : `${apiUrl}/count_reference`;
                return httpClient(url, options).then(responseCount => ({ data: json, total: responseCount.json && responseCount.json.length && responseCount.json[0].total ? parseInt(responseCount.json[0].total) : 0}))

            case GET_ONE:
            case UPDATE:
            case CREATE:
                return { data: json[0] };
            
            case DELETE: 
                return { data: params };
            default:
                return { data: json };
        }
    };

    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a data response
     */
    return (type, resource, params) => {
        
        const { url, options } = convertDataRequestToHTTP(
            type,
            resource,
            params
        );

        return httpClient(url, options).then(response =>
            convertHTTPResponse(response, type, resource, params)
        );
    };
};