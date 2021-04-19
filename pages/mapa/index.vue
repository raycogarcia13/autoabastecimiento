<template>
  <v-row >
    
    <v-col cols="12" >

      <client-only>
        <l-map ref="map" :zoom="1" 
                      :bounds="bounds" 
                      :maxZoom="17"
                      :minZoom="1"
                      style="height: 85vh; width: 100%; z-index:1"
                      >
          <l-tile-layer
                      :url="url"
                      :attribution="attribution"
                      layer-type="base"
                      name="Ráster" />
          <l-geo-json :options="optPuntos" :geojson="puntos"></l-geo-json>
          <l-geo-json :options="optUnidades" :geojson="unidades"></l-geo-json>
        </l-map>
      </client-only>
       <v-snackbar
          v-model="snack.active"
          :timeout="snack.timeout"
          shaped
          color="rgba(15,123,74,0.5)"
          top
          right
        >
          {{ snack.text }}
        </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>

let L = {icon(){}};
if(process.browser) L = require('leaflet')

export default {

  data: () => ({
      snack:{
        active: false,
        text: '',
        timeout: 2000,
        id:null,
      },
      bounds: [
               [21.8932641596, -82.8244219401],
               [21.9016376414, -82.8096053901]
         ],
      center:[],
          url: 'http://raster.enpa.iju.minag.cu/osm/{z}/{x}/{y}.jpg',
          // url: 'http://localhost/raster/{z}/{x}/{y}.jpg',
         attribution:
         '&copy; <a mailto="geomatica@enpa.iju.minag.cu">Enpa IJ</a>',
      consejos:[],
      puntos:[],
      unidades:[],
      loaded:false
    }),
    methods: {
      async loadDatas()
      {
        // let uri = '/api/mapa/consejos';
        // await this.$axios.get(uri).then(res=>{
        //   this.consejos = res.data;
        //   this.$refs.map.fitBounds(L.geoJSON(this.consejos).getBounds())
        // });
        let uri = '/api/mapa/unidades';
        await this.$axios.get(uri).then(res=>{
          this.unidades = res.data;
        });
        uri = '/api/mapa/puntos';
        await this.$axios.get(uri).then(res=>{
          this.puntos = res.data;
          this.loaded = true;
        });
        console.log(this.unidades.features);
      }
    },
    created() {
      this.loadDatas();
    },
    computed: {
      optUnidades()
      {
        return {
          onEachFeature:(feature, layer) =>{
            layer.on('click', function() {
              console.log(feature);     
              console.log(layer);
              layer.bindPopup(feature.properties.nombre);     
            }) 
          },
          pointToLayer: function(feature, latlng) {
            var marker;
            var icono;
            marker = L.marker(latlng, {
                icon:L.icon({
                  iconUrl:'/ptos/unidades.png',
                  iconSize:[40,40]
                }),
                fillOpacity: 1.0
            });
            return marker;
        }
        }
      },
      optPuntos()
      {
        return {
          onEachFeature:(feature, layer) =>{
            layer.on('click', function() {
              let txt = '';
              txt+='<b>Nombre: </b>'+feature.properties.nombre+"<br><hr>";
              txt+='<b>Base productiva: </b>'+feature.properties.basep_id.nombre+"<br>";
              txt+='<b>Consejo Popular: </b>'+feature.properties.consejo_id.nombre+" ("+feature.properties.consejo_id.habitantes+" habitantes)<br>";
              layer.bindPopup(txt);     
            }) 
          },
          pointToLayer: function(feature, latlng) {
            var marker;
            var icono;
            marker = L.marker(latlng, {
                icon:L.icon({
                  iconUrl:'/ptos/puntos.png',
                  iconSize:[40,40]
                }),
                fillOpacity: 1.0
            });
            return marker;
        }
        }
      }
    },
}
</script>
