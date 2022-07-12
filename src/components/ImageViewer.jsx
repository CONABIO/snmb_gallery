import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef } from 'react';

const DetailItem = ({title,value}) => {
  return (
    <div className='detail-item'>
      <div className='detail-title'>{title}:</div>
      <div className='detail-item-text'>{value}</div>
    </div>
  )
}

const ImageViewer = ({ showViewer, toggleViewer, image }) => {

  const refImg = useRef(null);
  const refCanvas = useRef(null);

  useEffect(() => {
    const getImageDimensions = () => {
      if(refImg && typeof refImg !== 'undefined') {

        refCanvas.current.height = refImg.current.offsetHeight;
        refCanvas.current.width = refImg.current.offsetWidth;

        image.image_annotationsFilter.forEach((a,idx) => {
          let ctx = refCanvas.current.getContext("2d");
          ctx.strokeStyle = "#ffff00";
          ctx.lineWidth = 3;
          ctx.fillStyle = "#ffff00";
          ctx.font = "27px Arial";
          ctx.fillText(
            idx + 1,
            a.bbox[0] * refImg.current.offsetWidth / refImg.current.naturalWidth,
            (a.bbox[1] * refImg.current.offsetHeight / refImg.current.naturalHeight) - 10);
          ctx.rect(
            a.bbox[0] * refImg.current.offsetWidth / refImg.current.naturalWidth,
            a.bbox[1] * refImg.current.offsetHeight / refImg.current.naturalHeight,
            a.bbox[2] * refImg.current.offsetWidth / refImg.current.naturalWidth,
            a.bbox[3] * refImg.current.offsetHeight / refImg.current.naturalHeight);
          ctx.stroke();
        })
      }
    }
    getImageDimensions();
  })

  return (
    <div className='image-viewer-container'>
      <div className='close-button' onClick={() => toggleViewer(!showViewer)}><CloseIcon /></div>
      <div className='image-details'>
        <div className='image-viewer'>
          <img ref={refImg} src={image.url} alt='' />
          <canvas ref={refCanvas} className="annotation-canvas"></canvas>
        </div>
        <div className='image-details-text'>
          <div className='general-details'>
            <DetailItem title="Tipo de monitoreo" value={image.monitoring_type} />
            <DetailItem title="Fecha de captura" value={image.date_captured} />
            <DetailItem title="ANP" value={image.anp ? image.anp : "No defininda"} />
            <DetailItem title="Coordenadas" value={image.latitude ? image.latitude.toFixed(6) + ", " + image.longitude.toFixed(6) : "No definindas"} />
          </div>
          <div className='annotations'>
            <div className='detail-title annotations-title'>
            Anotaciones:
            </div>
            <div className='annotations-list'>
              {image.image_annotationsFilter.map((a, idx) => (
                <div key={idx} className="annotations-item">{idx + 1} .- {a.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageViewer