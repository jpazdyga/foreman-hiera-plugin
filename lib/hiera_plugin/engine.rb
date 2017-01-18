require 'deface'
# require 'hiera_plugin'
module HieraPlugin
  class Engine < ::Rails::Engine
    engine_name 'hiera_plugin'

    config.autoload_paths += Dir["#{config.root}/lib"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]

    initializer 'hiera_plugin.register_plugin', after: :finisher_hook do |_app|
      Foreman::Plugin.register :hiera_plugin do
        requires_foreman '>= 1.4'
        # Add permissions
        # security_block :hiera_plugin do
        #   permission :view_hiera_plugin, :'hiera_plugin/hosts' => [:new_action]
        # end

        # # Add a new role called 'Discovery' if it doesn't exist
        # role 'HieraPlugin', [:view_hiera_plugin]
      end
    end

    # Precompile any JS or CSS files under app/assets/
    # If requiring files from each other, list them explicitly here to avoid precompiling the same
    # content twice.
    assets_to_precompile = [
        'app/assets/javascripts/host_hiera_plugin.js'
    ]
    initializer 'hiera_plugin.assets.precompile' do |app|
      app.config.assets.precompile += assets_to_precompile
    end
    initializer 'hiera_plugin.configure_assets', group: :assets do
      SETTINGS[:hiera_plugin] = { :assets => { :precompile => assets_to_precompile}}
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
        Host::Managed.send(:include, HieraPlugin::HostHieraPlugin)
        Api::V2::HostsController.send(:include, HieraPlugin::HostsHieraPluginActions)
	Api::V1::HostsController.send(:include, HieraPlugin::HostsHieraPluginActions)
    end
  end
end
