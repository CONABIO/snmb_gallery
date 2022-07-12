import axios from "axios";

const graphqlUrl = process.env.NODE_ENV === 'development' ? "http://localhost:3000/graphql" : "https://snmb.conabio.gob.mx/graphqlzendro/graphql";


const utils = {
    getImages(pag,limit) {
        return axios({
            method: "post",
            url: graphqlUrl,
            data: {
                "query": `query {
                    images(pagination: { 
                        limit:${limit ? limit : "12"},
                        offset: ${pag}
                    }) {
                      url
                      id
                      date_captured
                      latitude
                      longitude
                      monitoring_type
                      anp
                      image_annotationsFilter(pagination: {limit: 0}){
                        label
                        bbox
                      }
                    }
                  }`
            }
        })
    },

    getCategoryImages(catId,pag,limit) {
        return axios({
            method: "post",
            url: graphqlUrl,
            data: {
                "query": `query {
                    readOneCategory(id:${catId}){
                        category_annotationsFilter(pagination: {limit:${limit ? limit : "12"}, offset: ${pag}}) {
                          imageTo {
                            url
                            id
                            date_captured
                            latitude
                            longitude
                            monitoring_type
                            anp
                            image_annotationsFilter(pagination: {limit: 0}){
                                label
                                bbox
                            }
                          }
                        }
                    }
                  }`
            }
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