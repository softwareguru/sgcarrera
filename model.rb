require 'dm-core'
require 'dm-validations'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-serializer/to_json'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/sgcarrera.sqlite3")

class User
    include DataMapper::Resource

    property :username,      String, :key => true
    validates_uniqueness_of :username, :message => "There's already a user with this username"
    property :email,         String, :format => :email_address,  :unique => true
    property :password,      String, :required => true, :message => "Invalid password"

    property :identifier,    String
    property :rpx,           Boolean, :default => false

    property :created_at,    DateTime
end

DataMapper.auto_upgrade!



