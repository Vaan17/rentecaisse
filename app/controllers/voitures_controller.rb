class VoituresController < ApplicationController
  # Todo later : before_action: verify_authentication

  def fetch_all
    voitures = Voiture.all

    render json: voitures
  end

  def create
    # Todo later : add verification to check is user is entreprise, else, return.
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = 1 # use @current_user["entreprise_id"] instead of 1

    newCar = Voiture.create(attributes)

    render json: newCar
  end

  def update
    # Todo later : add verification to check is user is entreprise, else, return.


  end

  def delete
    # Todo later : add verification to check is user is entreprise, else, return.


  end
end