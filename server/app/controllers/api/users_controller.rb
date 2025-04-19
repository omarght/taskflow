class Api::UsersController < ApplicationController
    before_action :authenticate_user!, only: [:show, :get_user, :get_current_user]

    def show
        render json: { user: @current_user }, status: :ok
    end

    def get_user
        user = User.find_by(id: params[:id])
        user = user.as_json(except: [:password_digest, :reset_password_sent_at, :reset_password_token])
        puts 'user'
        puts user
        if user
            render json: { 
                user: user,
                teams: user.teams.as_json(only: [:id, :name]),
                task_count: user.tasks.count,
                open_tasks: user.tasks.where.not(status: 'completed').count,
                completed_tasks: user.tasks.where(status: 'completed').count,
                overdue_tasks_count: user.tasks.where('due_date < ? AND status != ?', Date.today, 'completed').count,
            }, status: :ok
        else
            render json: { error: "User not found" }, status: :not_found
        end
    end

    def get_current_user
        user = @current_user
        updatedUser = user.as_json(except: [:password_digest, :reset_password_sent_at, :reset_password_token])
        if user
            render json: { 
                user: updatedUser,
                teams: user.teams.as_json(only: [:id, :name]),
                task_count: user.tasks.count,
                open_tasks: user.tasks.where.not(status: 'completed').count,
                completed_tasks: user.tasks.where(status: 'completed').count,
                overdue_tasks_count: user.tasks.where('due_date < ? AND status != ?', Date.today, 'completed').count,
            }, status: :ok
        else
            render json: { error: "User not found" }, status: :not_found
        end
    end

    def create
        user = User.new(user_params)
        if user.save
            UserMailer.welcome_email(user).deliver_now
            render user.as_json(include: { teams: { only: [:id, :name] } }), status: :created
        else
            Rails.logger.error "User creation failed: #{user.errors.full_messages}"
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def invite
        email = params[:email].downcase.strip
        name = params[:name]
    
        user = User.find_by(email: email)
        team = Team.find(params[:team_id])
        
        if user
            puts "User found"
            UserMailer.added_to_team(user, team).deliver_later
        else
            puts "No user found"
            user = User.create!(email: email, name: name, password: SecureRandom.hex(10))
            UserMailer.team_invite(user, team).deliver_later
        end
    
        team.users << user unless team.users.include?(user)
    
        render json: { message: "Invitation sent to #{email}" }, status: :ok
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
    

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
