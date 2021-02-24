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
          <l-geo-json :geojson="geojson"></l-geo-json>
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



export default {

  data: () => ({
      snack:{
        active: false,
        text: '',
        timeout: 2000,
        id:null,
      },
      geojson:null,
      bounds: [
               [21.8932641596, -82.8244219401],
               [21.9016376414, -82.8096053901]
         ],
      center:[],
          url: 'http://raster.enpa.iju.minag.cu/osm/{z}/{x}/{y}.jpg',
         attribution:
         '&copy; <a mailto="geomatica@enpa.iju.minag.cu">Enpa IJ</a>',
    }),
    methods: {
      loadData()
      {
        let uri = '/api/consejos_geometry/'+this.$route.params.id;
        this.$axios.get(uri).then(res=>{
          this.geojson = res.data;
          this.$refs.map.fitBounds(L.geoJSON(this.geojson).getBounds())
        });
      }
    },
    mounted() {
      this.loadData();
    },
}
</script>
