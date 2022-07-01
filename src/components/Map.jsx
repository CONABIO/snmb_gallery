
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import images from '../assets/snmb_images.json';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({setViewer}) => {

    const returnInfo = (feature, layer) => {
        layer.bindPopup(
                `<img src=${feature.properties.url} width="86" height="86" />`
        );
    }

    return (
        <MapContainer center={[22.0458888889, -100.545444444]} zoom={5} scrollWheelZoom={false} style={{ height: "50vh", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                <GeoJSON data={images} onEachFeature={returnInfo} />
            </MarkerClusterGroup>
        </MapContainer>
    )
}

export default Map;