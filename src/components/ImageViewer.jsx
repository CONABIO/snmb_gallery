import CloseIcon from '@mui/icons-material/Close';

const ImageViewer = ({ showViewer, toggleViewer, image }) => {

    return (
        <div className='image-viewer-container'>
          <div className='close-button' onClick={() => toggleViewer(!showViewer)}><CloseIcon /></div>
          <div className='image-viewer'>
            <img src={image} />
          </div>
        </div>
    )
}

export default ImageViewer