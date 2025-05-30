class EntreprisesController < ApplicationController
  before_action :verify_authentication
  def fetch_all
    entreprises = Entreprise.all

    render json: entreprises
  end

  def fetch
    entreprise_id = params[:id]
    entreprise = Entreprise.find(entreprise_id)

    render json: entreprise
  end

  def create
  end

  def update
  end

  def delete
  end
end