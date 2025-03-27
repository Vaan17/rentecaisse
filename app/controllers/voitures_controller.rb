class VoituresController < ApplicationController
  def fetch_all
    voitures = Voiture.all

    render json: voitures
  end

  def create
  end

  def update
  end

  def delete
  end
end