class UserService
def self.update_profile(user, profile_params)
  user.update!(
    prenom: profile_params[:prenom],
    nom: profile_params[:nom],
    adresse: profile_params[:adresse],
    ville: profile_params[:ville],
    code_postal: profile_params[:code_postal],
    pays: profile_params[:pays],
    telephone: profile_params[:telephone],
    genre: profile_params[:genre],
    date_naissance: profile_params[:date_naissance],
    categorie_permis: profile_params[:categorie_permis],
    premiere_connexion: false
  )
  
  { success: true }
rescue ActiveRecord::RecordInvalid => e
  { success: false, errors: e.record.errors.full_messages }
rescue StandardError => e
  { success: false, errors: [e.message] }
end

def self.cancel_affectation(user)
  begin
    user.update!(
      entreprise_id: nil,
      site_id: nil,
      confirmation_entreprise: false
    )
    { success: true }
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors.full_messages }
  rescue StandardError => e
    { success: false, errors: [e.message] }
  end
end

def self.get_user_profile_image(user)
  begin
    # Vérifier si l'utilisateur a un lien d'image
    return { success: false, error: 'Aucune image associée' } unless user&.lien_image_utilisateur

    # Construire le chemin complet en utilisant le lien stocké en base
    image_path = Rails.root.join(user.lien_image_utilisateur)
    
    # Vérifier si le fichier existe
    return { success: false, error: 'Image non trouvée' } unless File.exist?(image_path)

    # Lire le contenu du fichier
    content = File.read(image_path)
    
    # Déterminer le type MIME
    content_type = case File.extname(image_path).downcase
                  when '.jpg', '.jpeg'
                    'image/jpeg'
                  when '.png'
                    'image/png'
                  else
                    'application/octet-stream'
                  end

    { 
      success: true,
      content: content,
      content_type: content_type
    }
  rescue StandardError => e
    { success: false, error: e.message }
  end
end
end