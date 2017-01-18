require File.expand_path('../lib/hiera_plugin/version', __FILE__)
#require 'date'

Gem::Specification.new do |s|
  s.name        = 'hiera_plugin'
  s.version     = HieraPlugin::VERSION
  s.authors     = ['Jakub Pazdyga']
  s.email       = ['admin@lascalia.com']
  s.homepage    = 'http://jakub.pazdyga.pl'
  s.summary     = 'Summary of HieraPlugin.'
  # also update locale/gemspec.rb
  s.description = 'Description of HieraPlugin.'

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir['test/**/*']


  s.add_dependency 'deface'
end
