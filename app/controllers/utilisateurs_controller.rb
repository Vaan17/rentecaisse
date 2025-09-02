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
    confirmation_url = "#{ENV['URL_SITE']}/confirm_email?token=#{newUser.confirmation_token}"
    UserMailer.send_mail(
      email: newUser.email,
      subject: "Invitation sur rentecaisse",
      htmlContent: "
        <html>
          <head></head>
          <body>
            <p>Bonjour,</p>
            <p>On vous invite à rejoindre rentecaisse, cliquez ici : <a href='#{confirmation_url}'>#{confirmation_url}</a></p>
            <br/>
            <p>Voici vos identifiants de connexion :</p>
            <i>( Ces identifiants sont valides pendant une durée de 48h, au delà, ils seront supprimés)</i>
            <p><b>Email :</b> #{params["data"]["email"]}</p>
            <p><b>Mot de passe :</b> #{params["data"]["password"]}</p>
            <br/>
            <p>Cordialement,</p>
            <p>L'équipe Rentecaisse</p>
          </body>
        </html>
      "
    ).deliver_later # envoi d'un mail pour confirmer l'email

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

  # Récupérer le nombre d'utilisateurs en attente de validation pour l'entreprise et le site de l'utilisateur
  def get_pending_count
    # Vérifier que l'utilisateur est un administrateur d'entreprise
    unless @current_user.admin_entreprise
      return render json: { error: "Vous n'êtes pas autorisé à accéder à cette information" }, status: :forbidden
    end
    
    entreprise_id = @current_user.entreprise_id
    site_id = @current_user.site_id
    
    # Utiliser le service pour compter les utilisateurs en attente
    count = UserService.count_pending_validations(entreprise_id, site_id)
    
    render json: { pending_users_count: count }
  end
end
