window.s;
window.path;
var post_variables = [];
var post_data = [];

function load_host_hiera_plugin_popup() {
  $("#hiera_variable_error").html("");
  $('#hiera_variable').val('');
  $("#hiera_variable_value").html('');
  $("#confirmation-modal #hiera_variable_value").html('');
  $("#confirmation-modal #hiera_variable_found_and_dependencies").html('');
  $("#confirmation-modal").modal('show');
  setTimeout(function() {$('#hiera_variable').focus();}, 500);
}

function post_hiera_plugin_value_hostgroup(sent_variables){
  var url = "https://foreman.hieraplugin.pl:4433/";
//  var hiera_variable = $('#hiera_variable').val();
//  var hiera_value = $('#hostgroup_value').val();
  var hostgroup = $('#hostgroup').val();
//  var sent_variables = $('#sent_variables').val();
  setTimeout('window.location.href="edit"', 0);
  //alert("This is the alert: " + url + sent_variables);
  if (url != 0 ){
    var formData = sent_variables;
//    alert("formData: " + formData);
    $.ajax({
      cache: false,
      timeout: 10000,
      data: formData,
      type: 'post',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      //url: url + hiera_variable + "/" + hiera_value,
      url: url + "post/the/variables",
      success: function(response) {
        $("#confirmation-modal #hiera_variable_value").html("")
        //alert("Hostgroup: " + JSON.stringify(hostgroup));
        var resp_json = jQuery.parseJSON(response);
        alert("Response: " + resp_json);
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

function list_hiera_hostgroup(hostgroup) {
  window.path = "";

  //alert("Window path: " + window.path + "Hostgroup:" + hostgroup);
  var url = "https://foreman.hieraplugin.pl:4433/";
  var hiera_variable = $('#hiera_variable').val();
  var value = "unknown";
  if (url != 0 ){
      $.ajax({
      cache: false,
      timeout: 26000,
      data: [],
      type: 'get',
      url: url + "list_hiera",
      success: function(response) {
        $("#hiera_plugin_hostgroup_tbody").html("")
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
            var post_variables = [];
            clean_variable_array = uvariables.filter(function(n){return n; });
            //html_report += "<form name=\"form_hostgroup_variable\" id=\"form_hostgroup_variable\" action=\"\">";
            for(b=0; b<clean_variable_array.length; b++) {
              var variable_url = clean_variable_array[b].replace( /'/g,"");
              var post_url = url + variable_url;
              var post_data = "hostgroup=" + hostgroup;
              html_report += "<input type=\"hidden\" name=\"hostgroup\" value=\"" + hostgroup + "\" id=\"hostgroup\" class=\"form-control \" />";
              var async = $.ajax({
                 timeout: 26000,
                 cache: false,
                 url: post_url, 
                 type: 'post', 
                 async: true,
                 data: post_data,
                 success: function(postresp) { 
                   var value = postresp.value;
                   window.path = postresp.found[0].path;
                   var description = postresp.description;
                   var variable = postresp.variable;
                   //html_report += "<form name=\"form_hostgroup_variable\" id=\"form_hostgroup_variable\" action=\"#hiera_plugin?hiera_variable=" + variable + "\" method=\"get\">";
                   //html_report += "<input type=\"hidden\" name=\"hostgroup\" value=\"" + hostgroup + "\" id=\"hostgroup\" class=\"form-control \" />";
                   html_report += "<input type=\"hidden\" name=\"hiera_variable\" value=\"" + variable + "\" id=\"hiera_variable\" class=\"form-control \">";
                   //post_variables.push("\"" + variable + "\"" + ":" + "\"" + value + "\"");
                   html_report += "<tr><td>" + variable + "</td>";
                   if ( window.path.indexOf(hostgroup) !== -1) {
                     html_report += "<td><input type=\"text\" name=\"hostgroup_value_" + variable + "\" id=\"hostgroup_value_" + variable + "\" placeholder=\"" + value + "\"></td>";
                     var hg_val_var = "hostgroup_value_" + variable;
                     //$('#form input').on("change keyup paste", function(){
                       //alert("Value to submit: " + hg_val_var);
                     //})
                   }else{
                     html_report += "<td><input type=\"text\" name=\"hostgroup_value_" + variable + "\" id=\"hostgroup_value_" + variable + "\" placeholder=\"" + value + "\" disabled></td>";
                   }
                   html_report += "<td>" + window.path + "</td>";
                   html_report += "<td>" + description + "</td>";
                   html_report += "</td></tr>";
                   //html_report += "</form>";
                 }
              })
              $("#hiera_plugin_hostgroup_tbody").html("<td></td><td></td><td><br /><br /><div class='col-md-12'><img src='/assets/loader.gif' width='22' alt='Loading...'> Loading hiera variables list...  </div></td>");
            }            
            //html_report += "</form>";
            $.when(async).done(function(value){
              $("#hiera_plugin_hostgroup_tbody").html(html_report);
              $("form").removeAttr('action').removeAttr('data-id');

              var changed = [];
              $('input').on("change paste", function(){
                var variable = JSON.stringify($(this).attr("id"));
                var value = JSON.stringify($(this).val());
                var formatted = variable + ":" + value;
                changed.push(formatted);
                window.parsed = "{ \"hostgroup\":\"" + hostgroup + "\"," + changed + " }";
                //alert("Yaml: " + window.parsed);
                $("#hiera_value_submit_hostgroup").attr("onclick", "post_hiera_plugin_value_hostgroup('" + window.parsed + "'); window.location.href='edit'");
              })
            })
          }
        }
      },
      error: function(jqXHR, status, error){
        $("#hiera_plugin_hostgroup_tbody").html(Jed.sprintf(__("Error in loading hiera plugin: %s"), error));
      }
    });
  }
}

function list_hiera() {
  $("#hiera_variable_error").html('');
  $("#confirmation-modal #hiera_variable_value").html("");
  $("#confirmation-modal #hiera_variable_found_and_dependencies").html("");
  var url = "https://foreman.hieraplugin.pl:4433/";
  var hiera_variable = $('#hiera_variable').val();
  //window.location.hash = "hiera_plugin?hiera_variable=" + hiera_variable
  if (url != 0 ){
    $("#hiera_variable_value").html("<div class='col-md-12'><img src='/assets/loader.gif' width='22' alt='Loading...'> Loading hiera variables list...  </div>");
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
              html_report += "<input type=\"hidden\" name=\"hiera_variable\" value=\"" + variable_url + "\" id=\"hiera_variable\" class=\"form-control \">";
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
        var url = "https://foreman.hieraplugin.pl:4433/";
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
        var url = "https://foreman.hieraplugin.pl:4433/";
        var hostgroup = $('#hostgroup').val();
        var hiera_variable = $('#hiera_variable').val();
        var description = $('#description').val();
        var owner = "1";
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
        owner = response["owner"];
        $("#confirmation-modal #hiera_variable_value").html("")
        //alert(JSON.stringify(response))
        if(response["error"] == null){
          $("#confirmation-modal #hiera_variable_value").html("<pre>"+response["value"]+"</pre>")
          html_report = ""

          if ( owner == 1 ) {
            $("form").submit(function() {
              $(this).find("input[id='hiera_value']").prop('disabled',false);
            }); 
          }else{
            $("form").submit(function() {
              $(this).find("input[id='hiera_value']").prop('disabled',true);
            });
        }
          if(response["value"] != "" || response["value"] != "nil"){
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
          // <input type="submit" onclick="get_hiera_plugin_value()" value="Get " name="commit" id="hiera_variable_get" class="btn btn-primary">         
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
            $(document).ready(function() {
              if (typeof window.s === 'undefined') {
                window.s = 0;
                document.getElementById("hiera_variable_get").click();
              }
            });


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
