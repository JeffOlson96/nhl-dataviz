



export default function(arr) {
	var total = 0;
  var avg;
  /*
  if (arr.length) {
    arr.forEach((val) => {
    	//console.log()
      if (val.value) {
        total += val.value
      }
      else if (val.Goals) {
        total += val.Goals
      }
    });
    avg = total / arr.length;
  }
  */
  //console.log(arr);
  avg = arr.value / arr.roster.length;
  //this.setState({averageLeagueGoals: avg});
  arr.AvgGoals = avg;
  return avg;
}