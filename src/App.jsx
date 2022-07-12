import React, { useEffect, useState } from 'react';
import './App.css';
import utils from './utils';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  TextField,
  Autocomplete,
  Button
} from '@mui/material';

import InfoBar from './components/InfoBar';
import ImageViewer from './components/ImageViewer';
import Gallery from './components/Gallery';
import ListItems from './components/ListItems';
import Map from './components/Map';
import CollectionsIcon from '@mui/icons-material/Collections';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';



function App() {

  const [imagesList, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categoriesList, setCatList] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const [catValue, setCatValue] = useState(null);
  const [image, setImage] = useState(null);
  const [loadedImg, changeStatusImg] = useState(false);
  const [showViewer, toggleViewer] = useState(false);
  const [category, setCategory] = useState(null);
  const [view, setView] = useState('gallery');

  useEffect(() => {
    getImages((page - 1) * 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page,view])

  const getPagesNumber = async () => {
    let pagesNumber = await utils.queryZendro(`
      query {
        countImages
      }
    `);
    setTotalItems(pagesNumber.data.data.countImages);
    setMaxPages(Math.ceil(pagesNumber.data.data.countImages / 12));
  }

  const handlePageChange = (e, value) => {
    changeStatusImg(false)
    getImages((page - 1) * 12);
    setPage(value);
  }

  const getImages = async (pag) => {
    if (catValue && Object.keys(catValue).length) {
      let res = await utils.getCategoryImages(
          catValue.id,
          pag,
          view.includes("map") ? "1000" : false);
      let pageQuery = await utils.queryZendro(`
      query {
        countAnnotations(search:{
          field: category_id
          value: "${catValue.id}",
          operator: eq
        })
      }
      `);
      setTotalItems(pageQuery.data.data.countAnnotations);
      setMaxPages(Math.ceil(pageQuery.data.data.countAnnotations / 12));
      let filteredImages = res.data.data.readOneCategory.category_annotationsFilter.map(item => {
        return {
          url: item.imageTo.url,
          id: item.imageTo.id,
          date_captured: item.imageTo.date_captured,
          latitude: item.imageTo.latitude,
          longitude: item.imageTo.longitude,
          image_annotationsFilter: item.imageTo.image_annotationsFilter
        }
      });
      setList(filteredImages)
    } else {
      let images = await utils.getImages(
        pag,
        view.includes("map") ? "1000" : false);
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
      catList = catList.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      })
      setCatList(catList);
    }
  }

  const filterByCategory = async () => {
    if (catValue !== category) {
      changeStatusImg(false)
      setPage(1);
      getImages(0);
      setCategory(catValue);
    }
  }

  const clearFilters = async () => {
    setPage(1);
    setCatValue(null);
    let images = await utils.getImages(0,view.includes("map") ? "1000" : false);
    setList(images.data.data.images);
    getPagesNumber();
    getCategories();
  }

  const setViewer = (image) => {
    setImage(image);
    toggleViewer(!showViewer)
  }

  const removeSkeleton = (idx, listLength) => {
    if (idx === listLength - 1)
      changeStatusImg(true)
  }

  const changeView = (view) => {
    setList([])
    setView(view)
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
            <Button variant="text" className='filter-button' color="success" onClick={filterByCategory}>Filtrar</Button>
            <Button variant="text" className='filter-button' color="success" onClick={clearFilters}>Limpiar filtro</Button>
          </div>
          <InfoBar totalItems={totalItems} />
          <div className='view-btn'>
            <Button
              className='map-btn'
              variant="contained"
              color="success"
              onClick={() => changeView("map")}
              disabled={view === 'map' ? true : false}><MapIcon /> &ensp;Mapa</Button>
            <Button
              className='gallery-btn'
              variant="contained"
              color="success"
              onClick={() => changeView("gallery")}
              disabled={view === 'gallery' ? true : false}><CollectionsIcon /> &ensp;Galería</Button>
            <Button
              className='list-btn'
              variant="contained"
              color="success"
              onClick={() => changeView("list")}
              disabled={view === 'list' ? true : false}><ViewListIcon /> &ensp;Lista</Button>
          </div>
          {view === 'map' && <Map imagesList={imagesList} setViewer={setViewer} />}
          {view === 'list' &&
            <ListItems
              imagesList={imagesList}
              loadedImg={loadedImg}
              removeSkeleton={removeSkeleton}
              setViewer={setViewer} />}
          {view === 'gallery' &&
            <Gallery
              imagesList={imagesList}
              loadedImg={loadedImg}
              removeSkeleton={removeSkeleton}
              setViewer={setViewer} />}
          {view !== 'map' && <Stack justifyContent="center"
            alignItems="center" spacing={2}>
            <Pagination count={maxPages} page={page} onChange={handlePageChange} showFirstButton showLastButton />
          </Stack>}
        </div>
        {showViewer &&
          <ImageViewer showViewer={showViewer} toggleViewer={toggleViewer} image={image} />}
      </div>
    </>
  );
}

export default App;
