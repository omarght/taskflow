class Api::UsersController < ApplicationController
    before_action :authenticate_user!, only: [:show]

    def show
        render json: { user: @current_user }, status: :ok
    end

    def create
        user = User.new(user_params)
        if user.save
            UserMailer.welcome_email(user).deliver_now
            render json: { user: user }, status: :created
        else
            Rails.logger.error "User creation failed: #{user.errors.full_messages}"
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
