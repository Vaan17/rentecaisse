class AddSessionFieldsToUtilisateurs < ActiveRecord::Migration[7.2]
  def change
    add_column :utilisateurs, :session_token, :string
    add_column :utilisateurs, :session_token_expires_at, :datetime
  end
end
