import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  public modal: HTMLIonModalElement;

  public places: any[] = [];

  // vars used by google maps API
  public Map;
  public service;

  constructor(
    public androidPermissions: AndroidPermissions,
    public dialogs: Dialogs
  ) {}

  async ngOnInit() {
    // wait for the modal to present so it can close itself if there's an error
    this.modal.addEventListener( 'ionModalDidPresent', async evt => {
      // check if the google script has already loaded
      if ( window['google'] === undefined ) {
        
        // we'll need to inject the google script. Before we do so, we need internet permissions. See if we have them.
        let hasPermission: boolean;
        try {
          let result = await this.androidPermissions.checkPermission( this.androidPermissions.PERMISSION.INTERNET );
          hasPermission = result.hasPermission;
        } catch ( e ) {
          hasPermission = false;
        }

        if ( hasPermission ) {
          this.loadGoogleScript();
        } else {
          // attempt to get internet permissions.
          let gotPermission: boolean;
          try {
            let result = await this.androidPermissions.requestPermission( this.androidPermissions.PERMISSION.INTERNET );
            gotPermission = result.hasPermission;
          } catch ( e ) {
            gotPermission = false;
          }

          // now load the google script or display an error.
          if ( gotPermission ) {
            this.loadGoogleScript();
          } else {
            this.closeModalError( 'You must give the app permissions to access the internet.' );
          }
        }
      } else {
        this.findNearestLocations();
      }
    });
  }

  /** Injects a google maps script into the document and runs this.findNearestLocations() when the script is loaded */
  public loadGoogleScript() {
    // inject the google places script
    let script = document.createElement( 'script' );
    script.onload = this.findNearestLocations;
    script.onerror = e => this.closeModalError( 'Could not load nearby locations.' );
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCJ7lYvhZz09KD1KJK7x1X1PB7Z5t6LuNU&libraries=places';
    document.body.appendChild( script );
    console.log('@@b')
  }
  
  /** Constructs a google Map object if needed, and makes a call to find nearby locations. Runs this.foundPlacesCallback() to handle the google API response */
  public findNearestLocations() {
    // @TODO: wait until every part of the script is loaded??
    let geoOptions = { enableHighAccuracy: true };
    console.log('@@a')
    navigator.geolocation.getCurrentPosition(
      // success
      position => {
        console.log('@@0')
        let google = window['google'];
        let latLong = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
        if ( this.Map === undefined ) {
          // I don't actually want to display a map, even though the API makes me.
          // So let's put the map in a div that's not attached to the DOM.
          let el = document.createElement('div');
          document.body.appendChild( el );
          Map = new google.maps.Map( el );
          this.service = new google.maps.places.PlacesService( Map );
        }
console.log('@@1')
        // now finally perform a search for nearby locations
        this.service.nearbySearch({
          location: latLong,
          radius: 300 // 300m/1000ft radius
        }, this.foundPlacesCallback );
      },
      
      // failure getting geolocation
      error => {
        this.closeModalError( 'There was an error while getting your location: ' + error.message );
      },

      geoOptions
    );
  }

  /** Takes a response from google maps API and populates a list on the page with the results */
  public foundPlacesCallback( results, status ) {
    console.log('@@2')
    if ( status === window['google'].maps.places.PlacesServiceStatus.OK ) {
      // remove places where the place name is the same as the vicinity (i.e. "Denver") since this is too generic
      results = results.filter( place => place.name.toLowerCase() !== place.vicinity.toLowerCase() );
      if ( results.length === 0 ) {
        this.closeModalError( 'There were no locations found near you. Please manually enter your location.' );
      } else {
        this.places = results;
        //$scope.$digest();
      }
    } else {
      this.closeModalError( 'There was an error while finding locations near you.' );
    }
  }

  public onPlaceClick( place ) {
    // get details of the clicked place (such as address)
    this.service.getDetails( {placeId: place.place_id}, (place2, status) => {
      if ( status == window['google'].maps.places.PlacesServiceStatus.OK ) {
        // close the modal with the address of the clicked place
        this.modal.dismiss( place2.name + ', ' + place2.formatted_address );
      } else {
        this.closeModalError( 'There was an error while getting details about that location.' );
      }
    });
  }

  /** Close the modal and display an error dialog. */
  public closeModalError( message: string ) {
    this.modal.dismiss();
    this.dialogs.alert( message, 'Error' );
  }
}
