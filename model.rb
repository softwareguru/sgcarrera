require 'dm-core'
require 'dm-validations'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-serializer/to_json'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/sgcarrera.sqlite3")

class User
    include DataMapper::Resource

    property :id,            Serial, :writer => :protected, :key => true
    property :username,      String, :required => true, :message => "Invalid username", :unique => true
    property :email,         String, :format => :email_address,  :unique => true
    property :password,      String

    property :identifier,    String, :length => 512
    property :rpx,           Boolean, :default => false

    property :created_at,    DateTime
end

DataMapper.auto_upgrade!



