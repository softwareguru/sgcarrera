require 'rubygems'
require 'rack-flash'
require 'sinatra'
require 'sinatra/content_for'
require 'sinatra/redirect_with_flash'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'

require 'digest/md5'

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
        session[:username] = @user.username
        redirect "/#{@user.username}", :notice => 'Usuario creado!'
    else
        redirect '/new', :warning => 'Ocurrio un error'
    end
end

get '/login' do
    haml :login
end

post '/login' do
    @username = params[:username]
    @password = params[:password]

    if @user = User.first(:username => @username, :password => @password)
        session[:username] = @username
        redirect "/#{@user.username}", :notice => 'Bienvenido'
    else
        redirect "/login", :notice => 'Error al entrar'
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
        session[:identifier] = nil
        session[:email]      = nil
        redirect "/#{@user.username}", :notice => 'Usuario creado!'
    else
        @user.errors.each do |e|
            puts e
        end
        redirect '/select', :warning => 'Ocurrio un error'
    end
end

post '/token' do
    @helper = Rpx::RpxHelper.new('0573d1252dde12c6f576c550e0d3ad5f63f08a22',
                                 'https://rpxnow.com',
                                 'sgcarrera')
    @token = params[:token]
    @info = @helper.auth_info(@token)

    if @info["identifier"]
        if @user = User.first(:identifier => @info["identifier"])
            session[:username]   = @user[:username]
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

get '/edit' do 
    @user = User.first(:username => session[:username])
    if not @details = @user.details
        @details = Details.new()
    end
    haml :edit
end

post '/edit' do 
    @user = User.first(:username => session[:username])
    @details = Details.new(params[:details])
    @details.email = @user.email
    @details.user = @user

    @details.save()

    if @details.save
        redirect "/#{@user.username}", :notice => "Data saved!"
    else
        redirect "/edit", :warning => 'Something went wrong'
    end
end

get '/:slug' do 
    if @user = User.first(:username => params[:slug])
        #@userdata = Userdata.get(params[:slug])
        @digest = Digest::MD5.hexdigest(@user.email.downcase)
        haml :profile
    else
        halt 404
    end
end
