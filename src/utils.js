import axios from "axios";

const graphqlUrl = process.env.NODE_ENV === 'development' ? "http://localhost:3000/graphql" : "https://snmb.conabio.gob.mx/graphqlzendro/graphql";


const utils = {

    getImages(pag,limit,params) {
        return axios({
            method: "get",
            url: `https://snmb.conabio.gob.mx/solr/zendro/select?indent=true&q.op=OR&q=*%3A*&rows=${limit}&start=${pag}${params.toString().replaceAll(',','')}`,
        })
    },

    getCategories() {
        return axios({
            method: "get",
            url: `https://snmb.conabio.gob.mx/solr/zendro/select?facet=on&facet.field=label&indent=true&q=*%3A*&rows=0`
        })
    },

    getANPs() {
        return axios({
            method: "get",
            url: `https://snmb.conabio.gob.mx/solr/zendro/select?facet=on&facet.field=anp&indent=true&q=*%3A*&rows=0`
        })
    },

    queryZendro(query) {
        return axios({
            method: "post",
            url: graphqlUrl,
            data: {
                "query": query
            }
        })
    }
}

export default utils;