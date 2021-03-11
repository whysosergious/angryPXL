

export const fetchJSON = async () => {
  // fetching content JSON
  await fetch('http://localhost/angryPXL/apps/testapp/data/TextContent.json'
  ,{
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(function(response){
      // console.log(response)
      return response.json();
    })
    .then(function(myJson) {
      
      ZCM = myJson;
      console.log(ZCM);
    });
}


export var ZCM = {
	
};


