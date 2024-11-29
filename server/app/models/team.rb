class Team < ApplicationRecord
  # A team has many users
  has_many :user_teams
  has_many :users, through: :user_teams

  # A team has one manager (who is a user)
  belongs_to :manager, class_name: 'User', foreign_key: 'manager_id'
  
  has_many :projects
  has_many :tasks, through: :projects

  validates :name, presence: true, length: { minimum: 2 }
end
