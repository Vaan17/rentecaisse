class VoituresController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    voitures = Voiture.all.where(entreprise_id: @current_user.entreprise_id)
    voitures = voitures.map(&:to_format)

    render json: voitures
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = @current_user["entreprise_id"]

    if Voiture.exists?(immatriculation: attributes["immatriculation"])
      render json: { error: "Immatriculation already exists" }, status: :unprocessable_entity
      return
    end

    newCar = Voiture.create(attributes)

    render json: newCar.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    if Voiture.exists?(immatriculation: attributes["immatriculation"])
      render json: { error: "Immatriculation already exists" }, status: :unprocessable_entity
      return
    end

    Voiture.find(attributes["id"]).update(attributes)
    updatedCar = Voiture.find(attributes["id"])

    render json: updatedCar.to_format
  end

  def delete
    Voiture.find(params["id"]).delete

    render json: { "id" => params["id"] }
  end
end