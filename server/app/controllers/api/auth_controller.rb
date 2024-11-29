class Api::AuthController < ApplicationController
  before_action :authenticate_user!, only: [:check_authentication]
    
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      # Generate JWT token
      token = JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base, 'HS256')

      response.set_cookie(
          :jwt,
          {
              value: token,
              httponly: true,
              expires: 1.hour.from_now,
              secure: Rails.env.production?,
          }
      )

      # Respond with the user information (not the token for security)
      render json: { message: "Logged in", user: user }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def logout
    response.delete_cookie(:jwt)
    render json: { message: "Logged out" }, status: :ok
  end

  def check_authentication
    if @current_user.nil?
        render json: { error: 'Unauthorized access - no token' }, status: :unauthorized
    else
        render json: { message: 'Authorized access' }, status: :ok
    end
end

end  