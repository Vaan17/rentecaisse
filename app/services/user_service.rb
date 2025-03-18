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

def self.update_user_profile(user, params)
  user.update(params)
end

def self.update_user_photo(user, photo)
  return false unless photo.content_type.start_with?('image/')

  # Créer le dossier pour l'utilisateur s'il n'existe pas
  user_folder = Rails.root.join('storage', 'users', "user_#{user.id}", 'profile')
  FileUtils.mkdir_p(user_folder)

  # Supprimer l'ancienne photo si elle existe
  old_photo = Dir.glob("#{user_folder}/*").first
  File.delete(old_photo) if old_photo

  # Générer un nom unique pour la nouvelle photo
  extension = File.extname(photo.original_filename)
  filename = "profile_#{Time.now.to_i}#{extension}"
  filepath = user_folder.join(filename)

  # Sauvegarder la nouvelle photo
  File.binwrite(filepath, photo.read)

  # Mettre à jour le champ lien_image_utilisateur
  user.update(lien_image_utilisateur: filename)

  true
end

def self.get_user_profile_image(user)
  user_folder = Rails.root.join('storage', 'users', "user_#{user.id}", 'profile')
  photo_path = Dir.glob("#{user_folder}/*").first
  
  if photo_path
    "http://localhost:3000/api/users/profile-image?user_id=#{user.id}&t=#{File.mtime(photo_path).to_i}"
  else
    nil
  end
end
end