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
end