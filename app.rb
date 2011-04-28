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
        redirect "/#{@user.username}", :notice => 'Usuario creado!'
    else
        redirect '/new', :warning => 'Ocurrio un error'
    end
end

get '/select' do
    @username = session[:username]
    @identifier= session[:identifier]
    @email = session[:email]
    haml :select
end

post '/select' do
    @user = User.new(params[:user])
    @user[:rpx] = true
    if @user.save
        session[:username]   = nil
        session[:identifier] = nil
        session[:email]      = nil
        redirect "/#{@user.username}", :notice => 'Usuario creado!'
    else
        str = ''
        @user.errors.each do |error|
            str = str + error + "\n"
        end
        redirect '/select', :warning => str
    end
end

post '/token' do
    @helper = Rpx::RpxHelper.new('0573d1252dde12c6f576c550e0d3ad5f63f08a22',
                                 'https://rpxnow.com',
                                 'sgcarrera')
    @token = params[:token]
    @info = @helper.auth_info(@token)

    if @info["identifier"]
        if @user = User.first(:identifier => @info[:identifier])
            redirect "/#{@user.username}"
        else
            session[:identifier] = @info["identifier"]
            session[:username]   = @info["preferredUsername"]
            session[:email]      = @info["email"]
            redirect "/select"
        end
    else
        halt 403
    end

    haml :info
end

get '/stylesheets/*' do
    content_type 'text/css'
    sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

get '/:slug/edit' do 
    @user = User.first(:username => params[:slug])
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
    if @user = User.first(:username => params[:slug])
        #@userdata = Userdata.get(params[:slug])
        haml :profile
    else
        halt 404
    end
end
