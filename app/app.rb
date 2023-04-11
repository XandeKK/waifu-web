require 'securerandom'
require 'sinatra/base'

class App < Sinatra::Base
	set :views, "app/views"
	set :sprockets, Sprockets::Environment.new(root)
  set :assets_prefix, '/assets'
  set :digest_assets, true

	configure :production, :development do
    enable :logging
  end

  configure do
    sprockets.append_path File.join(root, 'assets', 'stylesheets')
    sprockets.append_path File.join(root, 'javascripts')
    sprockets.append_path File.join(root, 'assets', 'images')

    Sprockets::Helpers.configure do |config|
      config.environment = sprockets
      config.prefix      = assets_prefix
      config.digest      = digest_assets
      config.public_path = public_folder
      config.debug       = true if development?
    end
  end

  helpers do
    include Sprockets::Helpers
  end

  get "/assets/*" do
    env["PATH_INFO"].sub!("/assets", "")
    settings.sprockets.call(env)
  end

	get '/' do
		erb :'home/index', :layout => :application
	end

  post '/upload' do
    filename = SecureRandom.uuid + "-" + params[:file][:filename]
    tempfile = params[:file][:tempfile]
    model = params[:model] 
    noise_level = params[:noise_level] || 0
    scale = params[:scale] || 2
    gpu_id = params[:gpu_id] || "auto"
    load_proc_save = params[:load_proc_save] || "1:2:2"
    target = "public/tmp/#{filename}"
    target_modified = "public/tmp/upscaled-#{filename}"

    File.open(target, 'wb') {|f| f.write tempfile.read }

    system "./app/lib/waifu2x-vulkan/waifu2x -m #{model} -i #{target} -o #{target_modified} -n #{noise_level} -s #{scale} -g #{gpu_id} -j #{load_proc_save}"
    JobFile.perform(target, 5)
    JobFile.perform(target_modified, 5)

    content_type :json
    { message: "OK", image_path: target_modified.split("/").last }.to_json
  end

  get '/image/:filename' do
    target = "public/tmp/" + params[:filename]
    send_file(target)
  end
end
