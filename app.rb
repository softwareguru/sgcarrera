require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'
require 'dm-core'
require 'dm-validations'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-serializer/to_json'


DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/sgcarrera.sqlite3")

class User
    include DataMapper::Resource

    property :id,           Serial
    property :username,     String
    validates_uniqueness_of :username, :message => "There's already a user with this username"
   
    property :password,     String, :required => true, :message => "Invalid password"
    property :email,         String, :format => :email_address,  :unique => true
    property :created_at,    DateTime
    
    has 1,  :userdata
end

class Userdata
    include DataMapper::Resource

    property :id,            Serial
    property :name,          String, :required => true
    property :surnames,      String, :required => true
    property :country,       String
    property :state,         String
    property :city,          String
    property :street,        String
    property :postalcode,    Integer
    property :homepage,      String
    property :telephone,     Integer
    property :cellphone,     Integer
    
    belongs_to :user          
    
end

DataMapper.auto_upgrade!

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

get '/profile' do
    haml :profile
end

get '/stylesheets/*' do
    content_type 'text/css'
    sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

