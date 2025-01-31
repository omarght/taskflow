class Task < ApplicationRecord
    # Define the status options for the task
    STATUS_OPTIONS = %w[scheduled in_progress pending on_hold completed].freeze

    has_many :taggings, dependent: :destroy
    has_many :tags, through: :taggings

    belongs_to :user, optional: true

    belongs_to :project, optional: true
    belongs_to :category, optional: true

    validates :title, presence: true, length: { minimum: 2 }
    validates :description, presence: true, length: { minimum: 10 }
    validates :status, presence: true, inclusion: { in: STATUS_OPTIONS }
    validates :importance, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

    # Set default for due_date in the model (if required)
    before_validation :set_default_due_date, on: :create

    private

    def set_default_due_date
      self.due_date ||= Date.today
    end
end
