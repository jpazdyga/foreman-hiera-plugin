
Deface::Override.new(
      :virtual_path => "hosts/show",
      :name => "hiera_plugin_button",
      :insert_bottom => "table#details_table tr td",
      :partial  => "/hiera_plugin/hosts/hiera_plugin_button"
      # :text => " <a title='' data-id='aid_hosts_hiera_plugin' data-url='#{hiera_plugin_host_path(@host)}' class='btn btn-default' onclick='load_host_hiera_plugin_popup(\"<%= @host %>\")' data-original-title='Lookup hiera variable value'>Hiera Plugin</a>"
    )

Deface::Override.new(
        :virtual_path => "hosts/show",
        :name => "hiera_plugin_popup",
        :insert_after => "table",
        :partial  => "/hiera_plugin/hosts/hiera_plugin_model_popup"
        )
