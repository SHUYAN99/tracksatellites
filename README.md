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
