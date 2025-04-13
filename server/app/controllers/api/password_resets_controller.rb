class Api::PasswordResetsController < ApplicationController
    def create
      user = User.find_by(email: params[:email])
      if user
        user.send_password_reset
        render json: { message: 'Password reset email sent' }, status: :ok
      else
        render json: { error: 'Email not found' }, status: :not_found
      end
    end
  
    def update
      user = User.find_by(reset_password_token: params[:token])
      if user && !user.password_token_expired?
        if user.update(password: params[:password])
          user.update(reset_password_token: nil, reset_password_sent_at: nil)  # Clear token after successful reset
          render json: { message: 'Password successfully reset' }, status: :ok
        else
          render json: { error: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Invalid or expired token' }, status: :unprocessable_entity
      end
    end
  end
  