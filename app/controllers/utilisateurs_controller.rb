class UtilisateursController < ApplicationController
  before_action :verify_authentication

  def fetch_self
    render json: @current_user.to_format
  end
end
