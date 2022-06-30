import React, { useEffect, useState } from 'react';
import './App.css';
import utils from './utils';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  TextField,
  Autocomplete,
  Button
} from '@mui/material';



function App() {

  const [imagesList, setList] = useState([])
  const [categoriesList, setCatList] = useState([])
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const [catValue, setCatValue] = useState(null);
  const [image, setImage] = useState(null);
  const [loadedImg, changeStatusImg] = useState(false);
  const [showViewer, toggleViewer] = useState(false);

  useEffect(() => {
    getImages((page - 1) * 12);
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
      changeStatusImg(false)
      getImages((page - 1) * 12);
      setPage(value);
  }

  const getImages = async (pag) => {
    console.log(pag)
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
    if (categoriesList.length === 0) {
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
      catList = catList.sort((a,b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      } )
      setCatList(catList);
    }
  }

  const filterByCategory = async () => {
    changeStatusImg(false)
    setPage(1);
    getImages(0);
  }

  const clearFilters = async () => {
    setPage(1);
    setCatValue(null);
    let images = await utils.getImages(0);
    setList(images.data.data.images);
    getPagesNumber();
    getCategories();
  }

  const setViewer = (url) => {
    setImage(url);
    toggleViewer(!showViewer)
  }

  const removeSkeleton = (idx,listLength) => {
    if(idx === listLength - 1)
      changeStatusImg(true)
  }

  return (
    <>
      <div className='main-container'>
        <div>
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
            <Button variant="text" className='filter-button' onClick={clearFilters}>Limpiar filtro</Button>
          </div>
          <div>
            <Masonry 
              className='masonry-box'
              columns={4}
              spacing={2}
              defaultHeight={650}
              defaultColumns={4}
              defaultSpacing={2}>
              {imagesList.map((image, index) => (
                <React.Fragment key={index}>
                  {!loadedImg && <Skeleton variant="rectangular" animation="wave" className='skeleton-height' />}
                  <img 
                    className='image-item' 
                    style={{
                      display: `${loadedImg ? 'block' : 'none'}` 
                    }}
                    src={image.url}
                    alt={image.id}
                    onLoad={() => removeSkeleton(index,imagesList.length)}
                    onClick={() => setViewer(image.url)} /> 
                </React.Fragment>
              ))}
            </Masonry>
          </div>
          <Stack justifyContent="center"
            alignItems="center" spacing={2}>
            <Pagination count={maxPages} page={page} onChange={handlePageChange} showFirstButton showLastButton />
          </Stack>
        </div>
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
