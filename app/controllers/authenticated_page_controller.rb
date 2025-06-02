class AuthenticatedPageController < ApplicationController
  before_action :verify_authentication
  
  def index
    Rails.logger.info "=== État de premiere_connexion pour l'utilisateur #{@current_user.id} ==="
    Rails.logger.info "Valeur de premiere_connexion: #{@current_user.premiere_connexion}"
    Rails.logger.info "=== Fin du log ==="

    if @current_user.desactive
      render json: {
        success: false,
        redirect_to: '/cancellation-account',
        message: "Votre compte est en cours de suppression"
      }
      return
    end

    if @current_user.premiere_connexion
      render json: {
        success: false,
        redirect_to: '/complete-profil',
        message: "Veuillez compléter votre profil"
      }
      return
    end

    if @current_user.entreprise_id.nil?
      render json: {
        success: false,
        redirect_to: '/affectation-entreprise',
        message: "Veuillez sélectionner votre entreprise"
      }
      return
    end

    if !@current_user.confirmation_entreprise
      render json: {
        success: false,
        redirect_to: '/statut-affectation',
        message: "Votre affectation est en attente de validation"
      }
      return
    end

    render json: {
      success: true,
      redirect_to: '/home',
      user: {
        id: @current_user.id,
        email: @current_user.email,
        nom: @current_user.nom,
        prenom: @current_user.prenom
      },
      message: "Vous êtes bien authentifié"
    }
  end

  def update_profile
    Rails.logger.info "=== Mise à jour du profil pour l'utilisateur #{@current_user.id} ==="
    Rails.logger.info "Valeur de premiere_connexion avant mise à jour: #{@current_user.premiere_connexion}"
    
    result = UserService.update_profile(@current_user, profile_params)
    
    Rails.logger.info "Valeur de premiere_connexion après mise à jour: #{@current_user.premiere_connexion}"
    Rails.logger.info "Résultat de la mise à jour: #{result.inspect}"
    Rails.logger.info "=== Fin du log ==="
    
    if result[:success]
      render json: {
        success: true,
        redirect_to: '/affectation-entreprise',
        message: "Profil mis à jour avec succès"
      }
    else
      render json: {
        success: false,
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end

  def get_entreprises
    entreprises = EntrepriseService.get_all_entreprises
    render json: { success: true, entreprises: entreprises }
  end

  def get_sites
    enterprise_id = params[:enterprise_id]
    result = EntrepriseService.get_entreprise_with_sites(enterprise_id)
    
    if result[:success]
      render json: result
    else
      render json: { success: false, message: result[:message] }, status: :not_found
    end
  end

  def verify_and_affect_user
    enterprise_id = params[:enterprise_id]
    site_id = params[:site_id]
    code = params[:code]

    verification = EntrepriseService.verify_enterprise_code(enterprise_id, code)
    
    if verification[:success]
      @current_user.update(
        entreprise_id: enterprise_id,
        site_id: site_id,
        confirmation_entreprise: false
      )
      render json: { 
        success: true, 
        redirect_to: '/statut-affectation',
        message: "Affectation réussie, en attente de validation" 
      }
    else
      render json: { success: false, message: verification[:message] }, status: :unprocessable_entity
    end
  end

  def cancel_affectation
    result = UserService.cancel_affectation(@current_user)
    
    if result[:success]
      render json: {
        success: true,
        redirect_to: '/affectation-entreprise',
        message: "Demande d'affectation annulée"
      }
    else
      render json: {
        success: false,
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end

  def get_profile_image
    # Vérification de sécurité : l'utilisateur ne peut accéder qu'à sa propre image
    requested_user_id = params[:user_id]&.to_i
    
    unless requested_user_id == @current_user.id
      render json: { 
        success: false, 
        error: 'Accès non autorisé' 
      }, status: :forbidden
      return
    end

    result = UserService.get_user_profile_image(@current_user)
    
    if result
      # Lire le contenu du fichier
      user_folder = Rails.root.join('storage', 'users', "user_#{@current_user.id}", 'profile')
      photo_path = Dir.glob("#{user_folder}/*").first
      
      if photo_path && File.exist?(photo_path)
        content = File.read(photo_path)
        content_type = case File.extname(photo_path).downcase
                      when '.jpg', '.jpeg'
                        'image/jpeg'
                      when '.png'
                        'image/png'
                      else
                        'application/octet-stream'
                      end

        render json: {
          success: true,
          image_data: Base64.encode64(content),
          content_type: content_type
        }
      else
        render json: {
          success: false,
          error: 'Image non trouvée'
        }, status: :not_found
      end
    else
      render json: {
        success: false,
        error: 'Aucune image associée'
      }, status: :not_found
    end
  end

  def get_user_profile
    render json: {
      personal_info: {
        id: @current_user.id,
        email: @current_user.email,
        prenom: @current_user.prenom,
        nom: @current_user.nom,
        adresse: @current_user.adresse,
        ville: @current_user.ville,
        code_postal: @current_user.code_postal,
        pays: @current_user.pays,
        telephone: @current_user.telephone,
        genre: @current_user.genre,
        date_naissance: @current_user.date_naissance,
        categorie_permis: @current_user.categorie_permis
      },
      entreprise_info: EntrepriseService.get_entreprise_details(@current_user.entreprise_id),
      site_info: SiteService.get_site_details(@current_user.site_id),
      photo: UserService.get_user_profile_image(@current_user)
    }
  end

  def update_user_profile
    if UserService.update_user_profile(@current_user, user_params)
      render json: { success: true, personal_info: @current_user.reload.attributes }
    else
      render json: { success: false, message: "Erreur lors de la mise à jour" }, status: :unprocessable_entity
    end
  end

  def update_profile_photo
    if params[:photo]
      result = UserService.update_user_photo(@current_user, params[:photo])
      
      if result[:success]
        render json: { 
          success: true, 
          message: result[:message],
          photo: UserService.get_user_profile_image(@current_user)
        }
      else
        render json: { 
          success: false, 
          message: result[:message]
        }, status: :unprocessable_entity
      end
    else
      render json: { 
        success: false, 
        message: "Aucune photo fournie" 
      }, status: :unprocessable_entity
    end
  end

  def request_account_deletion
    result = UserService.request_account_deletion(@current_user)
    
    if result[:success]
      render json: {
        success: true,
        redirect_to: '/cancellation-account',
        message: result[:message]
      }
    else
      render json: {
        success: false,
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end

  def cancel_deletion_request
    result = UserService.cancel_deletion_request(@current_user)
    
    if result[:success]
      render json: {
        success: true,
        redirect_to: '/home',
        message: result[:message]
      }
    else
      render json: {
        success: false,
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end

  def get_deletion_details
    if @current_user.desactive && @current_user.date_demande_suppression
      deletion_date = @current_user.date_demande_suppression
      suppression_date = deletion_date + 30.days
      remaining_days = ((suppression_date - Time.current) / 1.day).ceil
      
      render json: {
        success: true,
        deletion_request: {
          date_demande: deletion_date,
          date_suppression_prevue: suppression_date,
          jours_restants: remaining_days
        }
      }
    else
      render json: {
        success: false,
        message: "Aucune demande de suppression en cours"
      }, status: :not_found
    end
  end

  private

  def profile_params
    params.require(:profile).permit(
      :prenom,
      :nom,
      :adresse,
      :ville,
      :code_postal,
      :pays,
      :telephone,
      :genre,
      :date_naissance,
      :categorie_permis
    )
  end

  def user_params
    params.require(:user).permit(
      :email,
      :prenom,
      :nom,
      :adresse,
      :ville,
      :code_postal,
      :pays,
      :telephone,
      :genre,
      :date_naissance,
      :categorie_permis
    )
  end

  def verify_authentication
    token = request.headers['Authorization']&.split(' ')&.last
    
    unless token
      render json: { 
        success: false, 
        message: "Authentification requise",
        redirect_to: '/login'
      }, status: :unauthorized
      return
    end

    @current_user = Utilisateur.find_by(session_token: token)
    
    unless @current_user && @current_user.session_token_expires_at&.future?
      render json: { 
        success: false, 
        message: "Session expirée",
        redirect_to: '/login'
      }, status: :unauthorized
      return
    end

    # Rafraîchit le token si nécessaire (par exemple si proche de l'expiration)
    if @current_user.session_token_expires_at < 30.minutes.from_now
      @current_user.update(session_token_expires_at: 24.hours.from_now)
    end
  end
end 