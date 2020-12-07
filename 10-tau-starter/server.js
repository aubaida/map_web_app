

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
  }else if (path === '/add_img') {
  response.sendJSON({ 'status': 'ok','path':'uploads/FOOBAR.txt' });
  console.log('hi');
    var fs = require('/');

fs.writeFile("uploads/FOOBAR.txt", "Hey there!", function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
    console.log('done');
  }else {
    getFile('public' + path).subscribe(file => {
      response.sendFile(file);
    }, err => {
      response.sendText('Page not found');
    });
  }
}
