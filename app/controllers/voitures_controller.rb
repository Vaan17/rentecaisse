class VoituresController < ApplicationController
  # Todo later : before_action: verify_authentication

  def fetch_all
    voitures = Voiture.all
    voitures = voitures.map(&:to_format)

    render json: voitures
  end

  def create
    # Todo later : add verification to check is user is entreprise, else, return.
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = 1 # use @current_user["entreprise_id"] instead of 1

    newCar = Voiture.create(attributes)

    render json: newCar.to_format
  end

  def update
    # Todo later : add verification to check is user is entreprise, else, return.
    params["data"].permit!

    attributes = params["data"].to_h

    Voiture.find(attributes["id"]).update(attributes)
    binding.pry
    updatedCar = Voiture.find(attributes["id"])

    render json: updatedCar.to_format
  end

  def delete
    # Todo later : add verification to check is user is entreprise, else, return.


  end
end