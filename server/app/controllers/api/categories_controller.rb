class Api::CategoriesController < ApplicationController
    before_action :authenticate_user!, only: [:index, :show, :create, :update, :destroy]

    # GET /categories
    def index
        categories = Category.all
        render json: { categories: categories }, status: :ok
    end

end