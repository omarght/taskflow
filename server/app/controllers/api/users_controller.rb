class Api::UsersController < ApplicationController
    before_action :authenticate_user!, only: [:show]

    def show
        render json: { user: @current_user }, status: :ok
    end
end
