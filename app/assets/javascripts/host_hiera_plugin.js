function load_host_hiera_plugin_popup() {
  $("#hiera_variable_error").html("");
  $('#hiera_variable').val('');
  $("#hiera_variable_value").html('');
  $("#confirmation-modal #hiera_variable_value").html('');
  $("#confirmation-modal #hiera_variable_found_and_dependencies").html('');
  $("#confirmation-modal").modal('show');
  setTimeout(function() {$('#hiera_variable').focus();}, 500);
}

function list_hiera() {
  $("#hiera_variable_error").html('');
  $("#confirmation-modal #hiera_variable_value").html("");
  $("#confirmation-modal #hiera_variable_found_and_dependencies").html("");
  var url = "https://10.10.10.186:4433/";
  if (url != 0 ){
    $("#list_hiera").html("<div class='col-md-12'><img src='/assets/loader.gif' width='22' alt='Loading...'> Loading hiera variables list...  </div>");
    $.ajax({
      cache: false,
      timeout: 10000,
      data: [],
      type: 'get',
      url: url + "list_hiera",
      success: function(response) {
        $("#confirmation-modal #hiera_variable_value").html("")
        // alert("Hostgroup: " + JSON.stringify(hostgroup));
        // var resp_json = jQuery.parseJSON(response);
        //alert(JSON.stringify(response));
        if(response["error"] == null){
          html_report = ""
          if(response != "" || response != "nil") {
            //alert(JSON.stringify(response));
            //for(i=0; i<response.length; i++) {
	    var unique_variables = [];
            for(i=0; i<response.length; i++) {
              prevariable = response[i].variable;
              if ( unique_variables.indexOf(prevariable) == -1 || unique_variables.indexOf(prevariable) != null) {
                unique_variables.push(prevariable);
              }
            }
            var variables_list = unique_variables.toString();
            var variables_array = variables_list.split(",");
            var uvariables = [];

            for(a=0; a<variables_array.length; a++) {
              var usinglevariable = variables_array[a];
              if ( uvariables.indexOf(usinglevariable, 0) == -1) {
                uvariables.push(usinglevariable);
              }
            }
            clean_variable_array = uvariables.filter(function(n){return n; });
            var hostgroup = $('#hostgroup').val();
            for(b=0; b<clean_variable_array.length; b++) {
              var variable_url = clean_variable_array[b].replace( /'/g,"");
              html_report += "<form name=\"hiera_variable\" id=\"get_hiera_variable\" action=\"#hiera_plugin?hiera_variable=" + variable_url + "\" method=\"get\">";
              html_report += "<input type=\"hidden\" name=\"hostgroup\" value=\"" + hostgroup + "\" id=\"hostgroup\" class=\"form-control \" />";
              //html_report += "<input type=\"hidden\" name=\"hiera_variable\" value=\"" + variable_url + "\" id=\"hiera_variable\" class=\"form-control \">";
              html_report += "<td><tr><input type=\"submit\" onclick=\"get_hiera_plugin_value()\" value=\"" + variable_url + "\" name=\"commit\" id=\"hiera_variable_get_" + variable_url + "\" class=\"btn\"></tr></td>"
              html_report += "</form>";
            }
          }
        }
       
      $("#confirmation-modal #hiera_variable_value").html(html_report);
      },
      error: function(jqXHR, status, error){
        $("#confirmation-modal #hiera_variable_found_and_dependencies").html(Jed.sprintf(__("Error in loading hiera plugin: %s"), error));
      }
    });
  }
}

function post_hiera_plugin_value(){
  $("#hiera_value_error").html('');
  $("#confirmation-modal #hiera_variable_value").html("");
  $("#confirmation-modal #hiera_value_new").html("");
        var hiera_value_regex = /^[A-Za-z0-9.:_\-@]+$/;
//        var url = $('#host_hiera_plugin_btn').attr('data-url');
        var url = "https://10.10.10.186:4433/";
  var hiera_value = $('#hiera_value').val();
  var hiera_variable = $('#hiera_variable').val();
  var hostgroup = $('#hostgroup').val();
  var description = $('#description').val();
  //alert(url, hiera_variable, hiera_value);
  if (url != 0 ){
  //&& hiera_value_regex.test(hiera_value)){
 //   window.location.hash = "hiera_plugin?hiera_value=" + hiera_value
    $("#hiera_variable_value").html("<div class='col-md-12'><img src='/assets/loader.gif' width='22' alt='Loading...'> Loading hiera plugin value...  </div>");
    //alert(hiera_variable);
    var formData = "hostgroup=" + hostgroup;
    $.ajax({
      cache: false,
      timeout: 10000,
      data: formData,
      type: 'post',
      url: url + hiera_variable + "/" + hiera_value,
      success: function(response) {
        $("#confirmation-modal #hiera_variable_value").html("")
        // alert("Hostgroup: " + JSON.stringify(hostgroup));
        // var resp_json = jQuery.parseJSON(response)
        //alert("Value for '" + hiera_variable + "' successfully changed from '" + response + "' to '" + hiera_value + "'.");
      },
      error: function(jqXHR, status, error){
        $("#confirmation-modal #hiera_variable_value").html(Jed.sprintf(__("Error in loading hiera plugin: %s"), error));
      },
    })
  }else{
    $("#hiera_value_error").html('Invalid input');
  }
}

function get_hiera_plugin_value(){
  $("#hiera_variable_error").html('');
  $("#confirmation-modal #hiera_variable_value").html("");
  $("#confirmation-modal #hiera_variable_found_and_dependencies").html("");
        var hiera_variable_regex = /^[A-Za-z0-9.:_\-@]+$/;
        //var url = $('#host_hiera_plugin_btn').attr('data-url');
        var url = "https://10.10.10.186:4433/";
        var hostgroup = $('#hostgroup').val();
        var hiera_variable = $('#hiera_variable').val();
        var description = $('#description').val();
  if (hiera_variable != 0 && url != 0 && hiera_variable_regex.test(hiera_variable)){
    window.location.hash = "hiera_plugin?hiera_variable=" + hiera_variable
    $("#hiera_variable_value").html("<div class='col-md-12'><img src='/assets/loader.gif' width='22' alt='Loading...'> Loading hiera plugin value...  </div>");
    var formData = "hostgroup=" + hostgroup;
    $.ajax({
      cache: false,
      timeout: 10000,
      data: formData,
      type: 'post',
      url: url + hiera_variable,
      success: function(response) {
        $("#confirmation-modal #hiera_variable_value").html("")
        //alert(JSON.stringify(response))
        if(response["error"] == null){
          $("#confirmation-modal #hiera_variable_value").html("<pre>"+response["value"]+"</pre>")
          html_report = ""
          if(response["value"] != "" || response["value"] != "nil"){
            //alert(JSON.stringify(response));
            for(i=0; i<response["found"].length; i++){
              html_report += "<tr><td><b>Variable name:&emsp;</b> "+hiera_variable+"</td></tr><tr><td><b>Description:</b> " +response["description"]+"</td></tr><tr><td><b>Backend:&emsp;</b> "+response["found"][i].backend+".</td></tr><tr><td><b>File path:&emsp;</b> "
              if(response["found"][i].url == ""){
                html_report += response["found"][i].path 
              }else{
                html_report += "<a href='"+response["found"][i].url+"' target='_blank'>"+ response["found"][i].path +"</a>"
              }
              html_report += "</td></tr>"
            }
            
          }          
          
          if(response["dependency"].length > 0){
            for(i=0; i<response["dependency"].length; i++){
              
              var dep = response["dependency"][i]
              for(var key in dep) {
                html_report += "<tr><td><a href='javascript: get_hiera_plugin_dependent_value(\""+key+"\");'>"+key+"</a></td><td>"+dep[key].backend+" / "
                if(dep[key].url == ""){
                  html_report += dep[key].path 
                }else{
                  html_report += "<a href='"+dep[key].url+"' target='_blank'>"+ dep[key].path +"</a>"
                }
                html_report += "</td></tr>"
              }              
            }
          }          
          $("#confirmation-modal #hiera_variable_found_and_dependencies").html(html_report);
        }else if(response["error"]["output"] != null){
          $("#confirmation-modal #hiera_variable_value").html("<pre>"+response["error"]["output"].replace("\n", "<br />")+"</pre>");
        }else{
          $("#hiera_variable_error").html(response["error"]["message"]);
        
        }        
      },
      error: function(jqXHR, status, error){
        $("#confirmation-modal #hiera_variable_value").html(Jed.sprintf(__("Error in loading hiera plugin: %s"), error));
        
      }
    })
  }else{
    //alert(hiera_variable);
    //$("#hiera_variable_error").html('Invalid input');
  }

}

function get_hiera_plugin_dependent_value(variable){
  $('#hiera_variable').val(variable);
  get_hiera_plugin_value();
}

//$('#confirmation-modal').live('hidden.bs.modal', function () {
//   window.location.hash = "";
// });
