import axios from "axios";

const graphqlUrl = process.env.NODE_ENV === 'development' ? "http://localhost:3000/graphql" : "";
export default {
    getImages(pag) {
        return axios({
            method: "post",
            url: graphqlUrl,
            data: {
                "query": `query {
                    images(pagination: { 
                        limit:12,
                        offset: ${pag}
                    }) {
                      url
                      id
                    }
                  }`
            }
        })
    },

    getCategoryImages(catId,pag) {
        return axios({
            method: "post",
            url: graphqlUrl,
            data: {
                "query": `query {
                    readOneCategory(id:${catId}){
                        category_annotationsFilter(pagination: {limit:12, offset: ${pag}}) {
                          imageTo {
                            url
                            id
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