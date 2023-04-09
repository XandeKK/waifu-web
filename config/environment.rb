require 'bundler'
Bundler.require(:default)
Bundler.require(ENV['APP_ENV']) if ENV['APP_ENV']


require 'sinatra/base'
require_all 'app'