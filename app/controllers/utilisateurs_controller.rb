class UtilisateursController < ApplicationController
  before_action :verify_authentication

  def fetch_self
    render json: @current_user.to_format
  end

  def fetch_all
    utilisateurs = Utilisateur.all.where(entreprise_id: @current_user.entreprise_id)
    utilisateurs = utilisateurs.map(&:to_format)

    render json: utilisateurs
  end

  def invite
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["password"] = Digest::SHA256.hexdigest(attributes["password"]) # hash password
    attributes["entreprise_id"] = @current_user["entreprise_id"]
    attributes["confirmation_entreprise"] = true

    if Utilisateur.exists?(email: attributes["email"])
      render json: { error: "Credentials already exists" }, status: :unprocessable_entity
      return
    end

    newUser = Utilisateur.create!(attributes)
    UserMailer.confirmation_email(newUser).deliver_later # envoi d'un mail pour confirmer l'email

    render json: newUser.to_format
  end

  def accept
    params.permit!

    Utilisateur.find(params["id"]).update(confirmation_entreprise: true)
    acceptedUser = Utilisateur.find(params["id"])

    render json: acceptedUser.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    Utilisateur.find(attributes["id"]).update(site_id: attributes["site_id"])
    updatedUser = Utilisateur.find(attributes["id"])

    render json: updatedUser.to_format
  end

  def kick
    params.permit!

    Utilisateur.find(params["id"]).update(entreprise_id: nil, site_id: nil)

    render json: { "id" => params["id"] }
  end
end
