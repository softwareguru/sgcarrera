require 'rubygems'
require 'rack-flash'
require 'sinatra'
require 'sinatra/content_for'
require 'sinatra/redirect_with_flash'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'

require 'model'
require 'rpx'

use Rack::Flash
enable :sessions

get '/' do
    haml :index
end

get '/new' do
    haml :new
end

post '/new' do
    @user = User.new(params[:user])
    if @user.save
        redirect '/', :notice => 'Usuario creado!'
    else
        redirect '/new', :warning => 'Ocurrio un error'
    end
end

post '/token' do
    @helper = Rpx::RpxHelper.new('0573d1252dde12c6f576c550e0d3ad5f63f08a22',
                                 'https://rpxnow.com',
                                 'sgcarrera')
    @token = params[:token]

    @info = @helper.auth_info(@token)
    haml :info
end

get '/stylesheets/*' do
    content_type 'text/css'
    sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

get '/:slug/edit' do 
    @user = User.get(params[:slug])
    haml :edit
end

post '/:slug/edit' do 
    #@user = User.get(params[:slug])
    #if @userdata.save
        #redirect "/#{@userdata.user_username}"
    #else
        #redirect "/#{@userdata.user_username}", :notice => 'Something went wrong'
    #end
end

get '/:slug' do 
    @user = User.get(params[:slug])
    #@userdata = Userdata.get(params[:slug])
    haml :profile
end
