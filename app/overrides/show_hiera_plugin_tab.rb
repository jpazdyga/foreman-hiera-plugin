Deface::Override.new(
        :virtual_path => "hostgroups/_form",
        :name => "hiera_plugin_hostgroups",
        :insert_bottom => "ul.nav.nav-tabs",
        :partial => "/hiera_plugin/hostgroups/hiera_plugin_hostgroups"
        )

Deface::Override.new(
        :virtual_path => "hostgroups/_form",
        :name => "hiera_plugin_hostgroups_tab-replace-form",
        :remove => "form-horizontal.well",
#        :set_attributes => "erb[loud]:contains('form_for @hostgroup')",
#        :partial => "/hiera_plugin/hostgroups/hiera_plugin_hostgroups_tab-form"
        )

Deface::Override.new(
        :virtual_path => "hostgroups/_form",
        :name => "hiera_plugin_hostgroups_tab-content",
        :insert_bottom => "div.tab-content",
        :partial => "/hiera_plugin/hostgroups/hiera_plugin_hostgroups_tab-content"
        )

Deface::Override.new(
        :virtual_path => "hostgroups/_form",
        :name => "hiera_plugin_hostgroups_tab-replace-submit",
        :replace => "erb[loud]:contains('submit_or_cancel f')",
        :partial => "/hiera_plugin/hostgroups/hiera_plugin_hostgroups_tab-submit"
        )
