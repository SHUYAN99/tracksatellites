## Project Structure.
![alt text](https://github.com/SHUYAN99/tracksatellites/blob/main/pictures/structure1.png?raw=true)

## Designing the progress bar.
#### prerequisites of clicking `Track selected satellites`
- user selects satellites, selectedSatellites.length >= 1
  - (all satellites information, including selected or not are stored in Main.js and would be passed down to WorldMap.js)
- (optional) user sets duration, default duration is 1 if unset
#### `Track selected satellites` clicked
- call trackOnClick function
- use a timer, increment a timeCount until it hits the set duration
  - while incrementing, updating progress indicators on the progress bar with setProgressPercentage and setProgressText
  - while tracking, tell Main.js that tracking is ongoing, disable everything else
  - while tracking, give users a way to abort the tracking

![alt text](https://github.com/SHUYAN99/tracksatellites/blob/main/pictures/structure2.png?raw=true)

## Fetch the position prediction data for selected satellites to display the animation on the map.
![alt text](https://github.com/SHUYAN99/tracksatellites/blob/main/pictures/structure3.png?raw=true)
- use the observerInfo and duration requirements to call N2YO API and get position information for satellites selected for tracking
- use the position information and [React-simple-maps / marker](https://www.react-simple-maps.io/docs/marker/) to visualize (draw) these points on the map at each time step
  - After we get the positions data, we setInterval(**function that puts a marker down for each selected satellite**, 1000).
  - On every **next** second, we clear previous marker(s), and put down new ones on the map.
  - Display the "current timestamp" while tracking, which is different from real rorld time.

  - We use states to keep track of relevant information:`const [markersInfo, setMarkersInfo] = useState([])`;`const [currentTimestamp, setCurrentTimestamp] = useState('')`.