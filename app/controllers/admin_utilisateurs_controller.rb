class AdminUtilisateursController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    if @current_user.admin_rentecaisse
      utilisateurs = Utilisateur.all
      utilisateurs = utilisateurs.map(&:to_format)

      render json: utilisateurs
    else
      render json: { error: "Vous n'êtes pas autorisé à accéder à cette fonctionnalité" }, status: :forbidden
    end
  end

  def force_email_validation
    params.permit!

    if @current_user.admin_rentecaisse
      Utilisateur.find(params["id"]).update(email_confirme: true)
      utilisateur = Utilisateur.find(params["id"]).to_format

      render json: utilisateur
    else
      render json: { error: "Vous n'êtes pas autorisé à accéder à cette fonctionnalité" }, status: :forbidden
    end
  end

  def delete
    params.permit!

    if @current_user.admin_rentecaisse
      Utilisateur.find(params["id"]).destroy
      render json: { "id" => params["id"] }
    else
      render json: { error: "Vous n'êtes pas autorisé à accéder à cette fonctionnalité" }, status: :forbidden
    end
  end
end
