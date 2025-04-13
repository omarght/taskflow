class User < ApplicationRecord
    has_secure_password
    before_create :generate_token

    has_many :tasks

    # A user can be part of many teams (through a join table)
    has_many :user_teams
    has_many :teams, through: :user_teams

    # A user can manage many teams
    has_many :managed_teams, class_name: 'Team', foreign_key: 'manager_id'

    # Scope to get all users that are not part of a team
    #scope :not_in_team, ->(team_id) { where.not(id: UserTeam.where(team_id: team_id).select(:user_id))}
    scope :non_members, ->(team_id) { where.not(id: User.joins(:user_teams).where(user_teams: { team_id: team_id }).select(:id)) }

    validates :name, presence: true, length: { minimum: 2 }

    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

    def generate_token
        self.reset_password_token = SecureRandom.urlsafe_base64
    end

    def send_password_reset
        self.reset_password_token = SecureRandom.urlsafe_base64
        self.reset_password_sent_at = Time.zone.now
        self.save!
        puts "user: #{self.inspect}"  # Debugging line
        UserMailer.password_reset(self).deliver_now
    end

    def password_token_expired?
        reset_password_sent_at < 2.hours.ago
    end

end
