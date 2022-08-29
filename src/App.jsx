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
import FileDownloadIcon from '@mui/icons-material/FileDownload';



function App() {

  // images list
  const [imagesList, setList] = useState([]);

  // total items for info 
  const [totalItems, setTotalItems] = useState(0);

  // categories or labels list
  const [categoriesList, setCatList] = useState([]);

  // page info
  const [page, setPage] = useState(1);

  // set max number of pages
  const [maxPages, setMaxPages] = useState(0);

  // current category or label value
  const [catValue, setCatValue] = useState(null);

  // set current image
  const [image, setImage] = useState(null);

  // set/unset skeleton 
  const [loadedImg, changeStatusImg] = useState(false);

  // show/hide image viewer
  const [showViewer, toggleViewer] = useState(false);

  // set current categorý in select
  const [category, setCategory] = useState(null);

  // set type of image view (map,gallery,list)
  const [view, setView] = useState('gallery');

  // set list of anp's
  const [anpList,setAnpList] = useState([]);

  // set current anp
  const [anp,setAnp] = useState('')

  // show download button
  const [showDownload,setDownloadBtn] = useState(false);

  useEffect(() => {
    getImages((page - 1) * 12);
    getCategories();
    getANP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page,view])

  const handlePageChange = (e, value) => {
    if(value !== page) {
      changeStatusImg(false)
      getImages((value - 1) * 12);
      setPage(value);
    }
  }

  const getImages = async (pag) => {

    let filters = ["&fq=has_human:false"];
    
    if (catValue && Object.keys(catValue).length) {
      filters.push(`&fq=label:"${catValue}"`);
    }

    if(anp) {
      filters.push(`&fq=anp:"${anp}"`);
    }

    let images = await utils.getImages(
      pag,
      view.includes("map") ? "1000" : 12,
      filters
    );
    
    setTotalItems(images.data.response.numFound);
    setMaxPages(Math.ceil(images.data.response.numFound / 12));
    setList(images.data.response.docs);
  }


  const getCategories = async () => {
    if (categoriesList.length === 0) {
      let res = await utils.getCategories();
      let catList = res.data.facet_counts.facet_fields.label.filter(l => !Number.isInteger(l)).filter(l => l !== "Homo sapiens")
      catList = catList.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      })
      setCatList(catList);
    }
  }

  const getANP = async () => {
    if (anpList.length === 0) {
      let res = await utils.getANPs();
      let anps = res.data.facet_counts.facet_fields.anp.filter(l => !Number.isInteger(l))
      anps = anps.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      })
      setAnpList(anps);
    }
  }

  const filterByCategory = async () => {
    if (catValue !== category) {
      changeStatusImg(false)
      setPage(1);
      setCategory(catValue);
    }
    if( (catValue && Object.keys(catValue).length) || anp )
      setDownloadBtn(true);

    getImages(0);
  }

  const clearFilters = async () => {
    setPage(1);
    setCatValue(null);
    setAnp('');
    setDownloadBtn(false);
    let images = await utils.getImages(0,view.includes("map") ? "1000" : 12,["&fq=has_human:false"]);
    setList(images.data.response.docs);
    setTotalItems(images.data.response.numFound);
    setMaxPages(Math.ceil(images.data.response.numFound / 12));
    getCategories();
    getANP();
  }

  const setViewer = (image) => {
    utils.queryZendro(`
      query {
          readOneImage(id:"${image.id}") {
              image_annotationsFilter(pagination: {limit: 0}) {
                  label
                  bbox
              }
          }
      }
    `).then((res) => {
      setImage({...image,image_annotationsFilter: res.data.data.readOneImage.image_annotationsFilter});
      toggleViewer(!showViewer)
    })
  }

  const removeSkeleton = (idx, listLength) => {
    if (idx === listLength - 1)
      changeStatusImg(true)
  }

  const changeView = (view) => {
    setList([])
    setView(view)
  }

  const downloadData = async () => {

    let params = ["&wt=csv","&fq=has_human:false"];
    
    if (catValue && Object.keys(catValue).length) {
      params.push(`&fq=label:"${catValue}"`);
    }

    if(anp) {
      params.push(`&fq=anp:"${anp}"`);
    }

    let data = await utils.getImages(0,totalItems,params)
    var mimetype = 'text/csv';
    var filename = 'snmb_datos_busqueda.csv';

    // Create Dummy A Element
    var a = window.document.createElement('a');

     // createObjectURL for local data as a Blob type
    a.href = window.URL.createObjectURL(new Blob([data.data], {
      encoding: "UTF-8",
      type: mimetype + ";charset=UTF-8",
    }));
    a.download = filename;

    // Download file and remove dummy element
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <>
      <div className='main-container'>
        <div>
          <div className='search-box-filter'>
            <Autocomplete
              disablePortal
              value={catValue}
              onChange={(event, value,reason) => {
                if (value) {
                  setCatValue(Object.keys(value).length ? value : {})
                } else if (reason === "clear") {
                  setCatValue({})
                }
              }}
              id="combo-box-categories"
              options={categoriesList}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} label="Filtrar por categoría" />}
            />
            <Autocomplete
              disablePortal
              value={anp}
              onChange={(event, value) => {
                if (value) {
                  setAnp(value)
                }
              }}
              id="combo-box-anp"
              className='anp-combo'
              options={anpList}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} label="Filtrar por ANP" />}
            />
            <Button variant="text" className='filter-button' color="success" onClick={filterByCategory}>Filtrar</Button>
            <Button variant="text" className='filter-button' color="success" onClick={clearFilters}>Limpiar filtros</Button>
          </div>
          <InfoBar totalItems={totalItems} />
          {showDownload && <div className='download-btn'>
            <Button 
              variant="text"
              color="success"
              onClick={downloadData}>
                <FileDownloadIcon />&ensp;Descargar datos
            </Button>
          </div>}
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
