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

#Here start the unsecured thingies
before do
  @logged_in = session[:username]
end

get '/' do
  if @logged_in
    redirect "/#{@logged_in}"
  else
  haml :index
  end
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
    redirect "/login", :warning => 'Error al entrar'
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
    session[:username]   = @user.username
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


before '/users/*' do
  if not session[:username]
    redirect to('/')
  end
end

get '/users/edit' do 
  @user = User.first(:username => session[:username])
  if not @details = @user.details
    @details = Details.new()
  end
  haml :edit
end

post '/users/edit' do 
  @user = User.first(:username => session[:username])
  numJobs = params[:jobs].to_i
  numSchools = params[:schools].to_i
  numPublications = params[:publications].to_i
  numAffiliations = params[:affiliations].to_i

  if not @details = @user.details
    @details = Details.new(params[:details])
  end

  @details.user = @user

  #Let's work with the skills
  @user.skills.clear

  if skills = params[:skills]
    skills.each do |s|
      skill = Skill.first_or_create(:name => s)
      @user.skills << skill
    end
  end

  #Now with the jobs
  for i in 1..numJobs
    exp_data = params["experience#{i}".intern]
    company_data = params["company#{i}".intern]

    if company_data[:name].empty? or exp_data[:title].empty?
      next
    end

    if exp_data["end_date"].empty?
      exp_data.delete("end_date")
    end

    company = Company.first_or_create(:name => company_data[:name])

    if exp_data.has_key?("id")
      experience = Experience.get(exp_data["id"])
      exp_data.delete("id")
      experience.attributes = exp_data
    else
      experience = Experience.new(exp_data)
    end


    experience.company = company

    @user.experiences << experience

    if experience.save
      puts "HOLA"
    else
      puts "ADIOS"
      experience.errors.each do |e|
        puts e
      end
    end

  end

  #Now with the educations
  for i in 1..numSchools
    school_data = params["education#{i}".intern]

    if school_data[:summary].empty?
      next
    end

    if school_data["end_date"].empty?
      school_data.delete("end_date")
    end

    if school_data.has_key?("id")
      school = Education.get(school_data["id"])
      school_data.delete("id")
      school.attributes = school_data
    else
      school = Education.new(school_data)
    end

    @user.educations << school
  end

  #Now with the publications
  for i in 1..numPublications
    pub_data = params["publication#{i}".intern]

    if pub_data[:name].empty?
      next
    end

    if pub_data.has_key?("id")
      pub = Publication.get(pub_data["id"])
      pub_data.delete("id")
      pub.attributes = pub_data
    else
      pub = Publication.new(pub_data)
    end

    @user.publications << pub
  end

  #Now with the affiliations
  for i in 1..numAffiliations
    aff_data = params["affiliation#{i}".intern]

    if aff_data[:name].empty?
      next
    end

    if aff_data.has_key?("id")
      aff = Affiliation.get(aff_data["id"])
      aff_data.delete("id")
      aff.attributes = aff_data
    else
      aff = Affiliation.new(aff_data)
    end

    @user.affiliations << aff
  end

  if @details.save and @user.save
    redirect "/#{@user.username}", :notice => "Data saved!"
  else
    redirect "/users/edit", :warning => 'Something went wrong'
  end
end

get '/skills/all' do
  @skills = Skill.all

  content_type :json

  @skills.to_json(:only => [:name])
end

get '/skills/current' do 
  if @user = User.first(:username => session[:username])
    @user = User.first(:username => session[:username])
    content_type :json
    @user.skills.to_json(:only => [:name])
  else
    halt 404
  end
end

get '/skills/:slug' do
  @skill = Skill.first(:name => params[:slug])
  @users = @skill.users

  unless params[:format] == 'json'
    haml :users
  else
    #content_type :json, 'charset' => 'utf-8'
    #@users.to_json
    #Not yet implemented
    halt 401
  end

end

get '/companies/all' do
  @companies = Company.all

  content_type :json

  @companies.to_json(:only => [:name])
end

get '/companies/:slug' do
  @company = Company.get(params[:slug])
  @users   = @company.users

  unless params[:format] == 'json'
    haml :users
  else
    #content_type :json, 'charset' => 'utf-8'
    #@users.to_json
    #Not yet implemented
    halt 401
  end

end

get '/:slug' do 
  if @user = User.first(:username => params[:slug])
    @digest = Digest::MD5.hexdigest(@user.email.downcase)

    haml :profile
  else
    halt 404
  end
end


