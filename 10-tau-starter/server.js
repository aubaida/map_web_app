


function handle(request, response) {
  let path = request.path;
  if (path === '/') {
    path += 'index.html';
  }
  if (path === '/add_point') {
    localStorage.setItem(request.param.id, request.param.data);
    response.sendJSON({ 'status': 'ok' });
  } else if (path === '/all_points') {
    const allPoints = { ...localStorage };
    response.sendJSON(allPoints);
  }else if (path === '/clear_all_points') {
   localStorage.clear();
   response.sendJSON({ 'status': 'ok' });
  }else if(path === '/get-Like-DisLike'){
    const array = localStorage.getItem(request.param.id);
    response.sendJSON(array);
  }else if(path === '/update-Like-DisLike'){
    const array = localStorage.getItem(request.param.id);
    var jsonArray = JSON.parse(array);
    var dataToArray = request.param.data.split(",");
    dataToArray[0]=parseInt(dataToArray[0]);
    dataToArray[1]=parseInt(dataToArray[1]);
    jsonArray["likeDislike"]=dataToArray;
    localStorage.setItem(request.param.id, JSON.stringify(jsonArray));
    response.sendJSON({ 'status': 'ok' });
  }
  else{
    getFile('public' + path).subscribe(file => {
      response.sendFile(file);
    }, err => {
      response.sendText('Page not found');
    });
  }
}

