class Project < ApplicationRecord
  belongs_to :team
  has_many :tasks

  validates :title, presence: true, length: { minimum: 2 }
  validates :description, presence: true, length: { minimum: 10 }
end
