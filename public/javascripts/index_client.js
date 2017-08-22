var html = [];
$('form').on('submit', function(e){
  e.preventDefault();
  load_data();
});

function load_data(){
  $('.searchResults').html('');
  $( ".waiting_loader" ).addClass( "loader" );
  $.get('/search', {
		'search_location': $("input[name='search_location']").val()
	}, function(data, textStatus, jqXHR) {
    
    if(jqXHR.status === 503){
      
    }else{
      for(var i = 0; i < data.length; i++){
        render_item(data, i);
      }
      
      $( ".waiting_loader" ).removeClass( "loader" );
      $('.searchResults').html(html.join(''));
    }
    
    
	});
}

function render_item(data, index){
  //render search item
  var create_button = '';
  if(data[index].hasOwnProperty('num_going')){
    create_button = '<button class="w3-button w3-padding-small w3-border w3-border-white" value="' + data[index].id + '"><span>' + data[index].num_going + '</span> going</button>';
  }

  html[index] = '<div class="search-item w3-container"><div class="search-item-image" style="background-image: url(' + data[index].image_url + ');"></div><p><strong>' + 
                data[index].name + '</strong></p><p>' + data[index].one_review + 
                '</p>' + create_button + '</div>';
                
}
  
  

  
