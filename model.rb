require 'dm-core'
require 'dm-validations'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-serializer/to_json'

require 'digest/md5'

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

    has 1, :details
    has n, :experiences
    has n, :educations
    has n, :skillings
    has n, :skills, :through => :skillings
    has n, :publications
    has n, :affiliations

    def digest
      Digest::MD5.hexdigest(email.downcase)
    end

end

class Details
    include DataMapper::Resource

    property :id,       Serial, :writer => :protected, :key => true
    property :summary,  Text,   :required => false

    property :title,    String, :required => true, :length => 512

    property :address,  String, :required => false, :length => 512

    property :url,      String, :required => false, :length => 512
    property :tel,      String, :required => false, :length => 512


    belongs_to :user
end

class Company
    include DataMapper::Resource

    property :id,   Serial, :writer => :protected, :key => true
    property :name, String,   :length => 512

    has n, :experiences
    has n, :users, :through => :experiences
end

class Experience
    include DataMapper::Resource

    property :id,         Serial, :writer => :protected, :key => true
    property :title,     String,   :length => 512
    property :summary,    Text,   :length => 512

    property :start_date, Date
    property :end_date,   Date,   :required => false

    belongs_to :company
    belongs_to :user
end

class Education
    include DataMapper::Resource

    property :id,         Serial, :writer => :protected, :key => true
    property :summary,    Text,   :length => 512
    property :location,   Text,   :required => false,   :length => 512

    property :start_date, Date
    property :end_date,   Date,   :required => false
    
    belongs_to :user
end

class Skill
    include DataMapper::Resource

    property :id,   Serial, :writer => :protected, :key => true
    property :name, String

    has n, :skillings
    has n, :users, :through => :skillings

end

class Skilling #Stupid name I know, similar to tagging
    include DataMapper::Resource

    belongs_to :skill, :key => true
    belongs_to :user,  :key => true

end

class Publication
    include DataMapper::Resource

    property :id,   Serial, :writer => :protected, :key => true
    property :name, String
    property :url,  String

    belongs_to :user
end

class Affiliation
    include DataMapper::Resource

    property :id,   Serial, :writer => :protected, :key => true
    property :name, String

    belongs_to :user
end

DataMapper.auto_upgrade!

