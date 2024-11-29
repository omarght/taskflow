class User < ApplicationRecord
    has_secure_password

    has_many :tasks

    # A user can be part of many teams (through a join table)
    has_many :user_teams
    has_many :teams, through: :user_teams

    # A user can manage many teams
    has_many :managed_teams, class_name: 'Team', foreign_key: 'manager_id'

    validates :name, presence: true, length: { minimum: 2 }

    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

end
