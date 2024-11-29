class ApplicationController < ActionController::API
    include ActionController::Cookies

    # Authentication method for protected routes
    def authenticate_user!
        token = request.cookies['jwt']
        
        if token
          begin
            # Decode the JWT token
            decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
            @current_user = User.find_by(id: decoded_token[0]['user_id'])
          rescue JWT::DecodeError
            render json: { error: 'Invalid or expired token' }, status: :unauthorized and return
          end
        else
          render json: { error: 'Unauthorized access - no token' }, status: :unauthorized and return
        end
    end

end
