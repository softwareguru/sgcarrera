require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'
require 'model'
require 'rpx'

get '/' do
    haml :index
end

get '/new' do
    haml :new
end

post '/new' do
    @user = User.new(params[:user])
    if @user.save
        redirect "/"
    else
        redirect "/new", :notice => 'Something went wrong'
    end
end

get '/:slug/edit' do 
    @user = User.get(params[:slug])
    haml :edit
end

post '/:slug/edit' do 
    @userdata = Userdata.new(params[:slug])
    if @userdata.save
        redirect "/profile/#{@userdata.user_username}"
    else
        redirect "/profile/#{@userdata.user_username}", :notice => 'Something went wrong'
    end
end

get '/:slug' do 
    @user = User.get(params[:slug])
    @userdata = Userdata.get(params[:slug])
    haml :profile
end


get '/stylesheets/*' do
    content_type 'text/css'
    sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

