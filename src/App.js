import { useEffect, useState } from 'react';
import './App.css';
import utils from './utils';

import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  TextField,
  Autocomplete,
  Button
} from '@mui/material';



function App() {

  const [imagesList, setList] = useState([])
  const [categoriesList, setCatList] = useState([])
  const [page, setPage] = useState(0);
  const [maxPages, setMaxPages] = useState(0);
  const [catValue, setCatValue] = useState(null);
  const [image, setImage] = useState(null);
  const [showViewer, toggleViewer] = useState(false);

  useEffect(() => {
    getImages(page * 12);
  }, [page])

  const getPagesNumber = async () => {
    let pagesNumber = await utils.queryZendro(`
      query {
        countImages
      }
    `);
    setMaxPages(parseInt(pagesNumber.data.data.countImages / 12));
  }

  const handlePageChange = (e, value) => {
    if (catValue && catValue.length) {

    } else {
      getImages(page * 12);
      setPage(value);
    }
  }

  const getImages = async (pag) => {
    if (catValue && Object.keys(catValue).length) {
      let res = await utils.getCategoryImages(catValue.id, pag);
      let pageQuery = await utils.queryZendro(`
      query {
        countAnnotations(search:{
          field: category_id
          value: "${catValue.id}",
          operator: eq
        })
      }
      `);
      setMaxPages(parseInt(pageQuery.data.data.countAnnotations / 12));
      let filteredImages = res.data.data.readOneCategory.category_annotationsFilter.map(item => { return { url: item.imageTo.url, id: item.imageTo.id } });
      setList(filteredImages)
    } else {
      let images = await utils.getImages(pag);
      setList(images.data.data.images);
      getPagesNumber();
      getCategories();
    }
  }


  const getCategories = async () => {
    if (categoriesList.length == 0) {
      let res = await utils.queryZendro(`
      query {
        categories(pagination: {limit:0}, search: {
          value: "empty",
          field: name,
          operator: ne
        }) {
          id
          name
          category_annotationsFilter(pagination: {limit: 1}) {
            id
          }
        }
      }
    `);
      let catList = res.data.data.categories.filter(item => item.category_annotationsFilter.length > 0)
      catList = catList.map(item => { return { label: item.name, id: item.id } });

      setCatList(catList);
    }
  }

  const filterByCategory = async () => {
    setPage(0);
    getImages(page);
  }

  const clearFilters = async () => {
    setPage(0);
    setCatValue(null);
    let images = await utils.getImages(page);
    setList(images.data.data.images);
    getPagesNumber();
    getCategories();
  }

  const setViewer = (url) => {
    setImage(url);
    toggleViewer(!showViewer)
  }

  return (
    <>
      <div className='main-container'>
        <Box m="auto">
          <div className='search-box-filter'>
            <Autocomplete
              disablePortal
              disableClearable
              value={catValue}
              onChange={(event, value) => {
                if (value) {
                  setCatValue(Object.keys(value).length ? value : {})
                }
              }}
              id="combo-box-categories"
              options={categoriesList}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Filtrar por categoría" />}
            />
            <Button variant="text" className='filter-button' onClick={filterByCategory}>Filtrar</Button>
            <Button variant="text" className='filter-button' onClick={clearFilters}>Limpiar filtros</Button>
          </div>
          <Box m="auto" sx={{ width: 1000 }}>
            <Masonry columns={4} spacing={2}>
              {imagesList.map((image, index) => (
                <img className='image-item' key={index} src={image.url} alt={image.id} onClick={() => setViewer(image.url)} />
              ))}
            </Masonry>
          </Box>
          <Stack justifyContent="center"
            alignItems="center" spacing={2}>
            <Pagination count={maxPages} onChange={handlePageChange} showFirstButton showLastButton />
          </Stack>
        </Box>
        {showViewer && 
        <div className='image-viewer-container'>
          <div className='close-button' onClick={() => toggleViewer(!showViewer)}>Cerrar</div>
          <div className='image-viewer'>
            <img src={image} />
          </div>
        </div>}
      </div>
    </>
  );
}

export default App;
